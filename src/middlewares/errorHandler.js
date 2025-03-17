const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message); // Log errors in the console for debugging

    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong!",
        error: err.error || "Internal Server Error"
    });
};

module.exports = errorHandler;
