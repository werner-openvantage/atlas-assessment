/**
 * Logout user
 * @param {any} options request options
 * @returns {Promise<any>} logout response
 */
const logout = async (options?: any): Promise<any> => {
    return {
        data: {
            success: true,
        },
    };
};

export default logout;
