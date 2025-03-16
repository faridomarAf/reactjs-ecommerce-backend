const jwt = require('jsonwebtoken');
const {Redis} = require('../../config'); 

const clearTokens = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await Redis.del(`refresh_token:${decoded.userId}`);
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
    } catch (error) {
        throw new Error(error.message); 
    }
};

module.exports = clearTokens;