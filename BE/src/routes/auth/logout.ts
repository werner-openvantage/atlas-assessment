/**
 * Logout user
 * @returns {Promise<any>} logout response
 */
const logout = async (): Promise<any> => {
    return {
        data: {
            success: true,
        },
    };
};

export default logout;
