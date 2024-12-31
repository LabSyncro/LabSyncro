import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';
import { BorrowedReceiptResourceDto } from '~/lib/api_schema';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import type { Static } from '@sinclair/typebox';
import { INTERNAL_SERVER_ERROR_CODE, BAD_REQUEST_CODE } from '~/constants';
import { getToken } from '#auth';

const QueryDto = Type.Object({
  offset: Type.Number(),
  length: Type.Number(),
  search_text: Type.Optional(Type.String()),
  search_fields: Type.Optional(
    Type.Array(
      Type.Union([
        Type.Literal('device_kind_id'),
        Type.Literal('device_kind_name'),
        Type.Literal('borrowed_place'),
        Type.Literal('returned_place'),
      ]),
    ),
  ),
  sort_field: Type.Optional(
    Type.Union([
      Type.Literal('device_kind_name'),
      Type.Literal('quantity'),
      Type.Literal('borrowed_place'),
      Type.Literal('returned_place'),
      Type.Literal('borrowed_at'),
      Type.Literal('status'),
      Type.Literal('expected_returned_at'),
    ]),
  ),
  desc: Type.Optional(Type.Boolean()),
});

type QueryDto = Static<typeof QueryDto>;

export default defineEventHandler<
  { query: QueryDto },
  Promise<BorrowedReceiptResourceDto>
