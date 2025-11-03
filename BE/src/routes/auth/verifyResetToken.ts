import Error from '@/errors/authenticationError';
import { type ResponseModel } from '@ts-types/response-model';
import { type ControllerParams } from '@ts-types/general-types';
import db from '@/utils/knex';

interface VerifyTokenParams extends ControllerParams {
    id?: string;
}

/**
 * Verify reset token
 * @param {VerifyTokenParams} options verify token parameters
 * @returns {Promise<ResponseModel>} success response with email
 */
const verifyResetToken = async (options: VerifyTokenParams): Promise<ResponseModel> => {
    const { id } = options;

    if (!id) {
        throw new Error('Invalid reset token');
    }

    // Look up the token in the database using the hash
    const Knex = db();
    const tempToken = await Knex('temp_token')
        .where('token', id)
        .where('type', 'forgot-password')
        .first();

    if (!tempToken) {
        throw new Error('Invalid or expired reset token');
    }

    // Check if token has expired
    const now = new Date();
    if (new Date(tempToken.expires_at) < now) {
        throw new Error('Reset token has expired');
    }

    // Get the email from the data field
    let email: string | null = null;

    if (tempToken.data) {
        try {
            // PostgreSQL JSONB returns the data as an object, not a string
            const data = typeof tempToken.data === 'string' ? JSON.parse(tempToken.data) : tempToken.data;
            if (data.email) {
                email = data.email;
            }
        } catch (err) {
            console.error('Could not parse email from data field', err);
        }
    }

    if (!email) {
        throw new Error('Invalid token data - email not found');
    }

    return {
        data: {
            email,
            success: true,
        } as any,
    };
};

export default verifyResetToken;