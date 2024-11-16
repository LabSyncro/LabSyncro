import { Type, type Static } from '@sinclair/typebox';
import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';

const DeviceQuantityByLabOutputDto = Type.Object({
  labs: Type.Array(Type.Object({
    name: Type.String(),
    branch: Type.String(),
    room: Type.String(),
    borrowableQuantity: Type.Number(),
  })),
});

type DeviceQuantityByLabOutputDto = Static<typeof DeviceQuantityByLabOutputDto>;

export default defineEventHandler<
  { query: { kindId: string } },
  Promise<DeviceQuantityByLabOutputDto>
>(async (event) => {
  const { kindId } = getQuery(event);
  const labs = (await db.sql`
    SELECT labs.name, labs.branch, labs.room, sum(CASE WHEN devices.status = 'healthy' THEN 1 ELSE 0 END)::int as borrowableQuantity
    FROM labs
      JOIN devices ON labs.id = devices.lab_id
      JOIN device_kinds ON devices.kind = device_kinds.id AND device_kinds.id = ${db.param(kindId)} 
    GROUP BY labs.id
  `.run(dbPool));
  return { labs };
});
