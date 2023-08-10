const Sequelize = require('sequelize');

const sequelize= new Sequelize("groupchat", "root", "Stark@1903", {
    dialect: 'mysql',
    host: "localhost"
});

module.exports = sequelize;