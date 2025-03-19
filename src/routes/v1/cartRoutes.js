const express = require('express');
const {CartController} = require('../../controllers');
const {AuthMiddleware} = require('../../middlewares');

const router = express.Router();

router.post('/', AuthMiddleware.protectRoute,CartController.addToCart);
//router.delete('/', AuthMiddleware.protectRoute,CartController.deleteAllFromCart);
//router.put('/:id', AuthMiddleware.protectRoute,CartController.updateQuantity);

module.exports = router;