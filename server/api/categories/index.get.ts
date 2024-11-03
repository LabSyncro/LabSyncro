import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';
import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';

const CategoryOutputDto = Type.Object({
  categories: Type.Array(Type.String()),
});

type CategoryOutputDto = Static<typeof CategoryOutputDto>;

export default defineEventHandler<Promise<CategoryOutputDto>>(async () => {
  const categories = (await db.select('categories', {}).run(dbPool)).map(({ name }) => name);
  return {
    categories,
  };
});
