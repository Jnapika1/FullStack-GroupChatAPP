const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ArchivedChat = sequelize.define('archivedchat', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
    message: Sequelize.STRING,
    username: Sequelize.STRING,
    isUrl : Sequelize.BOOLEAN,
    userId : Sequelize.INTEGER,
    groupId: Sequelize.INTEGER
})

module.exports = ArchivedChat;