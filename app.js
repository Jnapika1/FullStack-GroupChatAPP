const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const userRoutes = require('./routers/userRoutes');
const cors = require('cors');

const app = express();

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));
app.use(cors());
app.use(userRoutes);

sequelize.sync()
.then(result=>{
    // console.log(result);
    app.listen(3000);
    
}).catch(err=>{
    console.log(err);
})