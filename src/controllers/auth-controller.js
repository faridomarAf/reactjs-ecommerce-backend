const User = require('../models/user.modle.js');
const {StatusCodes} = require('http-status-codes');
const {AppError} = require('../utils');
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

        SuccessResponse.data = user;
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


const login = async(req, res)=>{
    return res.status(200).json({message: 'login roues'})
};


const logout = async(req, res)=>{
    return res.status(200).json({message: 'logout roues'})
};


module.exports ={
    register,
    login,
    logout
}