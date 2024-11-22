import * as db from 'zapatos/db';
import { BAD_REQUEST_CODE, INTERNAL_SERVER_ERROR_CODE, NOT_FOUND_CODE } from '~/constants';
import { dbPool } from '~/server/db';
import { CategoryResourceDto } from '~/lib/api_schema';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

export default defineEventHandler<
  Promise<CategoryResourceDto>
>(async (event) => {
  const categoryId = Value.Convert(Type.Number(), getRouterParam(event, 'id'));
  if (typeof categoryId !== 'number') {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Expect :id route param to be a number',
    });
  }

  const { name, id } = await db.selectOne('categories', { id: categoryId }).run(dbPool) || {};

  if (name === undefined) {
    throw createError({
      statusCode: NOT_FOUND_CODE,
      message: 'Category not found!',
    });
  }

  const output = { name, id: id?.toString() };

  if (!Value.Check(CategoryResourceDto, output)) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message: 'Internal server error: the returned output does not conform to the schema',
    });
  }

  return output;
});
