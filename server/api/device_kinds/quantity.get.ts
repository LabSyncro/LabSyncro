import { Type, type Static } from '@sinclair/typebox';
import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';

const DeviceQuantityOutputDto = Type.Record(Type.String(), Type.Number());

type DeviceQuantityOutputDto = Static<typeof DeviceQuantityOutputDto>;

export default defineEventHandler<
  { query: { kindId: string } },
  Promise<DeviceQuantityOutputDto>
>(async (event) => {
  const { kindId } = getQuery(event);
  const [quantity] = (await db.sql`
    SELECT DISTINCT ${'device_kinds'}.${'available_quantity'}
    FROM ${'device_kinds'}
    WHERE ${'device_kinds'}.${'id'} = ${db.param(kindId)}
  `.run(dbPool));
  return quantity.available_quantity;
});
