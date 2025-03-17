const express = require('express');
const {ProductController} = require('../../controllers');

const router = express.Router();

router.post('/', ProductController.createProduct);
//router.get('/', photectRoute,adminRoute,ProductController.getAllProducts);
router.get('/',ProductController.getAllProducts);

module.exports = router;
