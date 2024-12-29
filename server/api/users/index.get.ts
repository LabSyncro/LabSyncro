import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';
import { Value } from '@sinclair/typebox/value';
import { UserResourceDto } from '~/lib/api_schema';
import { INTERNAL_SERVER_ERROR_CODE } from '~/constants';

export default defineEventHandler<Promise<UserResourceDto[]>>(async (_event) => {
  const users = await db.sql<UserResourceDto[]>`
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
    WHERE u.deleted_at IS NULL
    GROUP BY u.id, u.name, u.email, u.image, u.last_active_at
    ORDER BY u.last_active_at DESC NULLS LAST
  `.run(dbPool);

  if (!users.every(user => Value.Check(UserResourceDto, user))) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message: 'Internal server error: some users do not conform to the schema',
    });
  }

  return users;
}); 
