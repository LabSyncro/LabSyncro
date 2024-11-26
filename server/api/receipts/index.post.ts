import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';
import { getToken } from '#auth';
import { Value } from '@sinclair/typebox/value';
import { Type, type Static } from '@sinclair/typebox';
import { BAD_REQUEST_CODE } from '~/constants';

const BodyDto = Type.Object({
  receipt_id: Type.Optional(Type.String()),
  device_ids: Type.Array(Type.String()),
  borrower_id: Type.String(),
  borrow_date: Type.Date(),
  borrow_lab_id: Type.String(),
  expected_return_date: Type.Date(),
  expected_return_lab_id: Type.String(),
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

  const { receipt_id: _receiptId, device_ids: deviceIds, borrower_id: borrowerId, borrow_date: borrowDate, borrow_lab_id: borrowLabId, expected_return_date: expectedReturnDate, expected_return_lab_id: expectedReturnLabId } = body;

  const token = await getToken({ event });
  if (!token) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: No JWT found',
    });
  }
  const { id: checkerId } = token;

  const [{ is_admin: isAdmin }] = await db.sql`
    SELECT TRUE as is_admin
    FROM ${'labs'}
    WHERE ${'labs'}.${'admin_id'} = ${db.param(checkerId)} AND
      ${'labs'}.${'id'} = ${db.param(borrowLabId)}
  `.run(dbPool);

  if (!isAdmin) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: Only lab admin can submit a borrow receipt for his lab',
    });
  }

  // FIXME: Need to investigate the driver to see if we should retry on serialization error
  await db.serializable(dbPool, async (dbClient) => {
    const [{ all_healthy: allHealthy }] = await db.sql`
      SELECT bool_and(${'status'} = ${db.param('healthy')}) AS all_healthy
      FROM ${'devices'}
      WHERE ${'devices'}.${'id'} = ANY(${db.param(deviceIds)})
    `.run(dbClient);
    if (!allHealthy) {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: 'Bad request: Only healthy devices can be borrowed',
      });
    }
    
    if (expectedReturnDate.getTime() - borrowDate.getTime() <= 0) {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: 'Bad request: expected return date must be > borrow date',
      });
    }

    if (_receiptId) {
      const [{ is_receipt_id_present: isReceiptIdPresent }] = await db.sql`
        SELECT TRUE AS is_receipt_id_present
        FROM ${'receipts'}
        WHERE ${'receipts'}.${'id'} = ${db.param(_receiptId)}
      `.run(dbClient);
      if (isReceiptIdPresent) {
        throw createError({
          statusCode: BAD_REQUEST_CODE,
          message: 'This receipt\'s id is already present',
        });
      }
    }

    const [{ id: activityId }] = await db.sql`
      INSERT INTO ${'activities'} (type)
      VALUES ('borrow') RETURNING id;
    `.run(dbClient);

    const [{ receipt_id: receiptId }] = await db.sql`
      INSERT INTO ${'receipts'} (id, borrower_id, borrowed_lab_id)
      VALUES (${_receiptId ? db.param(_receiptId) : db.Default}, ${db.param(borrowerId)}, ${db.param(borrowLabId)})
      RETURNING receipt_id;
    `.run(dbClient);

    await db.sql`
      INSERT INTO ${'receipts_devices'} (receipt_id, device_id, borrow_id, expected_returned_at, expected_returned_lab_id)
      SELECT ${db.param(receiptId)}, id, ${db.param(activityId)}, ${db.param(expectedReturnDate)}, ${db.param(expectedReturnLabId)}
      FROM generate_series(unnest(${db.param(deviceIds)})) as devices(id);
    `.run(dbClient);

    await db.sql`
      UPDATE ${'devices'}
      SET status = 'borrowing'
      WHERE ${'id'} = ANY(${db.param(deviceIds)})
    `.run(dbClient);
  });
});
