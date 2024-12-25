import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';
import { Value } from '@sinclair/typebox/value';
import { Type, type Static } from '@sinclair/typebox';
import { BAD_REQUEST_CODE } from '~/constants';

const BodyDto = Type.Array(
  Type.Object({
    id: Type.String(),
    printed_at: Type.Date(),
  }),
);
type BodyDto = Static<typeof BodyDto>;

export default defineEventHandler<{ body: BodyDto }>(async (event) => {
  const body = Value.Convert(BodyDto, await readBody(event));
  if (!Value.Check(BodyDto, body)) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: Invalid body',
    });
  }

  const updates = await Promise.all(
    body.map((item) =>
      db
        .update('devices', { printed_at: item.printed_at }, { id: item.id })
        .run(dbPool),
    ),
  );

  return updates;
});
