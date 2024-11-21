import { Type, type Static } from '@sinclair/typebox';
import * as db from 'zapatos/db';
import { BAD_REQUEST_CODE } from '~/constants';
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
  { query: { kindId: string, search_text?: string, search_fields?: ('lab_name')[] } },
  Promise<DeviceQuantityByLabOutputDto>
    >(async (event) => {
      const { kindId, search_text: searchText, search_fields: searchFields } = getQuery(event);
      if (searchText !== undefined && !searchFields) {
        throw createError({
          statusCode: BAD_REQUEST_CODE,
          message: 'Bad request',
        });
      }
      const labs = (await db.sql`
    SELECT labs.name, labs.branch, labs.room, sum(CASE WHEN devices.status = 'healthy' THEN 1 ELSE 0 END)::int as borrowableQuantity
    FROM labs
      JOIN devices ON labs.id = devices.lab_id
      JOIN device_kinds ON devices.kind = device_kinds.id AND device_kinds.id = ${db.param(kindId)} 
    WHERE TRUE ${searchText !== undefined ? db.raw(`AND (
        (${searchFields?.includes('lab_name') || false} AND CAST(labs.name AS TEXT) ILIKE '%${searchText}%') OR
        (${searchFields?.includes('lab_name') || false} AND CAST(labs.branch AS TEXT) ILIKE '%${searchText}%') OR
        (${searchFields?.includes('lab_name') || false} AND CAST(labs.room AS TEXT) ILIKE '%${searchText}%')
      )`) : db.raw('')}
    GROUP BY labs.id
  `.run(dbPool));
      return { labs };
    });
