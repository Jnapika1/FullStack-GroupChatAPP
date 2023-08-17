const path = require('path');
const express = require('express');

const router = express.Router();

const userController = require('../controllers/signup');
const loginController = require('../controllers/login');
const userAuthenication = require('../middleware/auth');
const userChats = require('../controllers/chat');
const groupController = require('../controllers/group');

router.post('/user/signup', userController.postSignupUser);
router.post('/user/login', loginController.postUserLogin);
router.post('/user/chat', userAuthenication.authenticate, userChats.postUserChats);
router.get('/user/getchats', userAuthenication.authenticate, userChats.getChats);

router.get('/group/getusers', userAuthenication.authenticate,groupController.getUsers);
router.post('/group/creategroup', userAuthenication.authenticate,groupController.createGroup);
router.get('/group/getchats', userAuthenication.authenticate, groupController.getGroupChats);
router.post('/group/postchat', userAuthenication.authenticate, groupController.postGroupChats);

router.get('/group/getgroupusers', userAuthenication.authenticate, groupController.getGroupUsers);
router.post('/group/deleteuser', userAuthenication.authenticate, groupController.deleteGroupUser)
router.get('/group/getuserstoadd', userAuthenication.authenticate, groupController.getAddUsersToGroup);
router.post('/group/addtogroup', userAuthenication.authenticate, groupController.postAddUsersToGroup);
router.post('/group/makeadmin', userAuthenication.authenticate, groupController.postMakeAdmin);

router.get('/user/getgroups', userAuthenication.authenticate, groupController.getUserGroup);

module.exports=router;