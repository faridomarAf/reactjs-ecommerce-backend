const {Redis} = require('../../config');

const storeRefreshToken = async (userId, refreshToken)=>{
    await Redis.set(`refresh_token: ${userId}`, refreshToken,"EX",7*24*60*60);// 7 days
}

module.exports = storeRefreshToken