const User = require('../models/user.modle.js');
const {StatusCodes} = require('http-status-codes');
const {AppError,GenerateTokens,StoreRefreshToken, SetCookies, ClearTokens, GenerateRefreshToken} = require('../utils');
const {ErrorResponse, SuccessResponse} = require('../utils/common');

const register = async(req, res)=>{
    const {name, email, password} = req.body;
    try {
        const existingUser  = await User.findOne({email});
        if(existingUser){
            throw new AppError('Email is already exist', StatusCodes.BAD_REQUEST);
        }
        
        const user = await User.create({
            name,
            email,
            password
        });

        //authentication
        const {accessToken, refreshToken} = GenerateTokens(user._id);

        //save refreshToken to redis-db
        await StoreRefreshToken(user._id, refreshToken);

        //to set cookies
        SetCookies(res, accessToken, refreshToken)


        SuccessResponse.data ={
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        if(error instanceof AppError){
            ErrorResponse.error = error.message;
            return res.status(error.statusCode).json(ErrorResponse);
        }
        
        ErrorResponse.error = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
        }

        const { accessToken, refreshToken } = GenerateTokens(user._id);
        await StoreRefreshToken(user._id, refreshToken);
        SetCookies(res, accessToken, refreshToken);

        const SuccessResponse = {
            message: "Login successful",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };

        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        const ErrorResponse = { error: error.message };

        if (error instanceof AppError) {
            return res.status(error.statusCode).json(ErrorResponse);
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
};



const logout = async (req, res) => {
    try {
        await ClearTokens(req, res);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

const refreshToken = async(req, res)=>{
    try {
        await GenerateRefreshToken(req, res);
    } catch (error) {
        return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

const getProfile = async(req, res, next)=>{
    try {
        const user = req.user;
        return res.status(StatusCodes.OK).json(user)
    } catch (error) {
        next(new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}


module.exports ={
    register,
    login,
    logout,
    refreshToken,
    getProfile
}