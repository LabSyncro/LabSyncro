import { type Static, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import * as db from 'zapatos/db';
import { BAD_REQUEST_CODE, INTERNAL_SERVER_ERROR_CODE } from '~/constants';
import { AdminManagedLabsDto } from '~/lib/api_schema';
import { dbPool } from '~/server/db';
import { getToken } from '#auth';

const QueryDto = Type.Object({
  offset: Type.Number(),
  length: Type.Number(),
  search_text: Type.Optional(Type.String()),
  search_fields: Type.Optional(
    Type.Array(
      Type.Union([Type.Literal('location'), Type.Literal('lab_name')]),
    ),
  ),
  sort_field: Type.Optional(Type.Union([Type.Literal('lab_name')])),
  desc: Type.Optional(Type.Boolean()),
});

type QueryDto = Static<typeof QueryDto>;

export default defineEventHandler<
  { query: QueryDto },
  Promise<AdminManagedLabsDto>
>(async (event) => {
  const query = Value.Convert(QueryDto, getQuery(event));
  const token = await getToken({ event });
  const userId = token?.id;
  if (!Value.Check(QueryDto, query)) {
    throw createError({
      status: BAD_REQUEST_CODE,
      message: 'Bad request: Invalid query',
    });
  }

  const {
    search_fields: searchFields,
    offset,
    length,
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

  const labs = await db.sql`
      SELECT ${'labs'}.${'id'}, ${'labs'}.${'branch'}, ${'labs'}.${'room'}, ${'labs'}.${'timetable'}, ${'labs'}.${'name'}
      FROM ${'labs'}
      WHERE 
        ${'labs'}.${'deleted_at'} IS NULL
        AND ${'labs'}.${'admin_id'} = ${db.param(userId)}
        ${
  searchText !== undefined
    ? db.raw(`AND (
          (${searchFields?.includes('location') || false} AND strip_vietnamese_accents(labs.room || ', ' || labs.branch) ILIKE strip_vietnamese_accents('%${searchText}%')) OR
          (${searchFields?.includes('lab_name') || false} AND strip_vietnamese_accents(labs.name) ILIKE strip_vietnamese_accents('%${searchText}%'))
        )`)
    : db.raw('')
}
      ORDER BY ${sortField ? db.raw(`${sortField} ${desc ? 'DESC' : 'ASC'}, `) : db.raw('')} ${'labs'}.${'name'} ASC
      LIMIT ${db.param(length)}
      OFFSET ${db.param(offset)}
    `.run(dbPool);

  const [{ quantity: totalRecords }] = await db.sql`
    SELECT COUNT (*) as quantity
    FROM ${'labs'}
    WHERE 
        ${'labs'}.${'deleted_at'} IS NULL
        AND ${'labs'}.${'admin_id'} = ${db.param(userId)}
        ${
  searchText !== undefined
    ? db.raw(`AND (
          (${searchFields?.includes('location') || false} AND strip_vietnamese_accents(labs.room || ', ' || labs.branch) ILIKE strip_vietnamese_accents('%${searchText}%')) OR
          (${searchFields?.includes('lab_name') || false} AND strip_vietnamese_accents(labs.name) ILIKE strip_vietnamese_accents('%${searchText}%'))
        )`)
    : db.raw('')
}
    `.run(dbPool);

  const totalPages = Math.ceil(totalRecords / length);
  const currentPage = Math.floor(offset / length);

  const output = {
    labs,
    totalPages,
    currentPage,
  };
  if (!Value.Check(AdminManagedLabsDto, output)) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message:
        'Internal server error: the returned output does not conform to the schema',
    });
  }
  return output;
});
