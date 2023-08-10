const path = require('path');
const express = require('express');

const router = express.Router();

const userController = require('../controllers/signup');
const loginController = require('../controllers/login');

router.post('/user/signup', userController.postSignupUser);
router.post('/user/login', loginController.postUserLogin);

module.exports=router;