
const User = require('./User');
const Task = require('./Task');
const Category = require('./Category');
const TaskComment = require('./TaskComment');

// Relations
User.hasMany(Task, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'user_id' });

Task.belongsToMany(Category, { through: 'task_categories', foreignKey: 'task_id' });
Category.belongsToMany(Task, { through: 'task_categories', foreignKey: 'category_id' });

User.hasMany(TaskComment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
TaskComment.belongsTo(User, { foreignKey: 'user_id' });

Task.hasMany(TaskComment, { foreignKey: 'task_id', onDelete: 'CASCADE' });
TaskComment.belongsTo(Task, { foreignKey: 'task_id' });

module.exports = { User, Task, Category, TaskComment };
