import { Type, type Static } from '@sinclair/typebox';
import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';

const DeviceQuantityOutputDto = Type.Record(Type.String(), Type.Object({
  branch: Type.String(),
  room: Type.String(),
  quantity: Type.Number(),
}));

type DeviceQuantityOutputDto = Static<typeof DeviceQuantityOutputDto>;

export default defineEventHandler<
  { query: { kindId: string } },
  Promise<DeviceQuantityOutputDto>
>(async (event) => {
  const { kindId } = getQuery(event);
  const [quantity] = (await db.sql`
    SELECT jsonb_object_agg(
      labs.name,
      jsonb_build_object('branch', labs.branch, 'room', labs.room, 'quantity', lab_quantity)
    )
    FROM ${'device_kinds'},
      LATERAL jsonb_each(${'device_kinds'}.${'available_quantity'}) as each_pair(lab_id, lab_quantity),
      LATERAL (
        SELECT l.${'name'}, l.${'branch'}, l.${'room'}
        FROM ${'labs'} l
        WHERE l.${'id'}::text = lab_id
      ) labs
    WHERE ${'device_kinds'}.${'id'} = ${db.param(kindId)}
    GROUP BY ${'device_kinds'}.${'id'}
  `.run(dbPool));
  return quantity.json_object_agg;
});
