const Coupon = require('../models/coupon.model.js');
const {AppError} = require('../utils');
const {StatusCodes} = require('http-status-codes');


const getCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });

        if (!coupon) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "No active coupon found",
            });
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            data: coupon,
            message: "Coupon retrieved successfully",
        });
    } catch (error) {
        next(new AppError(error.message || "Failed to retrieve coupon", StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


module.exports = {
    getCoupon,

}