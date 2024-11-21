import * as db from 'zapatos/db';
import { NOT_FOUND_CODE } from '~/constants';
import { dbPool } from '~/server/db';
import type { CategoryResourceDto } from '~/lib/api_schema';

export default defineEventHandler<
  Promise<CategoryResourceDto>
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
