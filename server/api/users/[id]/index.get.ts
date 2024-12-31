import * as db from 'zapatos/db';
import { INTERNAL_SERVER_ERROR_CODE, NOT_FOUND_CODE } from '~/constants';
import { dbPool } from '~/server/db';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { UserResourceDto } from '~/lib/api_schema';

export default defineEventHandler<Promise<UserResourceDto>>(async (event) => {
  await requirePermission(event, ['/admin/borrows/form:edit', '/admin/returns/form:edit']);
  
  const userId = Value.Convert(Type.String(), getRouterParam(event, 'id'));

  const [user] = await db.sql`
    SELECT 
      u.id,
      u.name,
      u.email,
      u.tel,
      u.image as avatar,
      u.last_active_at,
      COALESCE(
        json_agg(
          json_build_object(
            'name', r.name,
            'key', r.key
          )
        ) FILTER (WHERE r.id IS NOT NULL),
        '[]'
      ) as roles
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.deleted_at IS NULL AND ${db.param(userId)} = u.id
    GROUP BY u.id, u.name, u.email, u.image, u.last_active_at
  `.run(dbPool);

  if (!user) {
    throw createError({
      statusCode: NOT_FOUND_CODE,
      message: 'User not found!',
    });
  }

  if (!Value.Check(UserResourceDto, user)) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message: 'Internal server error: the returned output does not conform to the schema',
    });
  }

  return user;
});
