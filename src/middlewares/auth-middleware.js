const { StatusCodes } = require('http-status-codes');
const {ErrorResponse} = require('../utils/common');
const jwt = require('jsonwebtoken');
const User = require('../models/user.modle.js');
const { AppError } = require('../utils');


const validateRegisterInput = (req, res, next) => {

    if(!req.body.name){
        ErrorResponse.message = 'Something went wrong while registering user';
        ErrorResponse.error=  "Name is required!"
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }

    if(!req.body.email){
        ErrorResponse.message = 'Something went wrong while registering user';
        ErrorResponse.error=  "Email is required!"
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }

    if(!req.body.password){
        ErrorResponse.message = 'Something went wrong while registering user';
        ErrorResponse.error=  "Password is required!"
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }

    if(req.body.password.length < 6){
        ErrorResponse.message = 'Something went wrong while registering user';
        ErrorResponse.error=  "Password must be at least 6 characters!"
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }
    next();
};

const validateLoginInput = (req, res, next)=>{
    if(!req.body.email){
        ErrorResponse.message = 'Something went wrong while registering user';
        ErrorResponse.error=  "Email is required!"
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }

    if(!req.body.password){
        ErrorResponse.message = 'Something went wrong while registering user';
        ErrorResponse.error=  "Password is required!"
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }

    next();
};



const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken;
        
        if (!accessToken) {
            return next(new AppError("Unauthorized: No token provided", StatusCodes.UNAUTHORIZED));
        }

        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return next(new AppError("Unauthorized: User not found", StatusCodes.UNAUTHORIZED));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new AppError(error.message || "Invalid token", StatusCodes.FORBIDDEN));
    }
};

module.exports = protectRoute;



module.exports = {
    validateRegisterInput,
    validateLoginInput,
    protectRoute,
};
