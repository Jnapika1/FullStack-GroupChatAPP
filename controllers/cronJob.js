const Chat = require('../models/chats');
const ArchivedChat = require('../models/archivedChats');

const cron = require('cron');
const { Op } = require('sequelize');

const archiveOldChats = new cron.CronJob('0 0 * * *', async()=>{
    try{
        const today = new Date();
        const oldDate = new Date(today);
        oldDate.setDate(today.getDate()-1);
        // console.log(oldDate.setMinutes(oldDate.getMinutes()-1));

        // GETTING CHATS OLDER THAN ONE DAY
        const oldChats = await Chat.findAll({
            where :{
                createdAt:{
                    [Op.lt]:oldDate
                }
            }
        })

        // MOVE THE OLD CHATS TO ARCHIVE TABLE
        oldChats.forEach(async(oldchat) => {
            await ArchivedChat.create({
                message: oldchat.message,
                username: oldchat.username,
                isUrl : oldchat.isUrl,
                userId: oldchat.userId,
                groupId: oldchat.groupId
            })
            await oldchat.destroy();
        });  

    }
    catch(err){
        console.log(err);
    }
})

archiveOldChats.start();

module.exports = archiveOldChats;