const { StatusCodes } = require('http-status-codes');
const {ErrorResponse} = require('../utils/common');

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

module.exports = {
    validateRegisterInput,
};
