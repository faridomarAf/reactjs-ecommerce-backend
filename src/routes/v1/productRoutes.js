const express = require('express');
const {ProductController} = require('../../controllers');
const {AuthMiddleware} = require('../../middlewares');

const router = express.Router();

router.post('/',AuthMiddleware.protectRoute, AuthMiddleware.adminRoute,ProductController.createProduct);
router.get('/',AuthMiddleware.protectRoute, AuthMiddleware.adminRoute,ProductController.getAllProducts);
router.delete('/:id',AuthMiddleware.protectRoute, AuthMiddleware.adminRoute,ProductController.deleteProduct);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/recommendations', ProductController.getFeaturedProducts);
router.get('/category/:category', ProductController.getProductsByCategory);
router.patch('/:id',AuthMiddleware.protectRoute, AuthMiddleware.adminRoute,ProductController.toggleFeaturedProducts);

module.exports = router;
