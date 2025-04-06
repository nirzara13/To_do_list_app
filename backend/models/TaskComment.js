

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
      notEmpty: { msg: "Le contenu du commentaire ne peut pas être vide" },
      len: {
        args: [1, 500],
        msg: "Le commentaire doit faire entre 1 et 500 caractères"
      }
    }
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tasks',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'task_comments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updatedAt'  // Notez le "A" majuscule ici, pour correspondre à votre table
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

// Méthodes statiques pour la logique d'accès aux données
TaskComment.deleteByTaskId = async function(taskId, transaction) {
  return sequelize.query(
    `DELETE FROM task_comments WHERE task_id = ?`,
    {
      replacements: [taskId],
      type: sequelize.QueryTypes.DELETE,
      transaction
    }
  );
};


// models/TaskComment.js

// Ajoutez cette méthode statique
TaskComment.getWithUserById = async function(commentId, transaction) {
    return TaskComment.findByPk(commentId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ],
      transaction
    });
  };


TaskComment.getWithUser = async function(taskId) {
  return TaskComment.findAll({
    where: { task_id: taskId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email']
      }
    ],
    order: [['created_at', 'DESC']]
  });
};

module.exports = TaskComment;

















  