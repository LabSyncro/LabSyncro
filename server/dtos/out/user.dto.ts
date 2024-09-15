import { ObjectId } from "../common/objectId.dto";
import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";

const PermissionType = Type.Object({
  resource: Type.Union([Type.String(), Type.Null()]),
  action: Type.Union([Type.String(), Type.Null()]),
});

export const UserDto = Type.Object({
  id: ObjectId,
  name: Type.String(),
  role: Type.Union([Type.String(), Type.Null()]),
  permission: Type.Array(PermissionType),
});

export type UserDto = Static<typeof UserDto>;
