// const sequelize = require('../config/database'); // Assurez-vous que le chemin est correct
// const Utilisateur = require('./Utilisateur');
// const Sondage = require('./Sondage');
// const Question = require('./Question');
// const Reponse = require('./Reponse');

// // Définir les relations entre les modèles
// Sondage.hasMany(Question, { foreignKey: 'sondage_id' });
// Question.belongsTo(Sondage, { foreignKey: 'sondage_id' });

// Question.hasMany(Reponse, { foreignKey: 'question_id' });
// Reponse.belongsTo(Question, { foreignKey: 'question_id' });

// Utilisateur.hasMany(Reponse, { foreignKey: 'utilisateur_id' });
// Reponse.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

// sequelize.sync(); // Synchroniser les modèles avec la base de données

// module.exports = {
//   Utilisateur,
//   Sondage,
//   Question,
//   Reponse
// };


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
