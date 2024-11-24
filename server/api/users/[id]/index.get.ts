import * as db from 'zapatos/db';
import { INTERNAL_SERVER_ERROR_CODE, NOT_FOUND_CODE } from '~/constants';
import { dbPool } from '~/server/db';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { UserResourceDto } from '~/lib/api_schema';

export default defineEventHandler<
  Promise<UserResourceDto>
>(async (event) => {
  const userId = Value.Convert(Type.String(), getRouterParam(event, 'id'));

  const [user] = await (db.sql`
    SELECT id, image AS avatar, name, tel, email, role
    FROM users
    WHERE deleted_at IS NULL AND ${db.param(userId)} = id
  `).run(dbPool);

  if (!user) {
    throw createError({
      statusCode: NOT_FOUND_CODE,
      message: 'User not found!',
    });
  }

  const output = {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    tel: user.tel,
    email: user.email,
    role: user.role,
  };
  if (!Value.Check(UserResourceDto, output)) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message: 'Internal server error: the returned output does not conform to the schema',
    });
  }
  return output;

});
