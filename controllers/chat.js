const { where, Op } = require('sequelize');
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
        // console.log(err);
        res.status(500).json({success:false, error:err});
    }
}

exports.getChats = async(req, res)=>{
    try{
        const lastChatId = req.query.lastchatid;
        const chats = await Chat.findAll({where:{id:{[Op.gt]:lastChatId}}});
        // let messages=[];
        // chats.forEach(chat => {
        //     messages.push(chat.message);
        // });
        console.log(chats);
        res.status(201).json({success: true, allChats: chats})
    }
    catch(err){
        // console.log(err);
        res.status(500).json({success:false, error:err});
    }
}