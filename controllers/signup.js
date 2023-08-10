const User = require('../models/userdetails');
const bcrypt = require('bcrypt');

exports.postSignupUser = async (req, res, next)=>{
    console.log(req);
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;

    let user = User.findAll({where: {name: name}});
    let saltrounds =10;

    try{
        if(user[0]!=null){
            res.status(409).json({success: false, message: 'Error: User already exists!!'})
        }
        else{
        bcrypt.hash(password, saltrounds, async(err, hash)=>{
            let user =await User.create({
                name: name,
                email: email,
                phone: phone,
                password: hash,
              })
              res.status(201).json({success: true, message: 'Successfully signed up!!'});
        })
    }
    
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({success: false, message:err});
    }
}

