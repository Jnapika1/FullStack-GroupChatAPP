const jwt = require('jsonwebtoken');
const User = require('../models/userdetails');
// const Chat = require('../models/chats');
require('dotenv').config();

module.exports = function initializeSocket(io) {
io.on('connection', (socket) => {
    // console.log('A user connected', socket.id);
    socket.on('joinGroup', data=>{
        // console.log('group joined', data);
        socket.join(data);
        // console.log(socket.rooms);
    })
    // console.log(socket.rooms);
    socket.on('newMessage', async(data)=>{

        const user = jwt.verify(data.token, process.env.TOKEN_KEY);
        const userFound = await User.findByPk(user.userId)
        // console.log(userFound.name);
        const username=userFound.name;

        if(!data.fileUrl){
            io.to(JSON.parse(data.groupid)).emit('message', {username: username, message:data.message, groupId: data.groupid, isUrl: false});
        }
        else{
            if(data.message){
            io.to(JSON.parse(data.groupid)).emit('message', {username: username, message:data.message, groupId: data.groupid, isUrl: false});
            }
            
            io.to(JSON.parse(data.groupid)).emit('message', {username: username, message:data.fileUrl, groupId: data.groupid, isUrl: true});
            
        }

        
        // console.log('sending message to users', data.groupid, data.message);
    })
    // Handle events on the socket
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
});
}

