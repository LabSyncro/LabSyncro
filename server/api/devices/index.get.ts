import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { BAD_REQUEST_CODE, INTERNAL_SERVER_ERROR_CODE } from '~/constants';
import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';
import { ListOfDeviceResourceDto } from '~/lib/api_schema';

const QueryDto = Type.Object({
  offset: Type.Number(),
  length: Type.Number(),
  device_kind_id: Type.Optional(Type.String()),
  lab_id: Type.Optional(Type.String()),
  search_text: Type.Optional(Type.String()),
  search_fields: Type.Optional(
    Type.Array(Type.Union([Type.Literal('device_id')])),
  ),
  sort_field: Type.Optional(
    Type.Union([Type.Literal('id'), Type.Literal('room')]),
  ),
  desc: Type.Optional(Type.Boolean()),
});

type QueryDto = Static<typeof QueryDto>;

export default defineEventHandler<
  { query: QueryDto },
  Promise<ListOfDeviceResourceDto>
>(async (event) => {
  const query = Value.Convert(QueryDto, getQuery(event));

  if (!Value.Check(QueryDto, query)) {
    throw createError({
      status: BAD_REQUEST_CODE,
      message: 'Bad request: Invalid query',
    });
  }

  const {
    device_kind_id: deviceKindId,
    lab_id: labId,
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

  const devices = await db.sql`
    SELECT ${'device_kinds'}.${'price'}, ${'devices'}.${'created_at'}, ${'devices'}.${'printed_at'}, ${'devices'}.id, status, kind, room, branch
    FROM ${'devices'}
    JOIN ${'labs'}
      ON ${'devices'}.${'lab_id'} = ${'labs'}.${'id'}
    JOIN ${'device_kinds'}
      ON ${'devices'}.${'kind'} = ${'device_kinds'}.${'id'}
    WHERE TRUE AND
      (${deviceKindId !== undefined ? db.param(false) : db.param(true)} OR ${'devices'}.${'kind'} = ${db.param(deviceKindId)}) AND
      ${labId !== undefined ? db.raw(`devices.lab_id = '${labId}'`) : db.raw('TRUE')} AND
      ${'devices'}.${'deleted_at'} IS NULL
      ${
  searchText !== undefined
    ? db.raw(`AND (
          (${searchFields?.includes('device_id') || false} AND strip_vietnamese_accents(devices.kind || '/' || devices.id) ILIKE strip_vietnamese_accents('%${searchText}%'))
        )`)
    : db.raw('')
}
    ORDER BY ${sortField ? db.raw(`${sortField} ${desc ? 'DESC' : 'ASC'}, `) : db.raw('')} ${'devices'}.${'status'} ASC
    LIMIT ${db.param(length)}
    OFFSET ${db.param(offset)}
  `.run(dbPool);

  const [{ quantity: totalRecords }] = await db.sql`
    SELECT COUNT (*) as quantity
    FROM ${'devices'}
    WHERE 
      (${deviceKindId !== undefined ? db.param(false) : db.param(true)} OR ${'devices'}.${'kind'} = ${db.param(deviceKindId)}) AND
      ${labId !== undefined ? db.raw(`devices.lab_id = '${labId}'`) : db.raw('TRUE')} AND
      ${'devices'}.${'deleted_at'} IS NULL
      ${
  searchText !== undefined
    ? db.raw(`AND (
          (${searchFields?.includes('device_id') || false} AND strip_vietnamese_accents(devices.id) ILIKE strip_vietnamese_accents('%${searchText}%'))
        )`)
    : db.raw('')
}
  `.run(dbPool);

  const totalPages = Math.ceil(totalRecords / length);
  const currentPage = Math.floor(offset / length);

  const output = {
    devices: devices.map(
      ({ id, status, kind, room, branch, price, created_at, printed_at }) => ({
        id,
        status,
        kind,
        room,
        branch,
        price,
        createdAt: created_at,
        printedAt: printed_at,
      }),
    ),
    totalPages,
    currentPage,
  };

  if (!Value.Check(ListOfDeviceResourceDto, output)) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message:
        'Internal server error: the returned output does not conform to the schema',
    });
  }

  return output;
});
