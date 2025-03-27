



// const Task = require('../models/Task');
// const Category = require('../models/Category');
// const TaskCategory = require('../models/TaskCategory');
// const TaskComment = require('../models/TaskComment');
// const List = require('../models/List');
// const sequelize = require('../config/database');

// // Récupérer une tâche par son ID
// exports.getTaskById = async (req, res) => {
//   try {
//     const taskId = parseInt(req.params.id);
//     if (isNaN(taskId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'ID de tâche invalide'
//       });
//     }

//     // Utiliser une requête plus simple d'abord pour éviter les erreurs liées aux associations
//     const task = await Task.findOne({
//       where: {
//         id: taskId,
//         user_id: req.user.id
//       },
//       include: [
//         // Inclure seulement la liste pour l'instant
//         {
//           model: List
//         }
//       ]
//     });

//     if (!task) {
//       return res.status(404).json({
//         success: false,
//         message: 'Tâche non trouvée'
//       });
//     }

//     // Récupérer les catégories séparément pour éviter les problèmes d'association
//     const categories = await sequelize.query(
//       `SELECT c.*, tc.display_order 
//        FROM categories c
//        JOIN task_categories tc ON c.id = tc.category_id
//        WHERE tc.task_id = ?
//        ORDER BY tc.display_order`,
//       {
//         replacements: [taskId],
//         type: sequelize.QueryTypes.SELECT
//       }
//     );

//     // Ajouter les catégories manuellement à l'objet tâche
//     const taskWithCategories = task.toJSON();
//     taskWithCategories.categories = categories;

//     res.json({
//       success: true,
//       task: taskWithCategories
//     });
//   } catch (error) {
//     console.error('Erreur de récupération de tâche:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Impossible de récupérer la tâche',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Récupérer toutes les tâches
// // Récupérer toutes les tâches
// exports.getAllTasks = async (req, res) => {
//   try {
//     // Ajouter le support pour le filtrage par catégorie
//     const { sort, categoryId } = req.query;
//     const order = [];

//     // Gestion des différents tris
//     switch(sort) {
//       case 'status':
//         order.push(['status', 'ASC']);
//         break;
//       case 'priority':
//         order.push(['priority', 'ASC']);
//         break;
//       case 'due_date':
//         order.push(['due_date', 'ASC']);
//         break;
//       default:
//         order.push(['createdAt', 'DESC']);
//     }

//     // Récupérer les tâches sans les catégories d'abord
//     let tasks = await Task.findAll({
//       where: { user_id: req.user.id },
//       include: [
//         {
//           model: List
//         }
//       ],
//       order
//     });

//     // Filtrer par catégorie si le paramètre est présent
//     if (categoryId) {
//       console.log(`Filtrage des tâches par catégorie: ${categoryId}`);
      
//       // Récupérer les IDs des tâches qui ont cette catégorie
//       const tasksWithCategory = await sequelize.query(
//         `SELECT DISTINCT t.id
//          FROM tasks t
//          JOIN task_categories tc ON t.id = tc.task_id
//          WHERE tc.category_id = ? AND t.user_id = ?`,
//         {
//           replacements: [categoryId, req.user.id],
//           type: sequelize.QueryTypes.SELECT
//         }
//       );
      
//       const taskIds = tasksWithCategory.map(t => t.id);
//       console.log(`Tâches trouvées avec la catégorie ${categoryId}: ${taskIds.length}`);
      
//       // Filtrer les tâches pour ne garder que celles avec la catégorie spécifiée
//       tasks = tasks.filter(task => taskIds.includes(task.id));
//     }

//     // Pour chaque tâche, récupérer ses catégories
//     const formattedTasks = await Promise.all(tasks.map(async (task) => {
//       const taskObj = task.toJSON();
      
//       // Récupérer les catégories pour cette tâche
//       const taskCategories = await sequelize.query(
//         `SELECT c.*, tc.display_order 
//          FROM categories c
//          JOIN task_categories tc ON c.id = tc.category_id
//          WHERE tc.task_id = ?
//          ORDER BY tc.display_order`,
//         {
//           replacements: [task.id],
//           type: sequelize.QueryTypes.SELECT
//         }
//       );
      
