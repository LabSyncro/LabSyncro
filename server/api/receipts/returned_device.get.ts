import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';
import { ReturnedReceiptResourceDto } from '~/lib/api_schema';
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
            Type.Literal('borrowed_place'),
            Type.Literal('returned_place'),
            Type.Literal('borrowed_at'),
            Type.Literal('status'),
            Type.Literal('device_status'),
            Type.Literal('expected_returned_at'),
            Type.Literal('returned_at'),
        ]),
    ),
    desc: Type.Optional(Type.Boolean()),
});

type QueryDto = Static<typeof QueryDto>;

export default defineEventHandler<
    { query: QueryDto },
    Promise<ReturnedReceiptResourceDto>
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

    const receipts = (await db.sql`
    SELECT
      dk.id as device_kind_id,
      dk.name as device_kind_name,
      dk.image->'main_image' as main_image,
      dk.image->'sub_images' as sub_images,
      CONCAT(l_borrow.room, ', ', l_borrow.branch) as borrowed_place,
      CONCAT(l_expected.room, ', ', l_expected.branch) as returned_place,
      a_borrow.created_at as borrowed_at,
      a_return.created_at as returned_at,
      rd.expected_returned_at,
      CASE 
          WHEN a_return.created_at <= rd.expected_returned_at THEN 'on_time'
          ELSE 'late'
      END as status,
      rd.after_quality as device_status,
      a_return.note as note
    FROM ${'receipts_devices'} rd
    JOIN ${'receipts'} r_borrow ON rd.borrowed_receipt_id = r_borrow.id
    JOIN ${'devices'} d ON rd.device_id = d.id
    JOIN ${'device_kinds'} dk ON d.kind = dk.id
    JOIN ${'labs'} l_borrow ON r_borrow.lab_id = l_borrow.id
    JOIN ${'activities'} a_borrow ON rd.borrow_id = a_borrow.id
    JOIN ${'activities'} a_return ON rd.return_id = a_return.id
    JOIN ${'labs'} l_expected ON rd.expected_returned_lab_id = l_expected.id
    WHERE
      r_borrow.actor_id = ${db.param(userId)}
      AND rd.return_id IS NOT NULL
      ${
    searchText !== undefined && searchFields?.length
        ? db.sql`AND (
          (${db.param(searchFields.includes('device_kind_id'))} AND dk.id ILIKE ${db.param(`%${searchText}%`)}) OR
          (${db.param(searchFields.includes('device_kind_name'))} AND strip_vietnamese_accents(dk.name) ILIKE strip_vietnamese_accents(${db.param(`%${searchText}%`)})) OR
          (${db.param(searchFields.includes('borrowed_place'))} AND strip_vietnamese_accents(CONCAT(l_borrow.room, ', ', l_borrow.branch)) ILIKE strip_vietnamese_accents(${db.param(`%${searchText}%`)})) OR
          (${db.param(searchFields.includes('returned_place'))} AND l_expected.id IS NOT NULL AND strip_vietnamese_accents(CONCAT(l_expected.room, ', ', l_expected.branch)) ILIKE strip_vietnamese_accents(${db.param(`%${searchText}%`)}))
        )`
        : db.raw('')
      }
    ORDER BY 
      ${sortField
        ? db.raw(
            `${sortField} ${desc ? 'DESC' : 'ASC'}, returned_at ASC, borrowed_at DESC`,
        )
        : db.raw('returned_at ASC, borrowed_at DESC')
      }    
    LIMIT ${db.param(length)}
    OFFSET ${db.param(offset)}
    `.run(dbPool)).map(
        ({
            device_kind_id,
            device_kind_name,
            main_image,
            sub_images,
            borrowed_place,
            returned_place,
            borrowed_at,
            expected_returned_at,
            returned_at,
            status,
            device_status,
            note,
        }) => ({
            id: device_kind_id,
            name: device_kind_name,
            mainImage: main_image,
            subImages: sub_images,
            borrowedPlace: borrowed_place,
            returnedPlace: returned_place,
            borrowedAt: borrowed_at,
            expectedReturnedAt: expected_returned_at,
            returnedAt: returned_at,
            status,
            deviceStatus: device_status,
            note,
        }),
    );

    const [{ total_records: totalRecords }] = await db.sql`
    SELECT COUNT(*) as total_records
    FROM ${'receipts_devices'} rd
    JOIN ${'receipts'} r_borrow ON rd.borrowed_receipt_id = r_borrow.id
    JOIN ${'devices'} d ON rd.device_id = d.id
    JOIN ${'device_kinds'} dk ON d.kind = dk.id
    JOIN ${'labs'} l_borrow ON r_borrow.lab_id = l_borrow.id
    JOIN ${'activities'} a_borrow ON rd.borrow_id = a_borrow.id
    JOIN ${'activities'} a_return ON rd.return_id = a_return.id
    JOIN ${'labs'} l_expected ON rd.expected_returned_lab_id = l_expected.id
    WHERE
      r_borrow.actor_id = ${db.param(userId)}
      AND rd.return_id IS NOT NULL
      ${
    searchText !== undefined && searchFields?.length
        ? db.sql`AND (
          (${db.param(searchFields.includes('device_kind_id'))} AND dk.id ILIKE ${db.param(`%${searchText}%`)}) OR
          (${db.param(searchFields.includes('device_kind_name'))} AND strip_vietnamese_accents(dk.name) ILIKE strip_vietnamese_accents(${db.param(`%${searchText}%`)})) OR
          (${db.param(searchFields.includes('borrowed_place'))} AND strip_vietnamese_accents(CONCAT(l_borrow.room, ', ', l_borrow.branch)) ILIKE strip_vietnamese_accents(${db.param(`%${searchText}%`)})) OR
          (${db.param(searchFields.includes('returned_place'))} AND l_expected.id IS NOT NULL AND strip_vietnamese_accents(CONCAT(l_expected.room, ', ', l_expected.branch)) ILIKE strip_vietnamese_accents(${db.param(`%${searchText}%`)}))
        )`
        : db.raw('')
      }
    `.run(dbPool);

    const totalPages = Math.ceil(totalRecords / length);
    const currentPage = Math.floor(offset / length);

    const output = { receipts, totalPages, currentPage };

    // if (!Value.Check(ReturnedReceiptResourceDto, output)) {
    //     throw createError({
    //         statusCode: INTERNAL_SERVER_ERROR_CODE,
    //         message:
    //             'Internal server error: the returned output does not conform to the schema',
    //     });
    // }

    return output;
});
