const Chat = require('../models/chats');
const User = require('../models/userdetails');

exports.postUserChats = async(req, res)=>{
    try{
        const userId = req.user.userId;
        const date = new Date();
        const message = req.body.message;
        await Chat.create({
            message:message,
            date: date,
            userId: userId
        })
        res.status(201).json({success: true, message: "chat stored successfully!"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false, error:err});
    }
}