//       // Conversion explicite des IDs de catégories
//       taskObj.categories = taskCategories.map(cat => ({
//         ...cat,
//         id: Number(cat.id)
//       }));
      
//       return taskObj;
//     }));

//     res.json({
//       success: true,
//       tasks: formattedTasks
//     });
//   } catch (error) {
//     console.error('Erreur de récupération des tâches:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Impossible de récupérer les tâches'
//     });
//   }
// };
// // Créer une nouvelle tâche
// exports.createTask = async (req, res) => {
//   const transaction = await sequelize.transaction();
  
//   try {
//     const {
//       title,
//       description,
//       due_date,
//       priority,
//       status,
//       categories = [], // Tableau de catégories avec valeur par défaut
//       list_id
//     } = req.body;

//     // Validation des données de base
//     if (!title || title.trim() === '') {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: 'Le titre est obligatoire'
//       });
//     }

//     // Validation de la date
//     let dueDate = null;
//     if (due_date) {
//       dueDate = new Date(due_date);
//       if (isNaN(dueDate.getTime())) {
//         await transaction.rollback();
//         return res.status(400).json({
//           success: false,
//           message: 'Format de date invalide'
//         });
//       }
//     }

//     // Validation de la priorité
//     const validPriorities = ['low', 'medium', 'high'];
//     const taskPriority = priority || 'medium';
//     if (!validPriorities.includes(taskPriority)) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: 'Priorité invalide'
//       });
//     }

//     // Validation du statut
//     const validStatuses = ['todo', 'in_progress', 'completed'];
//     const taskStatus = status || 'todo';
//     if (!validStatuses.includes(taskStatus)) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: 'Statut invalide'
//       });
//     }

//     // Conversion de list_id
//     const listIdValue = list_id ? parseInt(list_id) : null;

//     // Création de la tâche
//     const newTask = await Task.create({
//       title,
//       description: description || null,
//       due_date: dueDate,
//       priority: taskPriority,
//       status: taskStatus,
//       user_id: req.user.id,
//       list_id: listIdValue
//     }, { transaction });

//     // Gestion des catégories - utiliser une requête SQL directe au lieu de TaskCategory.bulkCreate
//     if (categories.length > 0) {
//       for (const [index, categoryId] of categories.entries()) {
//         await sequelize.query(
//           `INSERT INTO task_categories (task_id, category_id, display_order, created_at, updated_at)
//            VALUES (?, ?, ?, NOW(), NOW())`,
//           {
//             replacements: [newTask.id, categoryId, index + 1],
//             type: sequelize.QueryTypes.INSERT,
//             transaction
//           }
//         );
//       }
//     }

//     await transaction.commit();

//     // Récupérer la tâche complète
//     const taskResult = await Task.findByPk(newTask.id, {
//       include: [
//         { model: List }
//       ]
//     });

//     // Récupérer les catégories séparément
//     const taskCategories = await sequelize.query(
//       `SELECT c.*, tc.display_order 
//        FROM categories c
//        JOIN task_categories tc ON c.id = tc.category_id
//        WHERE tc.task_id = ?
//        ORDER BY tc.display_order`,
//       {
//         replacements: [newTask.id],
//         type: sequelize.QueryTypes.SELECT
//       }
//     );

//     // Combiner le résultat
//     const fullTask = taskResult.toJSON();
//     fullTask.categories = taskCategories;

//     res.status(201).json({
//       success: true,
//       message: 'Tâche créée avec succès',
//       task: fullTask
//     });
    
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Erreur de création de tâche:', error);
//     res.status(400).json({
//       success: false,
//       message: 'Impossible de créer la tâche',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Mettre à jour une tâche
// exports.updateTask = async (req, res) => {
//   const transaction = await sequelize.transaction();
  
//   try {
//     const {
//       title,
//       description,
//       due_date,
//       priority,
//       status,
//       categories = [], // Tableau de catégories
//       list_id
//     } = req.body;

//     const taskId = parseInt(req.params.id);
//     if (isNaN(taskId)) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: 'ID de tâche invalide'
//       });
//     }

