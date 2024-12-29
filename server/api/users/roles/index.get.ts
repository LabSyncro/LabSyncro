import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';
import { RoleWithStatsDto } from '~/lib/api_schema';
import { Value } from '@sinclair/typebox/value';
import { INTERNAL_SERVER_ERROR_CODE } from '~/constants';

export default defineEventHandler<Promise<RoleWithStatsDto[]>>(async (_event) => {
  const roles = await db.sql<RoleWithStatsDto[]>`
    WITH role_stats AS (
      SELECT 
        r.id,
        COUNT(DISTINCT p.resource_id) as resource_count,
        COUNT(DISTINCT ur.user_id) as user_count,
        COALESCE(
          array_agg(DISTINCT u.image) FILTER (WHERE u.image IS NOT NULL),
          '{}'
        ) as avatar_urls
      FROM roles r
      LEFT JOIN permissions p ON p.role_id = r.id
      LEFT JOIN user_roles ur ON ur.role_id = r.id
      LEFT JOIN users u ON ur.user_id = u.id
      GROUP BY r.id
    )
    SELECT 
      r.name,
      r.key,
      CASE 
        WHEN rs.resource_count = (SELECT COUNT(*) FROM resources)
        THEN rs.resource_count || ' (Tất cả)'
        ELSE rs.resource_count::text
      END as resources,
      rs.user_count::integer as users,
      rs.avatar_urls as "avatarUrl"
    FROM roles r
    JOIN role_stats rs ON rs.id = r.id
  `.run(dbPool);

  if (!roles.every(role => Value.Check(RoleWithStatsDto, role))) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message: 'Internal server error: some roles do not conform to the schema',
    });
  }

  return roles;
}); 