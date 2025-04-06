


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

// Méthodes statiques pour la logique d'accès aux données
Task.getTaskCategories = async function(taskId, transaction) {
  return sequelize.query(
    `SELECT c.*, tc.display_order 
     FROM categories c
     JOIN task_categories tc ON c.id = tc.category_id
     WHERE tc.task_id = ?
     ORDER BY tc.display_order`,
    {
      replacements: [taskId],
      type: sequelize.QueryTypes.SELECT,
      transaction
    }
  );
};

Task.deleteTaskCategories = async function(taskId, transaction) {
  return sequelize.query(
    `DELETE FROM task_categories WHERE task_id = ?`,
    {
      replacements: [taskId],
      type: sequelize.QueryTypes.DELETE,
      transaction
    }
  );
};

Task.addTaskCategories = async function(taskId, categories, transaction) {
  const promises = categories.map((categoryId, index) => {
    return sequelize.query(
      `INSERT INTO task_categories (task_id, category_id, display_order, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      {
        replacements: [taskId, categoryId, index + 1],
        type: sequelize.QueryTypes.INSERT,
        transaction
      }
    );
  });
  
  return Promise.all(promises);
};

Task.getTasksWithCategory = async function(categoryId, userId) {
  return sequelize.query(
    `SELECT DISTINCT t.id
     FROM tasks t
     JOIN task_categories tc ON t.id = tc.task_id
     WHERE tc.category_id = ? AND t.user_id = ?`,
    {
      replacements: [categoryId, userId],
      type: sequelize.QueryTypes.SELECT
    }
  );
};

module.exports = Task;