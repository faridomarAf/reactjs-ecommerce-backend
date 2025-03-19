const {StatusCodes} = require('http-status-codes');
const {AppError} = require('../utils');


const addToCart = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const user = req.user;

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

const deleteAllFromCart = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter(item => item.id !== productId);
        }

        await user.save();

        return res.status(StatusCodes.OK).json({
            success: true,
            data: user.cartItems,
            message: productId ? "Item removed from cart successfully!" : "All items removed from cart successfully!"
        });
    } catch (error) {
        next(new AppError(error.message || "Failed to delete item from cart", StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

const updateQuantity = async (req, res, next)=>{
    try {
        const {id: productId} = req.params;
        const {quantity} = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find((item)=> item.id === productId);

        if(existingItem){
            if(quantity === 0){
                user.cartItems = user.cartItems.filter((item)=> item.id !== productId);
                await user.save();
                return res.json(user.cartItems)
            }
            // if quantity not equal to zero
            existingItem.quantity = quantity;
            await user.save();
            return res.status(StatusCodes.OK).json({
                success: true,
                data: user.cartItems,
                message: "Cart updated successfully!"
            });

        }else{
            next(new AppError("Item not found!", StatusCodes.NOT_FOUND));
        }
    } catch (error) {
        next(new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}


module.exports ={
    addToCart,
    deleteAllFromCart,
    updateQuantity
}