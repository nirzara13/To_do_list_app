// models/List.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const List = sequelize.define('List', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

List.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(List, { foreignKey: 'user_id' });

module.exports = List;