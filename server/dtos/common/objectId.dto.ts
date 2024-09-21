import { ID_LENGTH } from '~/constants';
import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';

export const ObjectId = Type.String({
  minLength: ID_LENGTH,
  maxLength: ID_LENGTH,
});

export type ObjectId = Static<typeof ObjectId>;
