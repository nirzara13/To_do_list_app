
// models/TaskCategory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskCategory = sequelize.define('TaskCategory', {
  task_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'tasks',
      key: 'id'
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  display_order: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'task_categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = TaskCategory;