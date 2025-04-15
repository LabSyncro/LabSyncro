import * as db from 'zapatos/db';
import { BAD_REQUEST_CODE, NOT_FOUND_CODE, INTERNAL_SERVER_ERROR_CODE } from '~/constants';
import { dbPool } from '~/server/db';
import { Type, type Static } from '@sinclair/typebox';

const ResponseSuccessDto = Type.Object({
  status: Type.Literal('success'),
  token: Type.String()
});

const ResponsePendingDto = Type.Object({
  status: Type.Literal('pending')
});

type ResponseSuccessDto = Static<typeof ResponseSuccessDto>;
type ResponsePendingDto = Static<typeof ResponsePendingDto>;

export default defineEventHandler(async (event) => {
  try {
    const hmiCode = getRouterParam(event, 'hmiCode');
    
    if (!hmiCode) {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: 'Bad request: HMI code is required'
      });
    }

    if (!/^\d{6}$/.test(hmiCode)) {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: 'Bad request: Invalid HMI code format'
      });
    }
    
    const hmiCodeResult = await db.sql`
      SELECT code, status, auth_token, expires_at 
      FROM hmi_codes 
      WHERE code = ${db.param(hmiCode)}
    `.run(dbPool);
    
    if (hmiCodeResult.length === 0) {
      throw createError({
        statusCode: NOT_FOUND_CODE,
        message: 'HMI code not found or expired'
      });
    }
    
    const hmiCodeData = hmiCodeResult[0];
    
    if (new Date(hmiCodeData.expires_at) < new Date()) {
      throw createError({
        statusCode: NOT_FOUND_CODE,
        message: 'HMI code has expired'
      });
    }

    if (hmiCodeData.status === 'success' && hmiCodeData.auth_token) {
      const response: ResponseSuccessDto = {
        status: 'success',
        token: hmiCodeData.auth_token
      };
      
      await db.sql`
        UPDATE hmi_codes 
        SET status = 'used', updated_at = NOW() 
        WHERE code = ${db.param(hmiCode)}
      `.run(dbPool);
      
      return response;
    } else if (hmiCodeData.status === 'pending') {
      const response: ResponsePendingDto = {
        status: 'pending'
      };
      
      return response;
    } else {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: `Authentication error: ${hmiCodeData.status}`
      });
    }
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