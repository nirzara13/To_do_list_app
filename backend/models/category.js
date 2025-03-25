// models/Category.js
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
    unique: true,
    validate: {
      notEmpty: { msg: "Le nom de la catégorie ne peut pas être vide" }
    }
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
    defaultValue: '#808080',
    validate: {
      is: /^#[0-9A-F]{6}$/i
    }
  }
}, {
  tableName: 'categories',
  timestamps: true
});

// Ne définissez PAS d'associations ici
// Supprimez ou commentez toutes les lignes avec Category.belongsToMany

module.exports = Category;