>(async (event) => {
  await requirePermission(event, '/borrow-return:edit');

  const token = await getToken({ event });
  const query = Value.Convert(QueryDto, getQuery(event));
  if (!Value.Check(QueryDto, query)) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message: 'Bad request: Invalid query string',
    });
  }
  const {
    offset,
    length,
    search_fields: searchFields,
    sort_field: sortField,
    desc,
  } = query;
  const searchText = query.search_text
    ?.replaceAll('\'', '')
    .replaceAll('%', '')
    .replaceAll('?', '');
  if (searchText !== undefined && !searchFields) {
    throw createError({
      statusCode: BAD_REQUEST_CODE,
      message:
        'Bad request: Expect search_fields to be present when search_text is specified',
    });
  }

  const userId = token?.id;

  const receipts = (
    await db.sql`
    WITH borrowed_devices AS (
      SELECT 
        dk.${'id'} as device_kind_id,
        dk.${'name'} as device_kind_name,
        dk.${'image'}->'main_image' as main_image,
        dk.${'image'}->'sub_images' as sub_images,
        COUNT(*)::INT as ${'quantity'},
        CONCAT(l_borrow.${'room'}, ', ', l_borrow.${'branch'}) as borrowed_place,
        CONCAT(l_expected.${'room'}, ', ', l_expected.${'branch'}) as returned_place,
        a_borrow.${'created_at'} as borrowed_at,
        rd.${'expected_returned_at'},
        CASE 
            WHEN CURRENT_TIMESTAMP <= rd.${'expected_returned_at'} THEN 'on_time'
            ELSE 'late'
        END as status
      FROM ${'receipts_devices'} rd
      JOIN ${'receipts'} r ON rd.${'receipt_id'} = r.${'id'}
      JOIN ${'devices'} d ON rd.${'device_id'} = d.${'id'}
      JOIN ${'device_kinds'} dk ON d.${'kind'} = dk.${'id'}
      JOIN ${'labs'} l_borrow ON r.${'borrowed_lab_id'} = l_borrow.${'id'}
      JOIN ${'activities'} a_borrow ON rd.${'borrow_id'} = a_borrow.${'id'}
      LEFT JOIN ${'activities'} a_return ON rd.${'return_id'} = a_return.${'id'}
      LEFT JOIN ${'labs'} l_expected ON rd.${'expected_returned_lab_id'} = l_expected.${'id'}
      WHERE
        r.${'borrower_id'} = ${db.param(userId)}
        AND rd.${'return_id'} IS NULL
      GROUP BY 
        dk.${'id'},
        dk.${'name'},
        dk.${'image'}->'main_image',
        dk.${'image'}->'sub_images',
        l_borrow.${'room'},
        l_borrow.${'branch'},
        l_expected.${'room'},
        l_expected.${'branch'},
        a_borrow.${'created_at'},
        rd.${'expected_returned_at'}
    )
    SELECT 
      device_kind_id,
      device_kind_name,
      main_image,
      sub_images,
      quantity,
      borrowed_place,
      returned_place,
      borrowed_at,
      expected_returned_at,
      status
    FROM borrowed_devices
    ${
    searchText !== undefined && searchFields?.length
      ? db.raw(`WHERE (
      (${searchFields.includes('device_kind_id')} AND device_kind_id ILIKE '%${searchText}%') OR
      (${searchFields.includes('device_kind_name')} AND strip_vietnamese_accents(device_kind_name) ILIKE strip_vietnamese_accents('%${searchText}%')) OR
      (${searchFields.includes('borrowed_place')} AND strip_vietnamese_accents(borrowed_place) ILIKE strip_vietnamese_accents('%${searchText}%')) OR
      (${searchFields.includes('returned_place')} AND strip_vietnamese_accents(returned_place) ILIKE strip_vietnamese_accents('%${searchText}%'))
    )`)
      : db.raw('')
    }
    ORDER BY 
      ${
    sortField
      ? db.raw(
        `${sortField} ${desc ? 'DESC' : 'ASC'}, expected_returned_at ASC, borrowed_at DESC`,
      )
      : db.raw('expected_returned_at ASC, borrowed_at DESC')
    }    
    LIMIT ${db.param(length)}
    OFFSET ${db.param(offset)}
    `.run(dbPool)
  ).map(
    ({
      device_kind_id,
      device_kind_name,
      main_image,
      sub_images,
      quantity,
      borrowed_place,
      returned_place,
      borrowed_at,
      expected_returned_at,
      status,
    }) => ({
      id: device_kind_id,
      name: device_kind_name,
      mainImage: main_image,
      subImages: sub_images,
      quantity,
      borrowedPlace: borrowed_place,
      returnedPlace: returned_place,
      borrowedAt: borrowed_at,
      expectedReturnedAt: expected_returned_at,
      status,
    }),
  );

  const [{ total_records: totalRecords }] = await db.sql`
    SELECT COUNT(*) as total_records
    FROM ${'receipts_devices'} rd
    JOIN ${'receipts'} r ON rd.${'receipt_id'} = r.${'id'}
    JOIN ${'devices'} d ON rd.${'device_id'} = d.${'id'}
    JOIN ${'device_kinds'} dk ON d.${'kind'} = dk.${'id'}
    JOIN ${'labs'} l_borrow ON r.${'borrowed_lab_id'} = l_borrow.${'id'}
    JOIN ${'activities'} a_borrow ON rd.${'borrow_id'} = a_borrow.${'id'}
    LEFT JOIN ${'activities'} a_return ON rd.${'return_id'} = a_return.${'id'}
    LEFT JOIN ${'labs'} l_expected ON rd.${'expected_returned_lab_id'} = l_expected.${'id'}
    WHERE 
      r.${'borrower_id'} = ${db.param(userId)}
      AND rd.${'return_id'} IS NULL
      ${
  searchText !== undefined
    ? db.raw(`AND (
        (${searchFields?.includes('device_kind_id') || false} AND dk.${'id'} ILIKE '%${searchText}%') OR
        (${searchFields?.includes('device_kind_name') || false} AND strip_vietnamese_accents(dk.${'name'}) ILIKE strip_vietnamese_accents('%${searchText}%')) OR
        (${searchFields?.includes('borrowed_place') || false} AND strip_vietnamese_accents(CONCAT(l_borrow.${'room'}, ', ', l_borrow.${'branch'})) ILIKE strip_vietnamese_accents('%${searchText}%')) OR
        (${searchFields?.includes('returned_place') || false} AND strip_vietnamese_accents(CONCAT(l_expected.${'room'}, ', ', l_expected.${'branch'})) ILIKE strip_vietnamese_accents('%${searchText}%'))
      )`)
    : db.raw('')
}
  `.run(dbPool);

  const totalPages = Math.ceil(totalRecords / length);
  const currentPage = Math.floor(offset / length);

  const output = { receipts, totalPages, currentPage };

  if (!Value.Check(BorrowedReceiptResourceDto, output)) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message:
        'Internal server error: the returned output does not conform to the schema',
    });
  }
  return output;
});
