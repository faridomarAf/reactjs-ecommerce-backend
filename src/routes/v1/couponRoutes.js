const express = require('express');
const {AuthMiddleware} = require('../../middlewares');
const {CouponController} = require('../../controllers');


const router = express.Router();

router.get('/',AuthMiddleware.protectRoute, CouponController.getCoupon);

module.exports = router;
