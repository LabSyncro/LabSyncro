import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { BAD_REQUEST_CODE } from '~/constants';

const BodyDto = Type.Object({
  permissions: Type.Array(Type.String())
});

type BodyDto = Static<typeof BodyDto>;

export default defineEventHandler<{ body: BodyDto }>(async (event) => {
  await requirePermission(event, '/settings/permissions:own');

  const key = event.context.params?.key;
  if (!key) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: Key is required',
    });
  }

  const body = await readBody(event);
  if (!Value.Check(BodyDto, body)) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: Invalid body',
    });
  }

  const permissionPairs = body.permissions.map(p => {
    const [resource, action] = p.split('-');
    return { resource, action };
  });

  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');

    const [role] = await db.sql`
      SELECT id FROM roles WHERE key = ${db.param(key)}
    `.run(client);

    if (!role) {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: 'Bad request: Role not found',
      });
    }

    await db.sql`
      DELETE FROM permissions 
      WHERE role_id = ${db.param(role.id)}
    `.run(client);

    if (permissionPairs.length > 0) {
      await db.sql`
        INSERT INTO permissions (role_id, resource_id, action_id)
        SELECT 
          ${db.param(role.id)},
          r.id as resource_id,
          a.id as action_id
        FROM 
          UNNEST(${db.param(permissionPairs.map(p => p.resource))}::text[]) WITH ORDINALITY t(resource, ord)
          JOIN resources r ON r.name = t.resource
          JOIN UNNEST(${db.param(permissionPairs.map(p => p.action))}::text[]) WITH ORDINALITY t2(action, ord) ON t.ord = t2.ord
          JOIN actions a ON a.name = t2.action
      `.run(client);
    }

    await client.query('COMMIT');
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}); 