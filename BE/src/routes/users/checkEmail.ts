import { emailExists } from '@controllers/user';
import { type ControllerParams } from '@ts-types/general-types';

/**
 * Check whether an email exists in the users table
 * @param {ControllerParams} options
 * @returns {Promise<{ exists: boolean }>}
 */
const checkEmail = async (options: ControllerParams): Promise<{ data: { exists: boolean } }> => {
    const email = (options.query as any)?.email as string;
    const exists = await emailExists(email);
    return { data: { exists } };
};

export default checkEmail;
