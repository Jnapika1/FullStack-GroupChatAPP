// const path = require('path');
const express = require('express');
const router = express.Router();

const userAuthenication = require('../middleware/auth');
const adminController = require('../controllers/admin');


router.post('/group/admin/deleteuser', userAuthenication.authenticate, adminController.deleteGroupUser)
router.get('/group/admin/getuserstoadd', userAuthenication.authenticate, adminController.getAddUsersToGroup);
router.post('/group/admin/addtogroup', userAuthenication.authenticate, adminController.postAddUsersToGroup);
router.post('/group/admin/makeadmin', userAuthenication.authenticate, adminController.postMakeAdmin);

module.exports=router;