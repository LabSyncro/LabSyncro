import * as db from 'zapatos/db';
import { BAD_REQUEST_CODE, INTERNAL_SERVER_ERROR_CODE } from '~/constants';
import { dbPool } from '~/server/db';
import { DeviceQuantityByLabDto } from '~/lib/api_schema';
import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const QueryDto = Type.Object({
  kind_id: Type.String(),
  search_text: Type.Optional(Type.String()),
  search_fields: Type.Optional(Type.Array(Type.Union([
    Type.Literal('lab_name'),
  ]))),
});

type QueryDto = Static<typeof QueryDto>;

export default defineEventHandler<
  { query: QueryDto },
  Promise<DeviceQuantityByLabDto>
>(async (event) => {
  const query = Value.Convert(QueryDto, getQuery(event));
  if (!Value.Check(QueryDto, query)) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: Invalid query',
    });
  }
  const { kind_id: kindId, search_fields: searchFields } = query;
  const searchText = query.search_text?.replaceAll('\'', '').replaceAll('%', '').replaceAll('?', '');

  if (searchText !== undefined && !searchFields) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: Expect search_fields to be present when search_text is specified',
    });
  }

  const labs = (await db.sql`
    SELECT labs.name, labs.branch, labs.room, sum(CASE WHEN devices.status = 'healthy' THEN 1 ELSE 0 END)::int as borrowable_quantity
    FROM labs
      JOIN devices ON labs.id = devices.lab_id
      JOIN device_kinds ON devices.kind = device_kinds.id AND device_kinds.id = ${db.param(kindId)} 
    WHERE TRUE ${searchText !== undefined ? db.raw(`AND (
        (${searchFields?.includes('lab_name') || false} AND strip_vietnamese_accents(CAST(labs.name AS TEXT)) ILIKE strip_vietnamese_accents('%${searchText}%')) OR
        (${searchFields?.includes('lab_name') || false} AND strip_vietnamese_accents(CAST(labs.branch AS TEXT)) ILIKE strip_vietnamese_accents('%${searchText}%')) OR
        (${searchFields?.includes('lab_name') || false} AND strip_vietnamese_accents(CAST(labs.room AS TEXT)) ILIKE strip_vietnamese_accents('%${searchText}%'))
      )`) : db.raw('')}
    GROUP BY labs.id
  `.run(dbPool)).map(({ name, branch, room, borrowable_quantity }) => ({ name, branch, room, borrowableQuantity: borrowable_quantity }));

  const output = { labs };

  if (!Value.Check(DeviceQuantityByLabDto, output)) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message: 'Internal server error: the returned output does not conform to the schema',
    });
  }

  return output;
});
