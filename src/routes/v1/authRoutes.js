const express = require('express');
const {AuthController} = require('../../controllers');
const {AuthError} = require('../../middlewares');


const router = express.Router();

router.post('/register', AuthError.validateRegisterInput,AuthController.register);



module.exports = router;