//     // Rechercher la tâche existante
//     const task = await Task.findOne({
//       where: {
//         id: taskId,
//         user_id: req.user.id
//       },
//       transaction
//     });

//     if (!task) {
//       await transaction.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'Tâche non trouvée'
//       });
//     }

//     // Validation de la date
//     let dueDate = task.due_date;
//     if (due_date) {
//       dueDate = new Date(due_date);
//       if (isNaN(dueDate.getTime())) {
//         await transaction.rollback();
//         return res.status(400).json({
//           success: false,
//           message: 'Format de date invalide'
//         });
//       }
//     }

//     // Validation de la priorité
//     const validPriorities = ['low', 'medium', 'high'];
//     const taskPriority = priority || task.priority;
//     if (!validPriorities.includes(taskPriority)) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: 'Priorité invalide'
//       });
//     }

//     // Validation du statut
//     const validStatuses = ['todo', 'in_progress', 'completed'];
//     const taskStatus = status || task.status;
//     if (!validStatuses.includes(taskStatus)) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: 'Statut invalide'
//       });
//     }

//     // Conversion de list_id
//     const listIdValue = list_id ? parseInt(list_id) : task.list_id;

//     // Mise à jour de la tâche
//     await task.update({
//       title: title || task.title,
//       description: description !== undefined ? description : task.description,
//       due_date: dueDate,
//       priority: taskPriority,
//       status: taskStatus,
//       list_id: listIdValue
//     }, { transaction });

//     // Mise à jour des catégories - utiliser une requête SQL directe
//     await sequelize.query(
//       `DELETE FROM task_categories WHERE task_id = ?`,
//       {
//         replacements: [task.id],
//         type: sequelize.QueryTypes.DELETE,
//         transaction
//       }
//     );

//     if (categories.length > 0) {
//       for (const [index, categoryId] of categories.entries()) {
//         await sequelize.query(
//           `INSERT INTO task_categories (task_id, category_id, display_order, created_at, updated_at)
//            VALUES (?, ?, ?, NOW(), NOW())`,
//           {
//             replacements: [task.id, categoryId, index + 1],
//             type: sequelize.QueryTypes.INSERT,
//             transaction
//           }
//         );
//       }
//     }

//     await transaction.commit();

//     // Récupérer la tâche mise à jour
//     const taskResult = await Task.findByPk(task.id, {
//       include: [
//         { model: List }
//       ]
//     });

//     // Récupérer les catégories séparément
//     const taskCategories = await sequelize.query(
//       `SELECT c.*, tc.display_order 
//        FROM categories c
//        JOIN task_categories tc ON c.id = tc.category_id
//        WHERE tc.task_id = ?
//        ORDER BY tc.display_order`,
//       {
//         replacements: [task.id],
//         type: sequelize.QueryTypes.SELECT
//       }
//     );

//     // Combiner le résultat
//     const updatedTask = taskResult.toJSON();
//     updatedTask.categories = taskCategories;

//     res.json({
//       success: true,
//       message: 'Tâche mise à jour avec succès',
//       task: updatedTask
//     });
    
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Erreur de mise à jour de tâche:', error);
//     res.status(400).json({
//       success: false,
//       message: 'Impossible de mettre à jour la tâche',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Supprimer une tâche
// exports.deleteTask = async (req, res) => {
//   const transaction = await sequelize.transaction();
  
//   try {
//     const taskId = parseInt(req.params.id);
//     if (isNaN(taskId)) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: 'ID de tâche invalide'
//       });
//     }

//     // Rechercher la tâche
//     const task = await Task.findOne({
//       where: {
//         id: taskId,
//         user_id: req.user.id
//       },
//       transaction
//     });

//     if (!task) {
//       await transaction.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'Tâche non trouvée'
//       });
//     }

//     // Supprimer les commentaires associés
//     await TaskComment.destroy({
//       where: { task_id: taskId },
//       transaction
//     });

