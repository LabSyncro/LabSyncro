import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';

export const LoginInputDto = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String(),
});

export type LoginInputDto = Static<typeof LoginInputDto>;
