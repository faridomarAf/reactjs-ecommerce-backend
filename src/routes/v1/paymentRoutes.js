const express = require('express');
const {PaymentController } = require('../../controllers');
const { AuthMiddleware} = require('../../middlewares');


const router = express.Router();

router.post('/create-checkout-session', AuthMiddleware.protectRoute,PaymentController.createCheckoutSession);
router.post('/checkout-success', AuthMiddleware.protectRoute,PaymentController.checkoutSuccess);

module.exports = router;