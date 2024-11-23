import { type Static, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import * as db from 'zapatos/db';
import { BAD_REQUEST_CODE, INTERNAL_SERVER_ERROR_CODE } from '~/constants';
import { ListOfLabResourceDto } from '~/lib/api_schema';
import { dbPool } from '~/server/db';

const QueryDto = Type.Object({
  search_text: Type.Optional(Type.String()),
  search_fields: Type.Optional(Type.Array(Type.Union([
    Type.Literal('location'),
    Type.Literal('lab_name'),
  ]))),
});

type QueryDto = Static<typeof QueryDto>;

export default defineEventHandler<
  { query: QueryDto },
  Promise<ListOfLabResourceDto>
>(async (event) => {
  const query = Value.Convert(QueryDto, getQuery(event));
  if (!Value.Check(QueryDto, query)) {
    throw createError({
      status: BAD_REQUEST_CODE,
      message: 'Bad request: Invalid query',
    });
  }

  const { search_text: searchText, search_fields: searchFields } = query;
  if (searchText !== undefined && !searchFields) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: Expect search_fields to be present when search_text is specified',
    });
  }

  const labs = (await db.sql`
    SELECT ${'labs'}.${'id'}, ${'labs'}.${'branch'}, ${'labs'}.${'room'}, ${'labs'}.${'timetable'}, ${'labs'}.${'admin_id'}, ${'labs'}.${'name'}, ${'users'}.${'name'} as admin_name, ${'users'}.${'email'} as admin_email, ${'users'}.${'tel'} as admin_tel
    FROM ${'labs'}
      JOIN ${'users'}
      ON ${'labs'}.${'admin_id'} = ${'users'}.${'id'} AND ${'users'}.${'deleted_at'} IS NULL
    WHERE ${'labs'}.${'deleted_at'} IS NULL
      ${searchText !== undefined ? db.raw(`AND (
        (${searchFields?.includes('location') || false} AND labs.room || ', ' || labs.branch ILIKE '%${searchText}%') OR
        (${searchFields?.includes('lab_name') || false} AND labs.name ILIKE '%${searchText}%')
      )`) : db.raw('')}

  `.run(dbPool)).map(({ id, branch, room, timetable, admin_id, name, admin_name, admin_email, admin_tel }) => ({ id, branch, room, timetable, adminId: admin_id, name, adminName: admin_name, adminEmail: admin_email, adminTel: admin_tel }));

  const output = { labs };
  if (!Value.Check(ListOfLabResourceDto, output)) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message: 'Internal server error: the returned output does not conform to the schema',
    });
  }
  return output;
});
