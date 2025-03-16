const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');


const generateRefreshToken =  async(req, res)=>{
    const {AppError} = require('../../utils');
    const {Redis} = require('../../config');

    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            throw new AppError('No refresh token provided!', StatusCodes.BAD_REQUEST);
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        const storedToken = await Redis.get(`refresh_token:${decoded.userId}`);

        if(storedToken !== refreshToken){
            throw new AppError('Invalid refresh token!',StatusCodes.BAD_REQUEST);
        }

        //generate new accessToken
        const accessToken = jwt.sign({userId: decoded.userId}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15m'
        });

        res.cookie('accessToken', accessToken,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        return res.status(StatusCodes.OK).json({ message: 'Token refreshed successfully!', accessToken });
    } catch (error) {
        throw new Error(error.message); 
    }
};

module.exports = generateRefreshToken;
