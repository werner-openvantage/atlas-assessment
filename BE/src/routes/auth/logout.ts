/**
 * Logout user
 * @param {any} options request options
 * @returns {Promise<any>} logout response
 */
const logout = async (options?: any): Promise<any> => {
    try {
        // Just return success - token is managed client-side
        return {
            data: {
                success: true,
                message: 'Logged out successfully'
            },
        };
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

export default logout;
