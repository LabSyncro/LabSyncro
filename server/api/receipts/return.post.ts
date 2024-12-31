import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';
import { getToken } from '#auth';
import { Value } from '@sinclair/typebox/value';
import { Type, type Static } from '@sinclair/typebox';
import { BAD_REQUEST_CODE } from '~/constants';

const BodyDto = Type.Object({
  receipt_id: Type.Optional(Type.String()),
  device_ids: Type.Array(Type.String()),
  returner_id: Type.String(),
  return_date: Type.Date(),
  return_lab_id: Type.String(),
});

type BodyDto = Static<typeof BodyDto>;

export default defineEventHandler<
  { body: BodyDto }
>(async (event) => {
  const body = Value.Convert(BodyDto, await readBody(event));

  if (!Value.Check(BodyDto, body)) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: Invalid body',
    });
  }

  const { receipt_id: receiptId, device_ids: deviceIds, returner_id: returnerId, return_date: returnDate, return_lab_id: returnLabId } = body;

  const token = await getToken({ event });
  if (!token) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: No JWT found',
    });
  }
  const { email: checkerEmail } = token;

  if (!deviceIds.length) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: Device ids length must > 0',
    });
  }

  const [maybeCheckerId] = await db.sql`
    SELECT ${'users'}.${'id'}
    FROM ${'labs'}
      JOIN ${'users'} ON ${'users'}.${'id'} = ${'labs'}.${'admin_id'}
    WHERE ${'users'}.${'email'} = ${db.param(checkerEmail)} AND
      ${'labs'}.${'id'} = ${db.param(returnLabId)}
  `.run(dbPool);

  if (!maybeCheckerId) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: Only lab admin can submit a borrow receipt for his lab',
    });
  }

  const checkerId = maybeCheckerId.id;

  // FIXME: Need to investigate the driver to see if we should retry on serialization error
  await db.serializable(dbPool, async (dbClient) => {
    const [{ id: activityId }] = await db.sql`
      INSERT INTO ${'activities'} (type, created_at)
      VALUES ('return', ${db.param(returnDate)}) RETURNING id;
    `.run(dbClient);

    const [{ id: receiptReturnId }] = await db.sql`
      INSERT INTO ${'receipts'} (id, borrower_id, borrowed_lab_id, borrow_checker_id)
      VALUES (${db.param(receiptId)}, ${db.param(returnerId)}, ${db.param(returnLabId)}, ${db.param(checkerId)})
      RETURNING id;
    `.run(dbClient);

    await db.sql`
      INSERT INTO ${'receipts_devices'} (receipt_id, device_id, return_id, expected_returned_at, expected_returned_lab_id)
      SELECT ${db.param(receiptReturnId)}, id, ${db.param(activityId)}, ${db.param(returnDate)}, ${db.param(returnLabId)}
      FROM unnest(${db.param(deviceIds)}::TEXT[]) as devices(id);
    `.run(dbClient);

    await db.sql`
      UPDATE ${'devices'}
      SET status = 'healthy'
      WHERE ${'id'} = ANY(${db.param(deviceIds)})
    `.run(dbClient);
  });
});
