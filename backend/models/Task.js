// models/Task.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const List = require('./List');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: "Le titre est obligatoire" }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('todo', 'in_progress', 'completed'),
    defaultValue: 'todo'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  list_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: List,
      key: 'id'
    }
  }
}, {
  tableName: 'tasks',
  timestamps: true
});

// Relation avec User
Task.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Task, { foreignKey: 'user_id', as: 'tasks' });

// Relation avec List
Task.belongsTo(List, { foreignKey: 'list_id' });
List.hasMany(Task, { foreignKey: 'list_id' });

// Ne définissez PAS l'association avec Category ici
// Supprimez ou commentez toutes les lignes avec Task.belongsToMany

module.exports = Task;