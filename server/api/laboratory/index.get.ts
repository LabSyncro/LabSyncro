import { Value } from '@sinclair/typebox/value';
import { groupBy } from 'lodash-es';
import * as db from 'zapatos/db';
import { INTERNAL_SERVER_ERROR_CODE } from '~/constants';
import { LabResourceDto } from '~/lib/api_schema';
import { dbPool } from '~/server/db';

export default defineEventHandler<
  { query: { faculty: string } },
  Promise<LabResourceDto>
>(async (event) => {
  const { faculty } = getQuery(event);
  const labs = (await db.sql`
    SELECT DISTINCT ${'labs'}.${'branch'}, ${'labs'}.${'room'}, ${'labs'}.${'timetable'}, ${'labs'}.${'admin_id'}, ${'labs'}.${'name'}, ${'users'}.${'name'} as admin_name, ${'users'}.${'email'} as admin_email, ${'users'}.${'tel'} as admin_tel
    FROM ${'labs'}
      JOIN ${'users'}
      ON ${'labs'}.${'admin_id'} = ${'users'}.${'id'} AND ${'users'}.${'deleted_at'} IS NULL
    WHERE ${'labs'}.${'faculty'} = ${db.param(faculty)} AND ${'labs'}.${'deleted_at'} IS NULL
  `.run(dbPool)).map(({ branch, room, timetable, admin_id, name, admin_name, admin_email, admin_tel }) => ({ branch, room, timetable, adminId: admin_id, name, adminName: admin_name, adminEmail: admin_email, adminTel: admin_tel }));
  const _branches = groupBy(labs, (lab) => lab.branch);
  const branches = [];
  for (const key in _branches) {
    const value = _branches[key];
    branches.push({
      name: key,
      labs: value,
    });
  }

  const output = { branches };

  if (!Value.Check(LabResourceDto, output)) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message: 'Internal server error: the returned output does not conform to the schema',
    });
  }
  return output;
});
