// models/TaskCategory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Task = require('./Task');
const Category = require('./Category');

const TaskCategory = sequelize.define('TaskCategory', {
  task_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'tasks',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'categories',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'task_categories',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Task.belongsToMany(Category, { 
  through: TaskCategory, 
  foreignKey: 'task_id',
  otherKey: 'category_id',
  as: 'categories'
});

Category.belongsToMany(Task, { 
  through: TaskCategory, 
  foreignKey: 'category_id',
  otherKey: 'task_id',
  as: 'tasks'
});

module.exports = TaskCategory;