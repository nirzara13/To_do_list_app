// const Task = require('../models/Task');

// // Obtenir toutes les tâches
// exports.getAllTasks = async (req, res) => {
//   try {
//     const tasks = await Task.findAll();
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// };

// // Créer une tâche
// exports.createTask = async (req, res) => {
//   try {
//     const { title, description, due_date, priority, status } = req.body;
//     const task = await Task.create({ title, description, due_date, priority, status });
//     res.status(201).json(task);
//   } catch (error) {
//     res.status(400).json({ error: 'Impossible de créer la tâche' });
//   }
// };

// // Obtenir une tâche par ID
// exports.getTaskById = async (req, res) => {
//   try {
//     const task = await Task.findByPk(req.params.id);
//     if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
//     res.json(task);
//   } catch (error) {
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// };

// // Mettre à jour une tâche
// exports.updateTask = async (req, res) => {
//   try {
//     const task = await Task.findByPk(req.params.id);
//     if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });

//     await task.update(req.body);
//     res.json(task);
//   } catch (error) {
//     res.status(400).json({ error: 'Impossible de mettre à jour la tâche' });
//   }
// };

// // Supprimer une tâche
// exports.deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findByPk(req.params.id);
//     if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });

//     await task.destroy();
//     res.json({ message: 'Tâche supprimée avec succès' });
//   } catch (error) {
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// };


// // controllers/taskController.js
// const path = require('path');
// const fs = require('fs');

// // Vérification du chemin et de l'importation
// console.log('Répertoire actuel :', __dirname);
// console.log('Chemin du modèle Task :', path.resolve(__dirname, '../models/Task.js'));

// const Task = require('../models/Task');

// // Vérification de l'importation
// console.log('Modèle Task importé :', !!Task);
// console.log('Clés du modèle Task :', Object.keys(Task));

// exports.getTaskById = async (req, res) => {
//   try {
//     console.log('ID de la tâche recherchée :', req.params.id);
//     console.log('ID de l\'utilisateur :', req.user.id);

//     const task = await Task.findOne({
//       where: {
//         id: req.params.id,
//         user_id: req.user.id
//       }
//     });

//     if (!task) {
//       console.log('Tâche non trouvée');
//       return res.status(404).json({
//         success: false,
//         message: 'Tâche non trouvée'
//       });
//     }

//     res.json({
//       success: true,
//       task
//     });
//   } catch (error) {
//     console.error('Erreur détaillée :', {
//       message: error.message,
//       nom: error.name,
//       pile: error.stack
//     });

//     res.status(500).json({
//       success: false,
//       message: 'Impossible de récupérer la tâche',
//       détails: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };



// controllers/taskController.js
const Task = require('../models/Task');
const Category = require('../models/Category');
const TaskCategory = require('../models/TaskCategory');
const TaskComment = require('../models/TaskComment');
const sequelize = require('../config/database');

exports.getTaskById = async (req, res) => {
  try {
    console.log('ID de la tâche recherchée :', req.params.id);
    console.log('ID de l\'utilisateur :', req.user.id);

    // Validation de l'ID
    const taskId = parseInt(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de tâche invalide'
      });
    }

    const task = await Task.findOne({
      where: {
        id: taskId,
        user_id: req.user.id
      },
      include: [
        {
          model: Category,
          as: 'categories',
          through: {
            model: TaskCategory,
            attributes: ['display_order']
          }
        }
      ]
    });

    if (!task) {
      console.log('Tâche non trouvée');
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Erreur détaillée :', {
      message: error.message,
      nom: error.name,
      pile: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Impossible de récupérer la tâche',
      détails: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


exports.getAllTasks = async (req, res) => {
  try {
    // Récupérer les tâches avec leurs catégories associées
    const tasks = await Task.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Category,
          as: 'categories',
          through: {
            model: TaskCategory,
            attributes: ['display_order']
          }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Convertir les instances Sequelize en objets JSON simples
    const formattedTasks = tasks.map(task => {
      const taskObj = task.toJSON();
      
      // S'assurer que les IDs de catégories sont des nombres
      if (taskObj.categories && Array.isArray(taskObj.categories)) {
        taskObj.categories = taskObj.categories.map(cat => ({
          ...cat,
          id: Number(cat.id) // Garantir que l'ID est un nombre
        }));
      }
      
      return taskObj;
    });

    console.log(`${tasks.length} tâches récupérées pour l'utilisateur ${req.user.id}`);
    
    res.json({
      success: true,
      tasks: formattedTasks
    });
  } catch (error) {
    console.error('Erreur de récupération:', error);
    res.status(500).json({
      success: false,
      message: 'Impossible de récupérer les tâches'
    });
  }
};

exports.createTask = async (req, res) => {
  // Utilisation d'une transaction pour garantir l'intégrité des données
  const transaction = await sequelize.transaction();
  
  try {
    const {
      title,
      description,
      due_date,
      priority,
      status,
      categories // Tableau d'IDs de catégories
    } = req.body;

    console.log('Tentative de création d\'une tâche:', { title, categories });

    // Validation explicite du titre
    if (!title || title.trim() === '') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Le titre est obligatoire'
      });
    }

    // Dans la méthode createTask
