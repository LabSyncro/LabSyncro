import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';
import * as db from 'zapatos/db';
import { NOT_FOUND_CODE } from '~/constants';
import { dbPool } from '~/server/db';

const CategoryOutputDto = Type.Object({
  id: Type.Number(),
  name: Type.String(),
});

type CategoryOutputDto = Static<typeof CategoryOutputDto>;

export default defineEventHandler<
  Promise<CategoryOutputDto>
>(async (event) => {
  const categoryId = Number.parseInt(getRouterParam(event, 'id')!);
  try {
    const { name, id } = await db.selectExactlyOne('categories', { id: categoryId }).run(dbPool);
    return {
      id,
      name,
    };
  } catch {
    throw createError({
      statusCode: NOT_FOUND_CODE,
      message: 'Category not found!',
    });
  }
});
