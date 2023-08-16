const Group = require('../models/groups');
const User = require('../models/userdetails');
const Chat = require('../models/chats');
const { Op } = require('sequelize');

exports.getUsers = async(req, res)=>{
    try{
        const users =  await User.findAll({attributes: ['id', 'name', 'email']});
    // console.log(users);
        res.status(201).json({users: users, success: true})
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false, error: err});
    }
}

exports.createGroup = async(req, res)=>{
    try{
        let groupname = req.body.groupname;
    let users= req.body.users;
    const group = await Group.create({
        name:groupname
    })
    await users.forEach(async(user) => {
        let userFound = await User.findByPk(user)
        // console.log(userFound);
        group.addUser(userFound);
    });
    res.status(201).json({success:true, message: "Group created Successfully!"})
    }
    catch(err){
        res.status(500).json({success:false, err:err});
    }
}

exports.getUserGroup = async(req, res)=>{
    try{
        const user =await User.findByPk(req.user.id);
    const groups = await user.getGroups({attributes: ['id', 'name']});
    // console.log(groups);
    res.status(201).json({success:true, groups: groups});
    }
    catch(err){
        res.status(500).json({success: false, error: err});
    }  
}

exports.getGroupChats = async(req, res)=>{
    try{
        const groupId = req.query.groupid;
        const lastChatId = req.query.lastchatid;
        const chats = await Chat.findAll({where:
            {
            [Op.and]:
            [
                {groupId:groupId},
                {
                    id:{
                    [Op.gt]:lastChatId
                    }
                }
            ]   
            }
        });
        // console.log(chats);
        res.status(201).json({success: true, groupChats: chats});
    }
    catch(err){
        res.status(500).json({success: false, error: err});
    }
}

exports.postGroupChats = async(req, res)=>{
    // console.log(req);
    try{
        const groupId = req.body.groupid;
        const message = req.body.message;
        const userId = req.user.id;
        const date = new Date();
    
    await Chat.create({
        message:message,
        date: date,
        userId: userId,
        groupId: groupId
    })
    res.status(201).json({success: true, message: "chat stored successfully!"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false, error: err});
    }
}