console.log('Catégories reçues:', categories);
// ...
// Après avoir créé une association
console.log(`Association créée pour tâche ${newTask.id}, catégorie ${categoryId}, ordre ${lastOrder + 1}`);

    // Vérification de la validité de la date
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

    // Vérification de la priorité
    const validPriorities = ['low', 'medium', 'high'];
    const taskPriority = priority || 'medium';
    if (!validPriorities.includes(taskPriority)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Priorité invalide'
      });
    }

    // Vérification du statut
    const validStatuses = ['todo', 'in_progress', 'completed'];
    const taskStatus = status || 'todo';
    if (!validStatuses.includes(taskStatus)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    // Création de la tâche
    const newTask = await Task.create({
      title,
      description: description || null,
      due_date: dueDate,
      priority: taskPriority,
      status: taskStatus,
      user_id: req.user.id
    }, { transaction });

    console.log('Tâche créée avec ID:', newTask.id);

    // Ajouter les catégories si elles sont fournies
    if (categories && Array.isArray(categories) && categories.length > 0) {
      console.log('Ajout de catégories:', categories);
      
      // Pour chaque catégorie, créer une association avec un ordre d'affichage
      for (let i = 0; i < categories.length; i++) {
        const categoryId = parseInt(categories[i]);
        
        if (isNaN(categoryId)) {
          console.warn(`ID de catégorie invalide ignoré: ${categories[i]}`);
          continue;
        }
        
        // Vérifier que la catégorie existe
        const category = await Category.findByPk(categoryId, { transaction });
        
        if (!category) {
          console.warn(`Catégorie non trouvée avec ID: ${categoryId}`);
          continue;
        }
        
        console.log(`Association de la tâche ${newTask.id} avec la catégorie ${categoryId}`);
        
        // Trouver le dernier ordre pour cette catégorie
        const [results] = await sequelize.query(
          'SELECT COALESCE(MAX(display_order), 0) as maxOrder FROM task_categories WHERE category_id = ?',
          { 
            replacements: [categoryId],
            type: sequelize.QueryTypes.SELECT,
            transaction 
          }
        );
        
        const lastOrder = results.maxOrder || 0;
        
        // Créer l'association
        await TaskCategory.create({
          task_id: newTask.id,
          category_id: categoryId,
          display_order: lastOrder + 1
        }, { transaction });
        
        console.log(`Association créée avec ordre: ${lastOrder + 1}`);
      }
    }
    
    // Valider la transaction
    await transaction.commit();
    
    // Recharger la tâche avec ses catégories
    const taskWithCategories = await Task.findByPk(newTask.id, {
      include: [{
        model: Category,
        as: 'categories',
        through: {
          attributes: ['display_order']
        }
      }]
    });
    
    res.status(201).json({
      success: true,
      message: 'Tâche créée avec succès',
      task: taskWithCategories
    });
    
  } catch (error) {
    // En cas d'erreur, annuler toutes les modifications
    await transaction.rollback();
    
    console.error('Erreur détaillée lors de la création de tâche:', error);
    res.status(400).json({
      success: false,
      message: 'Impossible de créer la tâche',
      error: error.message
    });
  }
};