//     // Supprimer les associations de catégories - utiliser une requête SQL directe
//     await sequelize.query(
//       `DELETE FROM task_categories WHERE task_id = ?`,
//       {
//         replacements: [taskId],
//         type: sequelize.QueryTypes.DELETE,
//         transaction
//       }
//     );

//     // Supprimer la tâche
//     await task.destroy({ transaction });

//     await transaction.commit();

//     res.json({
//       success: true,
//       message: 'Tâche supprimée avec succès'
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Erreur de suppression de tâche:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Impossible de supprimer la tâche',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Ajouter des catégories à une tâche
// exports.addCategoriesToTask = async (req, res) => {
//   const transaction = await sequelize.transaction();
  
//   try {
//     const taskId = parseInt(req.params.taskId);
//     const { categoryIds } = req.body; // Un tableau d'IDs de catégories
    
//     if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: 'Veuillez fournir un tableau non vide d\'IDs de catégories'
//       });
//     }
    
//     // Vérifier si la tâche existe et appartient à l'utilisateur
//     const task = await Task.findOne({
//       where: {
//         id: taskId,
//         user_id: req.user.id
//       },
//       transaction
//     });
    
//     if (!task) {
//       await transaction.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'Tâche non trouvée'
//       });
//     }
    
//     // Créer les associations - utiliser des requêtes SQL directes
//     for (const [index, categoryId] of categoryIds.entries()) {
//       await sequelize.query(
//         `INSERT INTO task_categories (task_id, category_id, display_order, created_at, updated_at)
//          VALUES (?, ?, ?, NOW(), NOW())
//          ON DUPLICATE KEY UPDATE display_order = VALUES(display_order), updated_at = NOW()`,
//         {
//           replacements: [taskId, categoryId, index + 1],
//           type: sequelize.QueryTypes.INSERT,
//           transaction
//         }
//       );
//     }
    
//     await transaction.commit();
    
//     // Récupérer la tâche avec ses catégories
//     const taskResult = await Task.findByPk(taskId, {
//       include: [
//         { model: List }
//       ]
//     });
    
//     // Récupérer les catégories séparément
//     const taskCategories = await sequelize.query(
//       `SELECT c.*, tc.display_order 
//        FROM categories c
//        JOIN task_categories tc ON c.id = tc.category_id
//        WHERE tc.task_id = ?
//        ORDER BY tc.display_order`,
//       {
//         replacements: [taskId],
//         type: sequelize.QueryTypes.SELECT
//       }
//     );
    
//     // Combiner le résultat
//     const updatedTask = taskResult.toJSON();
//     updatedTask.categories = taskCategories;
    
//     res.json({
//       success: true,
//       message: 'Catégories ajoutées avec succès',
//       task: updatedTask
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Erreur lors de l\'ajout de catégories:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Impossible d\'ajouter les catégories',
//       error: error.message
//     });
//   }
// };













//Après 




const Task = require('../models/Task');
const Category = require('../models/Category');
const TaskCategory = require('../models/TaskCategory');
const TaskComment = require('../models/TaskComment');
const List = require('../models/List');
const sequelize = require('../config/database');

