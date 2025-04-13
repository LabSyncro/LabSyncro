import * as db from 'zapatos/db';
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { BAD_REQUEST_CODE, FORBIDDEN_CODE, NOT_FOUND_CODE, INTERNAL_SERVER_ERROR_CODE } from '~/constants';
import { dbPool } from '~/server/db';
import { UserResourceDto } from '~/lib/api_schema';

const BodyDto = Type.Object({
  token: Type.String(),
  userId: Type.String(),
  timestamp: Type.Number(),
});
type BodyDto = Static<typeof BodyDto>;

export default defineEventHandler(async (event) => {
  const body = Value.Convert(BodyDto, await readBody(event));
  if (!Value.Check(BodyDto, body)) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: Invalid body',
    });
  }

  const { token, userId, timestamp } = body;

  const existingToken = await db.sql`
    SELECT EXISTS (
      SELECT 1 
      FROM used_qr_tokens 
      WHERE token = ${db.param(token)} AND 
            user_id = ${db.param(userId)}
    ) AS token_exists;
  `.run(dbPool);

  if (existingToken[0].token_exists) {
    throw createError({
      statusCode: FORBIDDEN_CODE,
      message: 'QR code has already been used',
    });
  }

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

  await db.sql`
    INSERT INTO used_qr_tokens (token, user_id, created_at)
    VALUES (${db.param(token)}, ${db.param(userId)}, ${db.param(timestamp)})
  `.run(dbPool);

  return {
    success: true,
    user
  };
}); 