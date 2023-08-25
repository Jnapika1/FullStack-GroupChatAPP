const Group = require('../models/groups');
const User = require('../models/userdetails');
// const Chat = require('../models/chats');
const { Op } = require('sequelize');
const UserGroup = require('../models/usergroup');
// const S3Services = require('../services/s3services');

exports.deleteGroupUser = async(req, res)=>{
    try{
        let userId = req.body.userId;
        let groupId = req.body.groupId;
        let reqUser = await UserGroup.findOne({where:{userId:req.user.id, groupId:groupId}});
        let user = await UserGroup.findOne({where:{userId: userId, groupId: groupId}});
        // console.log(reqUser.admin);
        if(reqUser.admin){
            await UserGroup.destroy({where:{userId: userId, groupId: groupId}});
            let groupusers = await UserGroup.findAll({where:{groupId:groupId}});
            if(groupusers.length===0){
                await Group.destroy({where:{id: groupId}});
                res.status(202).json({success: true, message: "Group has been deleted!"})
            }
            else{
                if(reqUser.userId===user.userId){
                    // console.log(groupusers[0].admin);
                    groupusers[0].update({admin:true});
                    res.status(203).json({success: true, message: "You have been removed from group"});
                }
                else{
                    res.status(201).json({success:true, message:"User has been removed from group"});
                }
            }
        }
        else{
            res.status(401).json({success: false, error: "You are not an admin. Please contact admin to remove user!"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false, error: err});
    }
}

exports.getAddUsersToGroup=async(req, res)=>{
    try{
        const groupId = req.query.groupid;
        let reqUser = await UserGroup.findOne({where:{userId:req.user.id, groupId:groupId}});
        if(reqUser.admin){
            let groupUsersId=[]
            const groupUsers = await UserGroup.findAll({
                attributes: ['userId'],
                where:{
                    groupId: groupId
                }
            })
            groupUsers.forEach(groupUser=>{
                groupUsersId.push(groupUser.userId);
            })
            // console.log(groupUsersId);
            const users = await User.findAll({
                where: {
                id: {
                    [Op.notIn]: groupUsersId
                },
            }
            });
            if(users.length===0){
                res.status(202).json({success: true, message: "No users present outside the group!"});
            }
            // console.log(users);
            else{
                res.status(201).json({success:true, users: users});
            }
            
        }
        else{
            res.status(401).json({success: true, error: "You are not an admin. Please contact admin to add user!"})
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false, error: err});
    }
    
}

exports.postAddUsersToGroup = async(req, res)=>{
    try{
        let reqUser = await UserGroup.findOne({where:{userId:req.user.id, groupId:req.body.groupid}});
        if(reqUser.admin){
            let group = await Group.findByPk(req.body.groupid);
            let userIds = req.body.users;
            userIds.forEach(async(userId)=>{
                let user = await User.findByPk(userId);
                group.addUser(user);
            })
            res.status(201).json({success:true, message: "User added to group Successfully!"})
        }
        else{
            res.status(401).json({success: false, error: "You are not an admin. Please contact admin to add users!"});
        }
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false, error: err});
    }
}

exports.postMakeAdmin = async(req, res)=>{
    try{
        let reqUser = await UserGroup.findOne({where:{userId:req.user.id, groupId:req.body.groupId}});
        if(reqUser.admin)
        {
        let user = await UserGroup.findOne({where: {userId: req.body.userId, groupId: req.body.groupId}})
        await user.update({admin: true});
        res.status(201).json({success: true, message: "User has been made admin"});
        }
        else{
            res.status(401).json({success:false, error: "You are not an admin. Please contact admin to make other users admin!"})
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({success: false, error: err});
    }

}