const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const userRoutes = require('./routers/userRoutes');
const cors = require('cors');

const User = require('./models/userdetails');
const Chats = require('./models/chats');
const Group = require('./models/groups');
const UserGroup = require('./models/usergroup');

const app = express();

app.use(bodyParser.json({ extended: false }));
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
Group.belongsToMany(User, {through: UserGroup});

sequelize.sync()
.then(result=>{
    // console.log(result);
    app.listen(3000);
    
}).catch(err=>{
    console.log(err);
})