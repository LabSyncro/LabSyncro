import { Type, type Static } from '@sinclair/typebox';
import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';

const FacultyOutputDto = Type.Object({
  faculties: Type.Array(Type.Object({
    id: Type.Number(),
    name: Type.String(),
  })),
});

type FacultyOutputDto = Static<typeof FacultyOutputDto>;

export default defineEventHandler<Promise<FacultyOutputDto>>(async () => {
  const faculties = (await db.sql`
    SELECT DISTINCT ${'labs'}.${'faculty'}
    FROM ${'labs'}
  `.run(dbPool)).map(({ faculty }, index) => ({ name: faculty, id: index }));
  return {
    faculties,
  };
});
