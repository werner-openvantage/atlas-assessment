import { type TempToken } from '@ts-types/general-types';
import db from '@utils/knex';

const Knex = db();

/**
 * Create a temporary token
 * @param {TempToken} token the token to create
 * @returns {string} token id
 */
export const createTempToken = async (token: TempToken): Promise<string> => {
  try {
    // Convert token to JSON string for storage
    const tokenString = typeof token.token === 'string' ? token.token : JSON.stringify(token.token);

    // Use Knex onConflict().merge() for proper UPSERT
    // This replaces the old token if it already exists
    const res = await Knex('temp_token')
      .insert({
        token: tokenString,
        type: token.type,
        expires_at: token.expires_at,
        data: token.data || null, // Include data field if provided
      })
      .onConflict('token')
      .merge(['type', 'expires_at', 'data'])
      .returning('id');

    if (!res || res.length === 0) {
      throw new Error('An error Occurred while creating token');
    }

    const tempToken = res[0] as any;
    if (!tempToken.id) {
      throw new Error('An error Occurred while creating token');
    }
    return tempToken.id;
  } catch (err: any) {
    // Log the error for debugging
    console.error('Error creating temp token:', err);
    throw err;
  }
};

/**
 * Delete Token after it has been used
 * @param {string} id - Token ID
 * @returns { bool }
 */
export const deleteTempToken = async (id: string): Promise<string> => {
  if (!id) {
    throw new Error('Token ID not found');
  }
  return await Knex('temp_token').where('id', id).del().returning('id');
};

/**
 * Delete Token after it has been used
 * @param {string} id - Token ID
 * @param {string} type - type of the token
 * @returns { bool }
 */
export const getTempToken = async (id: string, type: string): Promise<TempToken> => {
  if (!id) {
    throw new Error('Token ID not found');
  }

  const token = (await Knex('temp_token').select('*').where('id', id).returning('id').first()) as TempToken;

  if (!token) {
    throw new Error('Invalid Request, Token not found');
  } else {
    const today = new Date();
    if (new Date(token.expires_at ?? today) <= today) {
      throw new Error('Invalid Request, token expired');
    }
    if (token.type !== type) {
      throw new Error('Invalid Token');
    }
  }

  return token;
};

export default { createTempToken, deleteTempToken, getTempToken };
