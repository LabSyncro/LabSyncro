import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';

export async function getUserByEmail (email: string) {
  const result = await db.sql`
  SELECT * FROM ${'users'}
  WHERE email = ${db.param(email)} AND deleted_at IS NULL
`.run(dbPool);
  return result[0];
}

export async function getUserPermissions (userId: string) {
  const result = await db.sql`
    SELECT DISTINCT r.name as resource_name, a.name as action_name
    FROM user_roles ur
    JOIN roles ro ON ur.role_id = ro.id
    JOIN permissions p ON p.role_id = ro.id
    JOIN resources r ON p.resource_id = r.id
    JOIN actions a ON p.action_id = a.id
    WHERE ur.user_id = ${db.param(userId)}
  `.run(dbPool);

  return result.map((row) => `${row.resource_name}:${row.action_name}`);
}

export async function getUserRoles (userId: string) {
  const result = await db.sql`
    SELECT ro.name as role_name
    FROM user_roles ur
    JOIN roles ro ON ur.role_id = ro.id
    WHERE ur.user_id = ${db.param(userId)}
  `.run(dbPool);

  return result.map((row) => row.role_name);
}

export async function createOrUpdateUser (
  email: string,
  name: string,
  image?: string,
  password?: string,
) {
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    const result = await db
      .update(
        'users',
        {
          name,
          image,
        },
        {
          email,
        },
      )
      .run(dbPool);
    return result[0];
  }

  const result = await db
    .insert('users', {
      id: Math.floor(1000000 + Math.random() * 9000000).toString(),
      email,
      name,
      image,
      password,
      meta: {},
    })
    .run(dbPool);
  return result;
}
