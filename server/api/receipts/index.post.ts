import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';
import { getToken } from '#auth';
import { Value } from '@sinclair/typebox/value';
import { Type, type Static } from '@sinclair/typebox';
import { BAD_REQUEST_CODE } from '~/constants';

const BodyDto = Type.Object({
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

  const { device_ids: deviceIds, borrower_id: borrowerId, borrow_date: borrowDate, borrow_lab_id: borrowLabId, expected_return_date: expectedReturnDate, expected_return_lab_id: expectedReturnLabId } = body;

  const { id: checkerId } = await getToken({ event });
});
