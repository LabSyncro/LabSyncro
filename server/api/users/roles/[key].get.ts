import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';
import { RoleDetailDto } from '@/lib/api_schema';
import { Value } from '@sinclair/typebox/value';
import { INTERNAL_SERVER_ERROR_CODE } from '~/constants';

export default defineEventHandler<Promise<RoleDetailDto>>(async (event) => {
  await requirePermission(event, '/settings/permissions/group/:id:own');

  const key = event.context.params?.key;
  if (!key) {
    throw createError({
      statusCode: 400,
      message: 'Bad request: Key is required',
    });
  }

  const [roleInfo] = await db.sql`
    WITH role_users AS (
      SELECT DISTINCT
        u.id,
        u.name,
        u.email,
        u.image as avatar
      FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      JOIN users u ON ur.user_id = u.id
      WHERE r.key = ${db.param(key)}
    ),
    role_permissions AS (
      SELECT DISTINCT
        r.name as resource,
        array_agg(DISTINCT a.name ORDER BY a.name) as actions
      FROM roles ro
      CROSS JOIN resources r 
      CROSS JOIN actions a
      LEFT JOIN permissions p ON (
        p.role_id = ro.id AND 
        p.resource_id = r.id AND 
        p.action_id = a.id
      )
      WHERE ro.key = ${db.param(key)}
      GROUP BY r.name
    ),
    permissions_with_exists AS (
      SELECT 
        rp.resource,
        CASE 
          WHEN EXISTS (
            SELECT 1 
            FROM permissions p2
            JOIN roles r2 ON p2.role_id = r2.id
            WHERE r2.key = ${db.param(key)}
            AND p2.resource_id = (SELECT id FROM resources WHERE name = rp.resource)
          ) THEN rp.actions
          ELSE ARRAY[]::text[]
        END as actions
      FROM role_permissions rp
      ORDER BY rp.resource
    )
    SELECT 
      ro.name,
      ro.key,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object(
          'id', ru.id,
          'name', ru.name,
          'email', ru.email,
          'avatar', ru.avatar
        )) FILTER (WHERE ru.id IS NOT NULL),
        '[]'
      ) as users,
      COALESCE(
        (SELECT json_agg(jsonb_build_object(
          'resource', resource,
          'actions', actions
        ))
        FROM permissions_with_exists),
        '[]'
      ) as permissions
    FROM roles ro
    LEFT JOIN role_users ru ON true
    WHERE ro.key = ${db.param(key)}
    GROUP BY ro.name, ro.key
  `.run(dbPool);

  if (!Value.Check(RoleDetailDto, roleInfo)) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message: 'Internal server error: the returned output does not conform to the schema',
    });
  }

  return roleInfo;
});