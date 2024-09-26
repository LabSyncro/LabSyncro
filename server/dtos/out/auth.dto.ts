import { ObjectId } from '@/server/dtos/common';
import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';

const PermissionType = Type.Object({
  resource: Type.Union([Type.String(), Type.Null()]),
  action: Type.Union([Type.String(), Type.Null()]),
});

export const AuthOutputDto = Type.Object({
  id: ObjectId,
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  role: Type.Union([Type.String(), Type.Null()]),
  permission: Type.Array(PermissionType),
});

export type AuthOutputDto = Static<typeof AuthOutputDto>;
