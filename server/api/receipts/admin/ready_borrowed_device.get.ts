import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';
import { ReadyBorrowedDevicesResourceDto } from '~/lib/api_schema';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import type { Static } from '@sinclair/typebox';
import { INTERNAL_SERVER_ERROR_CODE, BAD_REQUEST_CODE } from '~/constants';
import { getToken } from '#auth';

const QueryDto = Type.Object({
  offset: Type.Number(),
  length: Type.Number(),
  search_text: Type.Optional(Type.String()),
  search_fields: Type.Optional(
    Type.Array(
      Type.Union([
        Type.Literal('device_kind_id'),
        Type.Literal('device_kind_name'),
        Type.Literal('place'),
      ]),
    ),
  ),
  sort_field: Type.Optional(
    Type.Union([
      Type.Literal('device_kind_name'),
      Type.Literal('quantity'),
      Type.Literal('place'),
    ]),
  ),
  desc: Type.Optional(Type.Boolean()),
});

type QueryDto = Static<typeof QueryDto>;

export default defineEventHandler<
  { query: QueryDto },
  Promise<ReadyBorrowedDevicesResourceDto>
>(async (event) => {
  const token = await getToken({ event });
  const query = Value.Convert(QueryDto, getQuery(event));
  if (!Value.Check(QueryDto, query)) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: Invalid query string',
    });
  }
  const {
    offset,
    length,
    search_fields: searchFields,
    sort_field: sortField,
    desc,
  } = query;
  const searchText = query.search_text
    ?.replaceAll('\'', '')
    .replaceAll('%', '')
    .replaceAll('?', '');
  if (searchText !== undefined && !searchFields) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message:
        'Bad request: Expect search_fields to be present when search_text is specified',
    });
  }

  const userId = token?.id;

  const devices = (
    await db.sql`
    WITH ready_borrowed_devices AS (
      SELECT 
        dk.${'id'} as device_kind_id,
        dk.${'name'} as device_kind_name,
        dk.${'image'}->'main_image' as main_image,
        dk.${'image'}->'sub_images' as sub_images,
        COUNT(*)::INT as ${'quantity'},
        CONCAT(l.${'room'}, ', ', l.${'branch'}) as place
      FROM ${'devices'} d      
      JOIN ${'device_kinds'} dk ON d.${'kind'} = dk.${'id'}
      JOIN ${'labs'} l ON d.${'lab_id'} = l.${'id'}
      WHERE
        l.${'admin_id'} = ${db.param(userId)}
        AND d.${'status'} = 'healthy'
        AND d.${'deleted_at'} IS NULL
      GROUP BY 
        dk.${'id'},
        dk.${'name'},
        dk.${'image'}->'main_image',
        dk.${'image'}->'sub_images',
        l.${'room'},
        l.${'branch'}
    )
    SELECT 
      device_kind_id,
      device_kind_name,
      main_image,
      sub_images,
      quantity,
      place
    FROM ready_borrowed_devices
    ${
    searchText !== undefined && searchFields?.length
      ? db.raw(`WHERE (
      (${searchFields.includes('device_kind_id')} AND device_kind_id ILIKE '%${searchText}%') OR
      (${searchFields.includes('device_kind_name')} AND strip_vietnamese_accents(device_kind_name) ILIKE strip_vietnamese_accents('%${searchText}%')) OR
      (${searchFields.includes('place')} AND strip_vietnamese_accents(place) ILIKE strip_vietnamese_accents('%${searchText}%'))
    )`)
      : db.raw('')
    }
    ORDER BY ${sortField ? db.raw(`${sortField}`) : db.raw('device_kind_id')} ${desc ? db.raw('DESC') : db.raw('ASC')}   
    LIMIT ${db.param(length)}
    OFFSET ${db.param(offset)}
    `.run(dbPool)
  ).map(
    ({
      device_kind_id,
      device_kind_name,
      main_image,
      sub_images,
      quantity,
      place,
    }) => ({
      id: device_kind_id,
      name: device_kind_name,
      mainImage: main_image,
      subImages: sub_images,
      quantity,
      place,
    }),
  );

  const [{ total_records: totalRecords }] = await db.sql`
    SELECT COUNT(*) as total_records
    FROM ${'devices'} d
    JOIN ${'device_kinds'} dk ON d.${'kind'} = dk.${'id'}
    JOIN ${'labs'} l ON d.${'lab_id'} = l.${'id'}
    WHERE 
      l.${'admin_id'} = ${db.param(userId)}
      AND d.${'status'} = 'healthy'
      AND d.${'deleted_at'} IS NULL
      ${
  searchText !== undefined
    ? db.raw(`AND (
        (${searchFields?.includes('device_kind_id') || false} AND dk.${'id'} ILIKE '%${searchText}%') OR
        (${searchFields?.includes('device_kind_name') || false} AND strip_vietnamese_accents(dk.${'name'}) ILIKE strip_vietnamese_accents('%${searchText}%')) OR
        (${searchFields?.includes('place') || false} AND strip_vietnamese_accents(CONCAT(l.${'room'}, ', ', l.${'branch'})) ILIKE strip_vietnamese_accents('%${searchText}%'))
      )`)
    : db.raw('')
}
  `.run(dbPool);

  const totalPages = Math.ceil(totalRecords / length);
  const currentPage = Math.floor(offset / length);

  const output = { devices, totalPages, currentPage };

  if (!Value.Check(ReadyBorrowedDevicesResourceDto, output)) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message:
        'Internal server error: the returned output does not conform to the schema',
    });
  }
  return output;
});
