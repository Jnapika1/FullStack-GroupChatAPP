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
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));

app.use(cors({
    origin: "*",
    // methods: ['GET', 'POST']
}));

app.use(userRoutes);

app.use((req, res)=>{
    console.log('url', req.url);
	// res.setHeader("Content-Security-Policy-Report-Only", "default-src 'self' script-src 'self'; img-src 'self'; style-src 'self';base-uri 'self';form-action 'self'");
    res.sendFile(path.join(__dirname, `views/${req.url}`));
})

User.hasMany(Chats);
Chats.belongsTo(User);

Group.hasMany(Chats);
Chats.belongsTo(Group);

User.belongsToMany(Group, {through: UserGroup});
User.hasMany(UserGroup);
Group.belongsToMany(User, {through: UserGroup});
Group.hasMany(UserGroup);

sequelize.sync()
.then(result=>{
    // console.log(result);
    app.listen(3000);
    
}).catch(err=>{
    console.log(err);
})