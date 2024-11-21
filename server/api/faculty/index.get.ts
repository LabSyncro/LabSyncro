import { FacultyResourceDto, type FacultyResourceDto } from '~/lib/api_schema';
import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';
import { Value } from '@sinclair/typebox/value';
import { INTERNAL_SERVER_ERROR_CODE } from '~/constants';

export default defineEventHandler<Promise<FacultyResourceDto>>(async () => {
  const faculties = (await db.sql`
    SELECT DISTINCT ${'labs'}.${'faculty'}
    FROM ${'labs'}
    WHERE ${'labs'}.${'deleted_at'} IS NULL
  `.run(dbPool)).map(({ faculty }, index) => ({ name: faculty, id: index }));

  const output = { faculties };

  if (!Value.Check(FacultyResourceDto, output)) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message: 'Internal server error: the returned output does not conform to the schema',
    });
  }
  return output;
});
