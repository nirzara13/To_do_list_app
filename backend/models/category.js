const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true, // Ajout de cette contrainte
    validate: {
      notEmpty: true
    }
  },
  color: {
    type: DataTypes.STRING(7),
    defaultValue: '#808080',
    validate: {
      is: /^#[0-9A-F]{6}$/i
    }
  }
}, {
  timestamps: true
});

module.exports = Category;
