const jwt = require('jsonwebtoken');
const User = require('../models/userdetails');
require('dotenv').config();

const authenticate = (req, res, next)=>{
    // console.log(req);
    try{
        const token = req.header('Authorization');
        // console.log(token);
        const user = jwt.verify(token, process.env.TOKEN_KEY);
        // console.log('userId=>', user.userId);
        User.findByPk(user.userId).then(user=>{
            req.user = user;
            // console.log(req.user);
            next();
        })
    }
    catch(err){
        res.status(401).json({success: false});
    }
}

module.exports={authenticate};