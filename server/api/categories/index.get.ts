import * as db from 'zapatos/db';
import type { ListOfCategoryResourceDto } from '~/lib/api_schema';
import { dbPool } from '~/server/db';

export default defineEventHandler<Promise<ListOfCategoryResourceDto>>(async () => {
  const categories = (await db.select('categories', {}).run(dbPool)).map(({ name, id }) => ({ id, name }));
  return {
    categories,
  };
});
