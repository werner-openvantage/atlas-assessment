import { RequestModel } from '@/types/request';

/**
 * Get current authenticated user
 * @param {any} options request options
 * @returns {Promise<any>} current user data
 */
const getCurrentUser = async (options: any): Promise<any> => {
    const { user } = options;

    if (!user) {
        throw new Error('Unauthorized');
    }

    return {
        data: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_super_admin: user.is_super_admin,
        }
    };
};

export default getCurrentUser;
