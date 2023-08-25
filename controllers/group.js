const Group = require('../models/groups');
const User = require('../models/userdetails');
const Chat = require('../models/chats');
const { Op } = require('sequelize');
const UserGroup = require('../models/usergroup');
const S3Services = require('../services/s3services');

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

exports.getGroupUsers = async(req, res)=>{
    try{
        const groupId=req.query.groupid;
        const group = await Group.findOne({
            where: {id: groupId },
            include: User
          });
        res.status(201).json({users: group.users, success: true});
    }
    catch(err){
        // console.log(err);
        res.status(500).json({success: false, error:err});
    }
}

exports.createGroup = async(req, res)=>{
    try{
        let groupname = req.body.groupname;
        let users= req.body.users;
        let admin=req.user;
        let adminName =admin.name;
        const group = await Group.create({
            name:groupname,
            createdby: adminName
        })
        await users.forEach(async(user) => {
            let userFound = await User.findByPk(user)
            // console.log(user);
            // console.log(admin);
            if(JSON.stringify(admin) === JSON.stringify(userFound)){
                // let userFound = await User.findByPk(user)
                // console.log("admin user =>", userFound);
                group.addUser(userFound, {through:{admin:true}});
            }
            else{
                // let userFound = await User.findByPk(user)
                // console.log('not admin=>',userFound);
                group.addUser(userFound, {through:{admin:false}});
            } 
        });
        res.status(201).json({success:true, message: "Group created Successfully!"})
    }
    catch(err){
        res.status(500).json({success:false, err:err});
    }
}

exports.getUserGroups = async(req, res)=>{
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
        const fileUrl = req.body.fileUrl;
        const filetype = req.body.filetype;
        const userId = req.user.id;
        // console.log(req.body.message);
        const username = (await User.findByPk(userId)).name;

        if(!req.body.fileUrl){
            await Chat.create({
                message:message,
                username: username,
                userId: userId,
                groupId: groupId,
                isUrl : false
            })
        }
        else{
            if(req.body.message){
                await Chat.create({
                    message:message,
                    username: username,
                    userId: userId,
                    groupId: groupId,
                    isUrl : false
                })
                
            }
            
            const date = new Date().toISOString();
            const filename = `File${date}`

            const filebuffer = Buffer.from(fileUrl.split(',')[1], 'base64');
            const S3fileurl = await S3Services.uploadToS3(filebuffer, filename, filetype)

            await Chat.create({
                message: S3fileurl,
                username: username,
                userId: userId,
                groupId: groupId,
                isUrl : true
            })
        
            
        }
        res.status(201).json({success: true, message: "chat stored successfully!"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false, error: err});
    }
}