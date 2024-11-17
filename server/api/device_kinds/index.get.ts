import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';
import * as db from 'zapatos/db';
import { BAD_REQUEST_CODE } from '~/constants';
import { dbPool } from '~/server/db';

const DeviceKindOutputDto = Type.Object({
  deviceKinds: Type.Array(Type.Object({
    id: Type.String(),
    name: Type.String(),
    brand: Type.Optional(Type.String()),
    manufacturer: Type.Optional(Type.String()),
    mainImage: Type.String(),
    subImages: Type.Array(Type.String()),
    quantity: Type.String(),
    borrowableQuantity: Type.String(),
  })),
  totalPages: Type.Number(),
  currentPage: Type.Number(),
});

type DeviceKindOutputDto = Static<typeof DeviceKindOutputDto>;

export default defineEventHandler<
  { query: { category_id?: number, offset: number, length: number, search_text?: string, search_fields?: ('device_id' | 'device_name')[] } },
  Promise<DeviceKindOutputDto>
>(async (event) => {
  const { category_id: categoryId, offset, length, search_fields: searchFields } = getQuery(event);
  const searchText = getQuery(event).search_text?.replaceAll('\'', '');
  if (searchText !== undefined && !searchFields) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request',
    });
  }
  if (typeof categoryId === 'string') {
    const deviceKinds = await (db.sql`
      SELECT ${'device_kinds'}.${'unit'}, ${'device_kinds'}.${'brand'}, ${'device_kinds'}.${'manufacturer'}, ${'device_kinds'}.${'image'}, ${'device_kinds'}.${'id'}, ${'device_kinds'}.${'name'}, count(*)::int as ${'quantity'}, sum(CASE WHEN ${'devices'}.${'status'} = 'healthy' THEN 1 ELSE 0 END)::int as borrowable_quantity, MAX(${'categories'}.${'name'}) as categorydevice_kin
      FROM ${'devices'}
        JOIN ${'device_kinds'}
        ON ${'devices'}.${'kind'} = ${'device_kinds'}.${'id'} AND ${'device_kinds'}.${'deleted_at'} IS NULL
        JOIN ${'categories'}
        ON ${'categories'}.${'id'} = ${'device_kinds'}.${'category_id'}
      WHERE ${'category_id'} = ${db.param(Number.parseInt(categoryId))} AND ${'devices'}.${'deleted_at'} IS NULL ${searchText !== undefined ? db.raw(`AND (
        (${searchFields?.includes('device_id') || false} AND CAST(devices.id AS TEXT) LIKE '%${searchText}%') OR
        (${searchFields?.includes('device_name') || false} AND CAST(device_kinds.name AS TEXT) LIKE '%${searchText}%')
      )`) : db.raw('')}
      GROUP BY ${'device_kinds'}.${'id'}
      ORDER BY ${'device_kinds'}.${'id'}
      LIMIT ${db.param(length)}
      OFFSET ${db.param(offset)}
      `).run(dbPool);
    const [{ quantity: totalRecords }] = await (db.sql`
      SELECT COUNT (DISTINCT ${'device_kinds'}.${'id'}) as quantity
      FROM ${'devices'}
      JOIN ${'device_kinds'}
      ON ${'device_kinds'}.${'id'} = ${'devices'}.${'kind'}
      WHERE ${'category_id'} = ${db.param(Number.parseInt(categoryId))}
        AND ${'device_kinds'}.${'deleted_at'} IS NULL AND ${'devices'}.${'deleted_at'} IS NULL ${searchText !== undefined ? db.raw(`AND (
        (${searchFields?.includes('device_id') || false} AND CAST(devices.id AS TEXT) LIKE '%${searchText}%') OR
        (${searchFields?.includes('device_name') || false} AND CAST(device_kinds.name AS TEXT) LIKE '%${searchText}%')
        )`) : db.raw('')}
      `).run(dbPool);
    const totalPages = Math.ceil(totalRecords / length);
    const currentPage = Math.floor(offset / length);
    return {
      deviceKinds: deviceKinds.map(({ id, name, quantity, brand, manufacturer, image: { main_image, sub_images }, unit, borrowable_quantity, category }) => ({ id, name, quantity, brand, manufacturer, mainImage: main_image, subImages: sub_images, unit, borrowableQuantity: borrowable_quantity, category })),
      totalPages,
      currentPage,
    };
  }
  const deviceKinds = await (db.sql`
      SELECT ${'device_kinds'}.${'unit'}, ${'device_kinds'}.${'brand'}, ${'device_kinds'}.${'manufacturer'}, ${'device_kinds'}.${'image'}, ${'device_kinds'}.${'id'}, ${'device_kinds'}.${'name'}, count(*)::int as ${'quantity'}, sum(CASE WHEN ${'devices'}.${'status'} = 'healthy' THEN 1 ELSE 0 END)::int as borrowable_quantity, MAX(${'categories'}.${'name'}) as category
      FROM ${'devices'}
        JOIN ${'device_kinds'}
        ON ${'devices'}.${'kind'} = ${'device_kinds'}.${'id'} AND ${'device_kinds'}.${'deleted_at'} IS NULL
        JOIN ${'categories'}
        ON ${'categories'}.${'id'} = ${'device_kinds'}.${'category_id'}
      WHERE ${'devices'}.${'deleted_at'} IS NULL ${searchText !== undefined ? db.raw(`AND (
        (${searchFields?.includes('device_id') || false} AND CAST(devices.id AS TEXT) LIKE '%${searchText}%') OR
        (${searchFields?.includes('device_name') || false} AND CAST(device_kinds.name AS TEXT) LIKE '%${searchText}%')
      )`) : db.raw('')}
      GROUP BY ${'device_kinds'}.${'id'}
      ORDER BY ${'device_kinds'}.${'id'}
      LIMIT ${db.param(length)}
      OFFSET ${db.param(offset)}
    `).run(dbPool);
  const [{ quantity: totalRecords }] = await (db.sql`
    SELECT COUNT (DISTINCT ${'device_kinds'}.${'id'}) as quantity
    FROM ${'devices'}
    JOIN ${'device_kinds'}
    ON ${'device_kinds'}.${'id'} = ${'devices'}.${'kind'}
    WHERE ${'devices'}.${'deleted_at'} IS NULL AND ${'device_kinds'}.${'deleted_at'} IS NULL ${searchText !== undefined ? db.raw(`AND (
      (${searchFields?.includes('device_id') || false} AND CAST(devices.id AS TEXT) LIKE '%${searchText}%') OR
      (${searchFields?.includes('device_name') || false} AND CAST(device_kinds.name AS TEXT) LIKE '%${searchText}%')
    )`) : db.raw('')}
    `).run(dbPool);
  const totalPages = Math.ceil(totalRecords / length);
  const currentPage = Math.floor(offset / length);
  return {
    deviceKinds: deviceKinds.map(({ id, name, quantity, brand, manufacturer, image: { main_image, sub_images }, unit, borrowable_quantity, category }) => ({ id, name, quantity, brand, manufacturer, mainImage: main_image, subImages: sub_images, unit, borrowableQuantity: borrowable_quantity, category })),
    totalPages,
    currentPage,
  };
});