// Récupérer une tâche par son ID
exports.getTaskById = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de tâche invalide'
      });
    }

    // Utiliser une requête plus simple d'abord pour éviter les erreurs liées aux associations
    const task = await Task.findOne({
      where: {
        id: taskId,
        user_id: req.user.id
      },
      include: [
        // Inclure seulement la liste pour l'instant
        {
          model: List
        }
      ]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }

    // Récupérer les catégories séparément en utilisant la méthode du modèle
    const categories = await Task.getTaskCategories(taskId);

    // Ajouter les catégories manuellement à l'objet tâche
    const taskWithCategories = task.toJSON();
    taskWithCategories.categories = categories;

    res.json({
      success: true,
      task: taskWithCategories
    });
  } catch (error) {
    console.error('Erreur de récupération de tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Impossible de récupérer la tâche',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Récupérer toutes les tâches
exports.getAllTasks = async (req, res) => {
  try {
    // Ajouter le support pour le filtrage par catégorie
    const { sort, categoryId } = req.query;
    const order = [];

    // Gestion des différents tris
    switch(sort) {
      case 'status':
        order.push(['status', 'ASC']);
        break;
      case 'priority':
        order.push(['priority', 'ASC']);
        break;
      case 'due_date':
        order.push(['due_date', 'ASC']);
        break;
      default:
        order.push(['createdAt', 'DESC']);
    }

    // Récupérer les tâches sans les catégories d'abord
    let tasks = await Task.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: List
        }
      ],
      order
    });

    // Filtrer par catégorie si le paramètre est présent
    if (categoryId) {
      console.log(`Filtrage des tâches par catégorie: ${categoryId}`);
      
      // Récupérer les IDs des tâches qui ont cette catégorie en utilisant la méthode du modèle
      const tasksWithCategory = await Task.getTasksWithCategory(categoryId, req.user.id);
      
      const taskIds = tasksWithCategory.map(t => t.id);
      console.log(`Tâches trouvées avec la catégorie ${categoryId}: ${taskIds.length}`);
      
      // Filtrer les tâches pour ne garder que celles avec la catégorie spécifiée
      tasks = tasks.filter(task => taskIds.includes(task.id));
    }

    // Pour chaque tâche, récupérer ses catégories
    const formattedTasks = await Promise.all(tasks.map(async (task) => {
      const taskObj = task.toJSON();
      
      // Récupérer les catégories pour cette tâche en utilisant la méthode du modèle
      const taskCategories = await Task.getTaskCategories(task.id);
      
      // Conversion explicite des IDs de catégories
      taskObj.categories = taskCategories.map(cat => ({
        ...cat,
        id: Number(cat.id)
      }));
      
      return taskObj;
    }));

    res.json({
      success: true,
      tasks: formattedTasks
    });
  } catch (error) {
    console.error('Erreur de récupération des tâches:', error);
    res.status(500).json({
      success: false,
      message: 'Impossible de récupérer les tâches'
    });
  }
};