exports.updateTask = async (req, res) => {
  // Utilisation d'une transaction pour garantir l'intégrité des données
  const transaction = await sequelize.transaction();
  
  try {
    const {
      title,
      description,
      due_date,
      priority,
      status,
      categories
    } = req.body;

    console.log('Mise à jour de tâche, catégories reçues:', categories);

    // Validation de l'ID
    const taskId = parseInt(req.params.id);
    if (isNaN(taskId)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'ID de tâche invalide'
      });
    }

    // Récupérer la tâche à mettre à jour
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

    // Vérification de la validité de la date
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

    // Vérification de la priorité
    const validPriorities = ['low', 'medium', 'high'];
    const taskPriority = priority || task.priority;
    if (!validPriorities.includes(taskPriority)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Priorité invalide'
      });
    }

    // Vérification du statut
    const validStatuses = ['todo', 'in_progress', 'completed'];
    const taskStatus = status || task.status;
    if (!validStatuses.includes(taskStatus)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    // Mettre à jour les champs de base
    await task.update({
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      due_date: dueDate,
      priority: taskPriority,
      status: taskStatus
    }, { transaction });

    // Mettre à jour les catégories si elles sont fournies
    if (categories !== undefined) {
      // Supprimer toutes les associations existantes
      await TaskCategory.destroy({
        where: { task_id: task.id },
        transaction
      });

      // Ajouter les nouvelles associations
      if (Array.isArray(categories) && categories.length > 0) {
        for (let i = 0; i < categories.length; i++) {
          const categoryId = parseInt(categories[i]);
          
          if (isNaN(categoryId)) {
            console.warn(`ID de catégorie invalide ignoré: ${categories[i]}`);
            continue;
          }
          
          // Vérifier que la catégorie existe
          const category = await Category.findByPk(categoryId, { transaction });
          
          if (!category) {
            console.warn(`Catégorie non trouvée avec ID: ${categoryId}`);
            continue;
          }
          
          // Trouver le dernier ordre pour cette catégorie
          const [results] = await sequelize.query(
            'SELECT COALESCE(MAX(display_order), 0) as maxOrder FROM task_categories WHERE category_id = ?',
            { 
              replacements: [categoryId],
              type: sequelize.QueryTypes.SELECT,
              transaction 
            }
          );
          
          const lastOrder = results.maxOrder || 0;
          
          // Créer l'association
          await TaskCategory.create({
            task_id: task.id,
            category_id: categoryId,
            display_order: lastOrder + 1
          }, { transaction });
        }
      }
    }

    // Valider la transaction
    await transaction.commit();

    // Recharger la tâche avec ses catégories
    const updatedTask = await Task.findByPk(task.id, {
      include: [{
        model: Category,
        as: 'categories',
        through: {
          attributes: ['display_order']
        }
      }]
    });

    res.json({
      success: true,
      message: 'Tâche mise à jour',
      task: updatedTask
    });
  } catch (error) {
    // En cas d'erreur, annuler toutes les modifications
    await transaction.rollback();
    
    console.error('Erreur de mise à jour:', error);
    res.status(400).json({
      success: false,
      message: 'Impossible de mettre à jour la tâche',
      error: error.message
    });
  }
};

exports.deleteTask = async (req, res) => {
  // Utilisation d'une transaction pour garantir l'intégrité des données
  const transaction = await sequelize.transaction();
  
  try {
    // Validation de l'ID
    const taskId = parseInt(req.params.id);
    if (isNaN(taskId)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'ID de tâche invalide'
      });
    }

    // Vérifier que la tâche existe et appartient à l'utilisateur
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

    // Supprimer d'abord les commentaires associés pour éviter les erreurs de clé étrangère
    console.log(`Suppression des commentaires pour la tâche ${taskId}`);
    await TaskComment.destroy({
      where: { task_id: taskId },
      transaction
    });

    // Supprimer ensuite les associations avec les catégories
    console.log(`Suppression des associations de catégories pour la tâche ${taskId}`);
    await TaskCategory.destroy({
      where: { task_id: taskId },
      transaction
    });

    // Enfin, supprimer la tâche elle-même
    console.log(`Suppression de la tâche ${taskId}`);
    await task.destroy({ transaction });

    // Valider la transaction
    await transaction.commit();

    res.json({
      success: true,
      message: 'Tâche supprimée avec succès'
    });
  } catch (error) {
    // En cas d'erreur, annuler toutes les modifications
    await transaction.rollback();
    
    console.error('Erreur de suppression:', error);
    res.status(400).json({
      success: false,
      message: 'Impossible de supprimer la tâche',
      error: error.message
    });
  }
};