const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const userRoutes = require('./routers/userRoutes');
const cors = require('cors');

const User = require('./models/userdetails');
const Chats = require('./models/chats');

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

sequelize.sync()
.then(result=>{
    // console.log(result);
    app.listen(3000);
    
}).catch(err=>{
    console.log(err);
})