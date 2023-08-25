const Sequelize = require('sequelize');

const sequelize= new Sequelize("groupchat", "root", "Stark@1903", {
    dialect: 'mysql',
    host: "localhost",
    timezone: '+00:00'
});

module.exports = sequelize;