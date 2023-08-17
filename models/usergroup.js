const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const UserGroup = sequelize.define('usergroup', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
    admin: {
      type: Sequelize.BOOLEAN
    }
})

module.exports = UserGroup;