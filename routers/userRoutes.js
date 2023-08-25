const path = require('path');
const express = require('express');

const router = express.Router();

const userController = require('../controllers/signup');
const loginController = require('../controllers/login');
const userAuthenication = require('../middleware/auth');
// const userChats = require('../controllers/chat');
const groupController = require('../controllers/group');

router.post('/user/signup', userController.postSignupUser);
router.post('/user/login', loginController.postUserLogin);
// router.post('/user/chat', userAuthenication.authenticate, userChats.postUserChats);
// router.get('/user/getchats', userAuthenication.authenticate, userChats.getChats);

router.get('/user/getgroups', userAuthenication.authenticate, groupController.getUserGroups);

module.exports=router;