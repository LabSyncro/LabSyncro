import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import * as db from 'zapatos/db';
import { BAD_REQUEST_CODE, INTERNAL_SERVER_ERROR_CODE } from '~/constants';
import { ListOfDeviceKindResourceDto } from '~/lib/api_schema';
import { dbPool } from '~/server/db';

const QueryDto = Type.Object({
  category_id: Type.Optional(Type.Number()),
  offset: Type.Number(),
  length: Type.Number(),
  search_text: Type.Optional(Type.String()),
  search_fields: Type.Optional(Type.Array(Type.Union([
    Type.Literal('device_id'),
    Type.Literal('device_name'),
  ]))),
  sort_field: Type.Optional(Type.Union([
    Type.Literal('name'),
    Type.Literal('category'),
    Type.Literal('brand'),
    Type.Literal('borrowable_quantity'),
    Type.Literal('quantity'),
  ])),
  desc: Type.Optional(Type.Boolean()),
});

type QueryDto = Static<typeof QueryDto>;

export default defineEventHandler<
  { query: QueryDto },
  Promise<ListOfDeviceKindResourceDto>
>(async (event) => {
  const query = Value.Convert(QueryDto, getQuery(event));
  if (!Value.Check(QueryDto, query)) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: Invalid query string',
    });
  }
  const { category_id: categoryId, offset, length, search_fields: searchFields, sort_field: sortField, desc } = query;
  const searchText = query.search_text?.replaceAll('\'', '').replaceAll('%', '').replaceAll('?', '');
  if (searchText !== undefined && !searchFields) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: Expect search_fields to be present when search_text is specified',
    });
  }

  const deviceKinds = await (db.sql`
      SELECT ${'device_kinds'}.${'unit'}, ${'device_kinds'}.${'brand'}, ${'device_kinds'}.${'manufacturer'}, ${'device_kinds'}.${'image'}, ${'device_kinds'}.${'id'}, ${'device_kinds'}.${'name'}, count(*)::int as ${'quantity'}, sum(CASE WHEN ${'devices'}.${'status'} = 'healthy' THEN 1 ELSE 0 END)::int as borrowable_quantity, MAX(${'categories'}.${'name'}) as category
      FROM ${'devices'}
        JOIN ${'device_kinds'}
        ON ${'devices'}.${'kind'} = ${'device_kinds'}.${'id'} AND ${'device_kinds'}.${'deleted_at'} IS NULL
        JOIN ${'categories'}
        ON ${'categories'}.${'id'} = ${'device_kinds'}.${'category_id'}
      WHERE
        ${categoryId !== undefined ? db.raw(`device_kinds.category_id = ${categoryId}`) : db.raw('TRUE')} AND
        ${'devices'}.${'deleted_at'} IS NULL
        ${searchText !== undefined ? db.raw(`AND (
          (${searchFields?.includes('device_id') || false} AND devices.kind || '/' || devices.id ILIKE '%${searchText}%') OR
          (${searchFields?.includes('device_name') || false} AND CAST(device_kinds.name AS TEXT) ILIKE '%${searchText}%')
        )`) : db.raw('')}
      GROUP BY ${'device_kinds'}.${'id'}
      ORDER BY ${sortField ? db.raw(`${sortField}`) : db.raw('device_kinds.id')} ${desc ? db.raw('DESC') : db.raw('ASC')}
      LIMIT ${db.param(length)}
      OFFSET ${db.param(offset)}
    `).run(dbPool);

  const [{ quantity: totalRecords }] = await (db.sql`
    SELECT COUNT (DISTINCT ${'device_kinds'}.${'id'}) as quantity
    FROM ${'devices'}
    JOIN ${'device_kinds'}
    ON ${'device_kinds'}.${'id'} = ${'devices'}.${'kind'}
    WHERE
      ${categoryId !== undefined ? db.raw(`device_kinds.category_id = ${categoryId}`) : db.raw('TRUE')} AND
      ${'devices'}.${'deleted_at'} IS NULL AND
      ${'device_kinds'}.${'deleted_at'} IS NULL
      ${searchText !== undefined ? db.raw(`AND (
        (${searchFields?.includes('device_id') || false} AND CAST(devices.id AS TEXT) ILIKE '%${searchText}%') OR
        (${searchFields?.includes('device_name') || false} AND CAST(device_kinds.name AS TEXT) ILIKE '%${searchText}%')
      )`) : db.raw('')}
    `).run(dbPool);

  const totalPages = Math.ceil(totalRecords / length);
  const currentPage = Math.floor(offset / length);
  
  const output = {
    deviceKinds: deviceKinds.map(({ id, name, quantity, brand, manufacturer, image: { main_image, sub_images }, unit, borrowable_quantity, category }) => ({ id, name, quantity, brand, manufacturer, mainImage: main_image, subImages: sub_images, unit, borrowableQuantity: borrowable_quantity, category })),
    totalPages,
    currentPage,
  };

  if (!Value.Check(ListOfDeviceKindResourceDto, output)) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message: 'Internal server error: the returned output does not conform to the schema',
    });
  }

  return output;
});
