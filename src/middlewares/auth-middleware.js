const { StatusCodes } = require('http-status-codes');
const {ErrorResponse} = require('../utils/common');
const jwt = require('jsonwebtoken');
const User = require('../models/user.modle.js');
const { AppError } = require('../utils');

const validateRegisterInput = (req, res, next) => {
    if (!req.body.name) {
        return next(new AppError("Name is required!", StatusCodes.BAD_REQUEST));
    }

    if (!req.body.email) {
        return next(new AppError("Email is required!", StatusCodes.BAD_REQUEST));
    }

    if (!req.body.password) {
        return next(new AppError("Password is required!", StatusCodes.BAD_REQUEST));
    }

    if (req.body.password.length < 6) {
        return next(new AppError("Password must be at least 6 characters!", StatusCodes.BAD_REQUEST));
    }

    next();
};


const validateLoginInput = (req, res, next) => {
    if (!req.body.email) {
        return next(new AppError("Email is required!", StatusCodes.BAD_REQUEST));
    }

    if (!req.body.password) {
        return next(new AppError("Password is required!", StatusCodes.BAD_REQUEST));
    }

    next();
};


const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken;

        console.log({accessToken});
        
        
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

const adminRoute = (req, res, next)=>{
    if(req.user && req.user.role === 'admin'){
        next();
    }else{
        return next(new AppError('Access denied, Only Admin'))
    }
}

module.exports = {
    validateRegisterInput,
    validateLoginInput,
    protectRoute,
    adminRoute
};
