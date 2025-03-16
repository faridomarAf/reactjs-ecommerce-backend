const express = require('express');
const {AuthController} = require('../../controllers');
const {AuthError} = require('../../middlewares');


const router = express.Router();

router.post('/register', AuthError.validateRegisterInput,AuthController.register);
router.post('/logout',AuthController.logout);
router.post('/login',AuthController.login);



module.exports = router;