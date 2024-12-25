import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';
import { Value } from '@sinclair/typebox/value';
import { Type, type Static } from '@sinclair/typebox';
import { BAD_REQUEST_CODE } from '~/constants';

const BodyDto = Type.Array(
  Type.Object({
    kind: Type.String(),
    lab_id: Type.String(),
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

  const insertedDevices = await db.sql`
    INSERT INTO ${'devices'} (kind, lab_id)
    VALUES ${db.raw(body.map((item) => `('${item.kind}', '${item.lab_id}')`).join(', '))}
    RETURNING id;
  `.run(dbPool);

  return insertedDevices;
});
