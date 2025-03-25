// models/associations.js
const Task = require('./Task');
const Category = require('./Category');
const TaskCategory = require('./TaskCategory');

// Association many-to-many entre Task et Category
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

module.exports = {
  Task,
  Category,
  TaskCategory
};