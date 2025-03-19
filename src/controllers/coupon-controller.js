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


const validateCoupon = async (req, res, next) => {
    try {
        const { code } = req.body;

        if (!code) {
            return next(new AppError("Coupon code is required!", StatusCodes.BAD_REQUEST));
        }

        const coupon = await Coupon.findOne({ code, userId: req.user._id, isActive: true });

        if (!coupon) {
            return next(new AppError("Coupon not found!", StatusCodes.NOT_FOUND));
        }

        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return next(new AppError("Coupon expired!", StatusCodes.GONE));
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            data: {
                code: coupon.code,
                discountPercentage: coupon.discountPercentage,
            },
            message: "Coupon validated successfully!",
        });
    } catch (error) {
        next(new AppError(error.message || "Failed to validate coupon", StatusCodes.INTERNAL_SERVER_ERROR));
    }
};



module.exports = {
    getCoupon,
    validateCoupon
}