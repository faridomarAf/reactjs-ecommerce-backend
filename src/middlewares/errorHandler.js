const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong!"
    });
};

module.exports = errorHandler;
