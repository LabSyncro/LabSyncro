import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import * as db from 'zapatos/db';
import { BAD_REQUEST_CODE } from '~/constants';
import { dbPool } from '~/server/db';

const BodyDto = Type.Object({
  ids: Type.Array(Type.String()),
});

type BodyDto = Static<typeof BodyDto>;

export default defineEventHandler<
  { body: BodyDto }
>(async (event) => {
  const body = await readBody(event);
  if (!Value.Check(BodyDto, body)) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: Invalid body',
    });
  }
  const { ids } = body;

  await db.sql`
    UPDATE ${'device_kinds'}
    SET ${'deleted_at'} = ${db.param(new Date(Date.now()))}
    WHERE ${'id'} IN ${db.param(ids)} AND ${'deleted_at'} IS NULL
  `.run(dbPool);
});
