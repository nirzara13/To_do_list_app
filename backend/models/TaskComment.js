// models/TaskComment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Task = require('./Task');
const User = require('./User');

const TaskComment = sequelize.define('TaskComment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Le contenu du commentaire ne peut pas être vide" }
    }
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Task,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'task_comments',
  timestamps: true,
  createdAt: 'created_at'
});

// Associations
TaskComment.belongsTo(Task, { 
  foreignKey: 'task_id', 
  as: 'task' 
});

TaskComment.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'user' 
});

Task.hasMany(TaskComment, { 
  foreignKey: 'task_id', 
  as: 'comments' 
});

User.hasMany(TaskComment, { 
  foreignKey: 'user_id', 
  as: 'comments' 
});

module.exports = TaskComment;