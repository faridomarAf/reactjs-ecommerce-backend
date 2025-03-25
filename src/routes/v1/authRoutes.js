const express = require('express');
const {AuthController} = require('../../controllers');
const {AuthMiddleware} = require('../../middlewares');


const router = express.Router();

router.post('/register', AuthMiddleware.validateRegisterInput,AuthController.register);
router.post('/logout',AuthController.logout);
router.post('/login',AuthMiddleware.validateLoginInput,AuthController.login);
router.post('/refresh-token',AuthController.refreshToken);
router.get('/profile', AuthMiddleware.protectRoute ,AuthController.getProfile);


module.exports = router;