const path = require('path');
const express = require('express');
const router = express.Router();

const userAuthenication = require('../middleware/auth');
const groupController = require('../controllers/group');

router.get('/group/getusers', userAuthenication.authenticate, groupController.getUsers);
router.post('/group/creategroup', userAuthenication.authenticate, groupController.createGroup);
router.get('/group/getchats', userAuthenication.authenticate, groupController.getGroupChats);
router.post('/group/postchat', userAuthenication.authenticate, groupController.postGroupChats);
router.get('/group/getgroupusers', userAuthenication.authenticate, groupController.getGroupUsers);

module.exports=router;