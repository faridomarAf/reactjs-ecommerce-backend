const {StatusCodes} = require('http-status-codes');
const {AppError} = require('../utils');


const addToCart = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const user = req.user; // Extracted from token in a protected route

        if (!productId) {
            return next(new AppError("Product ID is required", StatusCodes.BAD_REQUEST));
        }

        const existingItem = user.cartItems.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push({ id: productId, quantity: 1 });
        }

        await user.save();

        return res.status(StatusCodes.OK).json({
            success: true,
            data: user.cartItems,
            message: "Item added to cart successfully!"
        });
    } catch (error) {
        next(new AppError(error.message || "Failed to add item to cart", StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


module.exports ={
    addToCart,
}