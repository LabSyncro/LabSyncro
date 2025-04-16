import * as db from 'zapatos/db';
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { BAD_REQUEST_CODE, NOT_FOUND_CODE, INTERNAL_SERVER_ERROR_CODE } from '~/constants';
import { dbPool } from '~/server/db';

const BodyDto = Type.Object({
  hmiCode: Type.String(),
  labId: Type.String()
});

type BodyDto = Static<typeof BodyDto>;

export default defineEventHandler(async (event) => {
  try {
    const body = Value.Convert(BodyDto, await readBody(event));
    if (!Value.Check(BodyDto, body)) {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: 'Bad request: Invalid body'
      });
    }
    
    const { hmiCode, labId } = body;

    if (!/^\d{6}$/.test(hmiCode)) {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: 'Bad request: Invalid HMI code format'
      });
    }
    
    const hmiCodeResult = await db.sql`
      SELECT code, status, user_id, auth_token, expires_at 
      FROM hmi_codes 
      WHERE code = ${db.param(hmiCode)}
    `.run(dbPool);
    
    if (hmiCodeResult.length === 0) {
      throw createError({
        statusCode: NOT_FOUND_CODE,
        message: 'HMI code not found'
      });
    }
    
    const hmiCodeData = hmiCodeResult[0];
    
    if (new Date(hmiCodeData.expires_at) < new Date()) {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: 'HMI code has expired'
      });
    }
    
    if (hmiCodeData.status !== 'success') {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: `HMI code is not in success status (current status: ${hmiCodeData.status})`
      });
    }
    
    const labResult = await db.sql`
      SELECT id 
      FROM labs
      WHERE id = ${db.param(labId)}
    `.run(dbPool);
    
    if (labResult.length === 0) {
      throw createError({
        statusCode: NOT_FOUND_CODE,
        message: 'Laboratory not found'
      });
    }

    await db.sql`
      UPDATE hmi_codes 
      SET 
        lab_id = ${db.param(labId)},
        updated_at = NOW() 
      WHERE code = ${db.param(hmiCode)}
    `.run(dbPool);
    
    return {
      success: true,
      message: 'Lab selection saved successfully'
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message: 'Internal server error'
    });
  }
}); 