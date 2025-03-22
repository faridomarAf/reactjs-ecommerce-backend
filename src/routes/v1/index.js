const express = require('express');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const couponRoutes = require('./couponRoutes');
const paymentRoutes = require('./paymentRoutes');

const router = express.Router();


router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/coupons', couponRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;