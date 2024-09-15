import {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} from "~/constants";
import { initDbClient } from "~/server/db/connection";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId: string | undefined = body.id;

  const dbClient = await initDbClient();

  if (!userId) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: "Missed user ID!",
    });
  }

  try {
    const query = ` SELECT public.user.id AS user_id, public.user.name AS user_name, role_name, resource_name, action_name
                    FROM public.user
                    LEFT JOIN (
                      SELECT role.name AS role_name, role.id AS role_id, resource.name AS resource_name, action.name AS action_name
                      FROM permission
                      JOIN role ON role.id = permission.role_id
                      JOIN resource ON resource.id = permission.resource_id
                      JOIN action ON action.id = permission.action_id
                    ) AS rbac ON public.user.role_id = rbac.role_id
                    WHERE public.user.id = $1`;

    const { rows } = await dbClient.query(query, [userId]);

    if (!rows || rows.length === 0) {
      throw createError({
        statusCode: NOT_FOUND_CODE,
        message: "User not found",
      });
    }

    return {
      userId: rows[0].user_id,
      name: rows[0].user_name,
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
