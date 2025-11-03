import { emailExists } from '@controllers/user';
import { type ControllerParams } from '@ts-types/general-types';
import { AtlasError } from '@/types/error';

/**
 * Check whether an email exists in the users table
 * @param {ControllerParams} options
 * @returns {Promise<{ exists: boolean }>}
 */
const checkEmail = async (options: ControllerParams): Promise<{ data: { exists: boolean } }> => {
    // The controller() helper normalizes GET queries into a `query` object.
    // For this route we expect the bound `email` param to be passed explicitly from the route mapping.
    const email = (options as any)?.email as string | undefined;
    const normalized = email?.toString().trim();
    if (!normalized) {
        throw new AtlasError('Email query parameter is required', 400);
    }

    const exists = await emailExists(normalized);
    return { data: { exists } };
};

export default checkEmail;
