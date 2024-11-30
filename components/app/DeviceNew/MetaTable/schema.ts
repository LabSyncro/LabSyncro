import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';

export const MetaSchema = Type.Object({
  attribute: Type.String(),
  value: Type.String(),
});

export type MetaSchema = Static<typeof MetaSchema>;
