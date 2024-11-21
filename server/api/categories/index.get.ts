import { Value } from '@sinclair/typebox/value';
import * as db from 'zapatos/db';
import { INTERNAL_SERVER_ERROR_CODE } from '~/constants';
import { ListOfCategoryResourceDto } from '~/lib/api_schema';
import { dbPool } from '~/server/db';

export default defineEventHandler<Promise<ListOfCategoryResourceDto>>(async () => {
  const categories = (await db.select('categories', {}).run(dbPool)).map(({ name, id }) => ({ id, name }));

  const output = { categories };

  if (!Value.Check(ListOfCategoryResourceDto, output)) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message: 'Internal server error: the returned output does not conform to the schema',
    });
  }

  return output;
});
