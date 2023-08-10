const path = require('path');
const express = require('express');

const router = express.Router();

const userController = require('../controllers/signup');


router.post('/user/signup', userController.postSignupUser);

module.exports=router;