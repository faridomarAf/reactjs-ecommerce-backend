const express = require('express');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');

const router = express.Router();


router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/cart', cartRoutes)

module.exports = router;