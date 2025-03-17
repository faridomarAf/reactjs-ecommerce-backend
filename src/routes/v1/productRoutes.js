const express = require('express');
const {ProductController} = require('../../controllers');

const router = express.Router();

router.post('/', ProductController.createProduct);

module.exports = router;