// Créer une nouvelle tâche
exports.createTask = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      title,
      description,
      due_date,
      priority,
      status,
      categories = [], // Tableau de catégories avec valeur par défaut
      list_id
    } = req.body;

    // Validation des données de base
    if (!title || title.trim() === '') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Le titre est obligatoire'
      });
    }

    // Validation de la date
    let dueDate = null;
    if (due_date) {
      dueDate = new Date(due_date);
      if (isNaN(dueDate.getTime())) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Format de date invalide'
        });
      }
    }

    // Validation de la priorité
    const validPriorities = ['low', 'medium', 'high'];
    const taskPriority = priority || 'medium';
    if (!validPriorities.includes(taskPriority)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Priorité invalide'
      });
    }

    // Validation du statut
    const validStatuses = ['todo', 'in_progress', 'completed'];
    const taskStatus = status || 'todo';
    if (!validStatuses.includes(taskStatus)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    // Conversion de list_id
    const listIdValue = list_id ? parseInt(list_id) : null;

    // Création de la tâche
    const newTask = await Task.create({
      title,
      description: description || null,
      due_date: dueDate,
      priority: taskPriority,
      status: taskStatus,
      user_id: req.user.id,
      list_id: listIdValue
    }, { transaction });

    // Gestion des catégories en utilisant la méthode du modèle
    if (categories.length > 0) {
      await Task.addTaskCategories(newTask.id, categories, transaction);
    }

    await transaction.commit();

    // Récupérer la tâche complète
    const taskResult = await Task.findByPk(newTask.id, {
      include: [
        { model: List }
      ]
    });

    // Récupérer les catégories séparément en utilisant la méthode du modèle
    const taskCategories = await Task.getTaskCategories(newTask.id);

    // Combiner le résultat
    const fullTask = taskResult.toJSON();
    fullTask.categories = taskCategories;

    res.status(201).json({
      success: true,
      message: 'Tâche créée avec succès',
      task: fullTask
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Erreur de création de tâche:', error);
    res.status(400).json({
      success: false,
      message: 'Impossible de créer la tâche',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      title,
      description,
      due_date,
      priority,
      status,
      categories = [], // Tableau de catégories
      list_id
    } = req.body;

    const taskId = parseInt(req.params.id);
    if (isNaN(taskId)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'ID de tâche invalide'
      });
    }

    // Rechercher la tâche existante
    const task = await Task.findOne({
      where: {
        id: taskId,
        user_id: req.user.id
      },
      transaction
    });

    if (!task) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }

    // Validation de la date
    let dueDate = task.due_date;
    if (due_date) {
      dueDate = new Date(due_date);
      if (isNaN(dueDate.getTime())) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Format de date invalide'
        });
      }
    }

    // Validation de la priorité
    const validPriorities = ['low', 'medium', 'high'];
    const taskPriority = priority || task.priority;
    if (!validPriorities.includes(taskPriority)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Priorité invalide'
      });
    }

    // Validation du statut
    const validStatuses = ['todo', 'in_progress', 'completed'];
    const taskStatus = status || task.status;
    if (!validStatuses.includes(taskStatus)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    // Conversion de list_id
    const listIdValue = list_id ? parseInt(list_id) : task.list_id;

    // Mise à jour de la tâche
    await task.update({
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      due_date: dueDate,
      priority: taskPriority,
      status: taskStatus,
      list_id: listIdValue
    }, { transaction });

    // Mise à jour des catégories en utilisant les méthodes du modèle
    await Task.deleteTaskCategories(task.id, transaction);

    if (categories.length > 0) {
      await Task.addTaskCategories(task.id, categories, transaction);
    }

    await transaction.commit();

    // Récupérer la tâche mise à jour
    const taskResult = await Task.findByPk(task.id, {
      include: [
        { model: List }
      ]
    });

    // Récupérer les catégories séparément en utilisant la méthode du modèle
    const taskCategories = await Task.getTaskCategories(task.id);

    // Combiner le résultat
    const updatedTask = taskResult.toJSON();
    updatedTask.categories = taskCategories;

    res.json({
      success: true,
      message: 'Tâche mise à jour avec succès',
      task: updatedTask
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Erreur de mise à jour de tâche:', error);
    res.status(400).json({
      success: false,
      message: 'Impossible de mettre à jour la tâche',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const taskId = parseInt(req.params.id);
    if (isNaN(taskId)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'ID de tâche invalide'
      });
    }

    // Rechercher la tâche
    const task = await Task.findOne({
      where: {
        id: taskId,
        user_id: req.user.id
      },
      transaction
    });

    if (!task) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }

    // Supprimer les commentaires associés en utilisant la méthode du modèle
    await TaskComment.deleteByTaskId(taskId, transaction);

    // Supprimer les associations de catégories en utilisant la méthode du modèle
    await Task.deleteTaskCategories(taskId, transaction);

    // Supprimer la tâche
    await task.destroy({ transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Tâche supprimée avec succès'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Erreur de suppression de tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Impossible de supprimer la tâche',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Ajouter des catégories à une tâche
exports.addCategoriesToTask = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const taskId = parseInt(req.params.taskId);
    const { categoryIds } = req.body; // Un tableau d'IDs de catégories
    
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un tableau non vide d\'IDs de catégories'
      });
    }
    
    // Vérifier si la tâche existe et appartient à l'utilisateur
    const task = await Task.findOne({
      where: {
        id: taskId,
        user_id: req.user.id
      },
      transaction
    });
    
    if (!task) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }
    
    // Créer les associations en utilisant la méthode du modèle
    await Task.addTaskCategories(taskId, categoryIds, transaction);
    
    await transaction.commit();
    
    // Récupérer la tâche avec ses catégories
    const taskResult = await Task.findByPk(taskId, {
      include: [
        { model: List }
      ]
    });
    
    // Récupérer les catégories séparément en utilisant la méthode du modèle
    const taskCategories = await Task.getTaskCategories(taskId);
    
    // Combiner le résultat
    const updatedTask = taskResult.toJSON();
    updatedTask.categories = taskCategories;
    
    res.json({
      success: true,
      message: 'Catégories ajoutées avec succès',
      task: updatedTask
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Erreur lors de l\'ajout de catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Impossible d\'ajouter les catégories',
      error: error.message
    });
  }
};