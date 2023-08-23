const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const userRoutes = require('./routers/userRoutes');
const cors = require('cors');
const socketIo = require('socket.io');


const User = require('./models/userdetails');
const Chats = require('./models/chats');
const Group = require('./models/groups');
const UserGroup = require('./models/usergroup');

const app = express();

const server = http.createServer(app); // Create an http server
const io = socketIo(server);

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'views')));

app.use(cors({
    origin: "*",
    // methods: ['GET', 'POST']
}));

app.use(userRoutes);

User.hasMany(Chats);
Chats.belongsTo(User);

Group.hasMany(Chats);
Chats.belongsTo(Group);

User.belongsToMany(Group, {through: UserGroup});
User.hasMany(UserGroup);
Group.belongsToMany(User, {through: UserGroup});
Group.hasMany(UserGroup);

const initializeSocket = require('./sockets/socket');
initializeSocket(io);

sequelize.sync()
.then(result=>{ 
    // console.log(result);
    server.listen(3000);
    // const server = app.listen(3000);
    // const io=socketIo(server);
    // const groupNamespace = io.of('/group');

    // io.on('connection', (socket) => {
    //     // console.log('A user connected', socket.id);
    //     socket.on('joinGroup', data=>{
    //         // console.log('group joined', data);
    //         socket.join(data);
    //         // console.log(socket.rooms);
    //     })
    //     // console.log(socket.rooms);
    //     socket.on('newMessage', data=>{
    //         io.to(JSON.parse(data.groupid)).emit('message', data.message);
    //         // console.log('sending message to users', data.groupid, data.message);
    //     })
    //     // Handle events on the socket
    //     socket.on('disconnect', () => {
    //       console.log('A user disconnected');
    //     });
    // });
    
    
}).catch(err=>{
    console.log(err);
})

// module.exports={io};