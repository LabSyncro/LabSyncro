import {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} from "~/constants";
import { initDbClient } from "~/server/db/connection";
//import { UserDto } from "~/server/dtos/out/user.dto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId: string | undefined = body.id;

  const dbClient = await initDbClient();

  if (!userId) {
    return sendError(
      event,
      createError({ statusCode: BAD_REQUEST_CODE, message: "Missed user ID!" }),
    );
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
      return sendError(
        event,
        createError({ statusCode: NOT_FOUND_CODE, message: "User not found" }),
      );
    }

    return true;
  } catch (error) {
    console.log(error);
    return sendError(
      event,
      createError({
        statusCode: INTERNAL_SERVER_ERROR_CODE,
        message: "Server error",
      }),
    );
  }
});
