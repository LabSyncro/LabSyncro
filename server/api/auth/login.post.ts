import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  UNAUTHORIZED_CODE,
} from '~/constants';
import { cookieOptions } from '~/constants/cookie';
import { initDbClient } from '~/server/db';
import type { LoginInputDto } from '~/server/dtos/in/auth.dto';
import type { AuthOutputDto } from '~/server/dtos/out/auth.dto';

type UserDb = {
  user_id: string;
  user_name: string;
  user_email: string;
  user_password: string;
  role_name: string;
  resource_name: string;
  action_name: string;
};

export default defineEventHandler<
  { body: LoginInputDto },
  Promise<AuthOutputDto>
>(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  const dbClient = await initDbClient();
  const { jwtSecret } = useRuntimeConfig();

  if (!email || !password) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Email and password are required!',
    });
  }

  try {
    const query = ` SELECT 
                      public.user.id AS user_id, 
                      public.user.name AS user_name, 
                      public.user.email AS user_email,
                      public.user.password AS user_password,
                      role_name, 
                      resource_name, 
                      action_name
                    FROM public.user
                    LEFT JOIN (
                      SELECT role.name AS role_name, role.id AS role_id, resource.name AS resource_name, action.name AS action_name
                      FROM permission
                      JOIN role ON role.id = permission.role_id
                      JOIN resource ON resource.id = permission.resource_id
                      JOIN action ON action.id = permission.action_id
                    ) AS rbac ON public.user.role_id = rbac.role_id
                    WHERE public.user.email = $1`;

    const { rows } = await dbClient.query<UserDb>(query, [email]);
    if (!rows || rows.length === 0) {
      throw createError({
        statusCode: NOT_FOUND_CODE,
        message: 'User not found',
      });
    }

    const user = rows[0];
    const correctPassword = await bcrypt.compare(password, user.user_password);
    if (!correctPassword) {
      throw createError({
        statusCode: UNAUTHORIZED_CODE,
        message: 'Invalid credentials!',
      });
    }

    const token = jwt.sign({ userId: user.user_id }, jwtSecret, {
      expiresIn: '1h',
    });
    setCookie(event, 'token', token, cookieOptions);

    return {
      id: rows[0].user_id,
      name: rows[0].user_name,
      email: rows[0].user_email,
      role: rows[0].role_name,
      permission: rows.map((row) => ({
        resource: row.resource_name,
        action: row.action_name,
      })),
    };
  } catch (error) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message: error as string,
    });
  }
});
