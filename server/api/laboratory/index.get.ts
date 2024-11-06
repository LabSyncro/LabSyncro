import { Type, type Static } from '@sinclair/typebox';
import { groupBy, mapValues } from 'lodash-es';
import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';

const LabOutputDto = Type.Object({
  branches: Type.Array(Type.Object({
    name: Type.String(),
    labs: Type.Array(Type.Object({
      branch: Type.String(),
      timetable: Type.Record(Type.String(), Type.Array(Type.String())),
      adminId: Type.String(),
      adminName: Type.String(),
      adminTel: Type.String(),
      name: Type.String(),
      room: Type.String(),
    })),
  })),
});

type LabOutputDto = Static<typeof LabOutputDto>;

export default defineEventHandler<
  { query: { faculty: string } },
  Promise<LabOutputDto>
>(async (event) => {
  const { faculty } = getQuery(event);
  const labs = (await db.sql`
    SELECT DISTINCT ${'labs'}.${'branch'}, ${'labs'}.${'room'}, ${'labs'}.${'timetable'}, ${'labs'}.${'admin_id'}, ${'labs'}.${'name'}, ${'users'}.${'name'} as admin_name, ${'users'}.${'email'} as admin_email, ${'users'}.${'tel'} as admin_tel
    FROM ${'labs'}
      JOIN ${'users'}
      ON ${'labs'}.${'admin_id'} = ${'users'}.${'id'}
    WHERE ${'labs'}.${'faculty'} = ${db.param(faculty)}
  `.run(dbPool)).map(({ branch, room, timetable, admin_id, name, admin_name, admin_email, admin_tel }) => ({ branch, room, timetable: mapValues(timetable, (time) => [time]), adminId: admin_id, name, adminName: admin_name, adminEmail: admin_email, adminTel: admin_tel }));
  const _branches = groupBy(labs, (lab) => lab.branch);
  const branches = [];
  for (const key in _branches) {
    const value = _branches[key];
    branches.push({
      name: key,
      labs: value,
    });
  }
  return {
    branches,
  };
});
