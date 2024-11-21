import type { FacultyResourceDto } from '~/lib/api_schema';
import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';

export default defineEventHandler<Promise<FacultyResourceDto>>(async () => {
  const faculties = (await db.sql`
    SELECT DISTINCT ${'labs'}.${'faculty'}
    FROM ${'labs'}
    WHERE ${'labs'}.${'deleted_at'} IS NULL
  `.run(dbPool)).map(({ faculty }, index) => ({ name: faculty, id: index }));
  return {
    faculties,
  };
});
