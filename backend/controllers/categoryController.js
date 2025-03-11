// controllers/categoryController.js
const Category = require('../models/Category');
const TaskCategory = require('../models/TaskCategory');
const Task = require('../models/Task');
const sequelize = require('../config/database'); // Ajoutez cette ligne

// Créer une nouvelle catégorie
exports.createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;

    // Vérifier si une catégorie avec ce nom existe déjà
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Une catégorie avec ce nom existe déjà.'
      });
    }

    const newCategory = await Category.create({
      name,
      color: color || '#808080'
    });

    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      category: newCategory
    });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    res.status(400).json({
      success: false,
      message: error.name === 'SequelizeUniqueConstraintError' 
        ? 'Une catégorie avec ce nom existe déjà.'
        : 'Impossible de créer la catégorie',
      error: error.message
    });
  }
};


// Récupérer toutes les catégories
// Dans categoryController.js
// Dans categoryController.js
exports.getAllCategories = async (req, res) => {
  try {
    // Utiliser directement le modèle Sequelize
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });

    // Filtrer les doublons par nom
    const uniqueNameMap = {};
    const uniqueCategories = [];
    
    for (const category of categories) {
      if (!uniqueNameMap[category.name]) {
        uniqueNameMap[category.name] = true;
        uniqueCategories.push(category);
      }
    }
    
    console.log('Catégories récupérées (filtrées):', uniqueCategories.length);
    
    res.json({
      success: true,
      categories: uniqueCategories
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Impossible de récupérer les catégories'
    });
  }
};
// Mettre à jour une catégorie
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    const updatedCategory = await category.update({
      name: name || category.name,
      color: color || category.color
    });

    res.json({
      success: true,
      message: 'Catégorie mise à jour avec succès',
      category: updatedCategory
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    res.status(400).json({
      success: false,
      message: 'Impossible de mettre à jour la catégorie',
      error: error.message
    });
  }
};

// Supprimer une catégorie
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    res.status(400).json({
      success: false,
      message: 'Impossible de supprimer la catégorie',
      error: error.message
    });
  }
};

// Associer une tâche à une catégorie
exports.addTaskToCategory = async (req, res) => {
  try {
    const { taskId, categoryId } = req.body;

    // Vérifier que la tâche existe et appartient à l'utilisateur
    const task = await Task.findOne({
      where: {
        id: taskId,
        user_id: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée ou non autorisée'
      });
    }

    // Vérifier que la catégorie existe
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    // Trouver le dernier ordre d'affichage pour cette catégorie
    const lastOrder = await TaskCategory.max('display_order', {
      where: { category_id: categoryId }
    }) || 0;

    // Créer l'association avec un ordre d'affichage incrémenté
    const [taskCategory, created] = await TaskCategory.findOrCreate({
      where: {
        task_id: taskId,
        category_id: categoryId
      },
      defaults: {
        display_order: lastOrder + 1
      }
    });

    if (!created) {
      return res.status(400).json({
        success: false,
        message: 'Cette tâche est déjà associée à cette catégorie'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Tâche associée à la catégorie avec succès',
      taskCategory
    });
  } catch (error) {
    console.error('Erreur lors de l\'association de la tâche à la catégorie:', error);
    res.status(400).json({
      success: false,
      message: 'Impossible d\'associer la tâche à la catégorie',
      error: error.message
    });
  }
};

// Dissocier une tâche d'une catégorie
exports.removeTaskFromCategory = async (req, res) => {
  try {
    const { taskId, categoryId } = req.params;

    // Vérifier que la tâche existe et appartient à l'utilisateur
    const task = await Task.findOne({
      where: {
        id: taskId,
        user_id: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée ou non autorisée'
      });
    }

    // Supprimer l'association
    const deleted = await TaskCategory.destroy({
      where: {
        task_id: taskId,
        category_id: categoryId
      }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Association non trouvée'
      });
    }

    // Réorganiser les autres tâches de cette catégorie
    await TaskCategory.update(
      { display_order: sequelize.literal('display_order - 1') },
      {
        where: {
          category_id: categoryId,
          display_order: { [sequelize.Op.gt]: deleted.display_order }
        }
      }
    );

    res.json({
      success: true,
      message: 'Tâche dissociée de la catégorie avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la dissociation de la tâche de la catégorie:', error);
    res.status(400).json({
      success: false,
      message: 'Impossible de dissocier la tâche de la catégorie',
      error: error.message
    });
  }
};

// Réordonner les tâches dans une catégorie
exports.reorderTasksInCategory = async (req, res) => {
  try {
    const { taskId, categoryId, direction } = req.body;

    // Vérifier que la tâche existe et appartient à l'utilisateur
    const task = await Task.findOne({
      where: {
        id: taskId,
        user_id: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée ou non autorisée'
      });
    }

    // Récupérer l'association actuelle
    const currentAssoc = await TaskCategory.findOne({
      where: {
        task_id: taskId,
        category_id: categoryId
      }
    });

    if (!currentAssoc) {
      return res.status(404).json({
        success: false,
        message: 'Cette tâche n\'est pas associée à cette catégorie'
      });
    }

    // Déterminer la position cible en fonction de la direction
    const currentOrder = currentAssoc.display_order;
    let targetOrder;

    if (direction === 'up') {
      targetOrder = currentOrder - 1;
      if (targetOrder < 0) {
        return res.status(400).json({
          success: false,
          message: 'La tâche est déjà en haut de la liste'
        });
      }
    } else if (direction === 'down') {
      targetOrder = currentOrder + 1;
      
      // Vérifier si c'est déjà la dernière tâche
      const maxOrder = await TaskCategory.max('display_order', {
        where: { category_id: categoryId }
      });
      
      if (currentOrder >= maxOrder) {
        return res.status(400).json({
          success: false,
          message: 'La tâche est déjà en bas de la liste'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Direction invalide. Utilisez "up" ou "down"'
      });
    }

    // Trouver l'association à échanger
    const swapAssoc = await TaskCategory.findOne({
      where: {
        category_id: categoryId,
        display_order: targetOrder
      }
    });

    if (!swapAssoc) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de réordonner les tâches'
      });
    }

    // Échanger les positions
    await Promise.all([
      currentAssoc.update({ display_order: targetOrder }),
      swapAssoc.update({ display_order: currentOrder })
    ]);

    res.json({
      success: true,
      message: 'Tâches réordonnées avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la réorganisation des tâches:', error);
    res.status(400).json({
      success: false,
      message: 'Impossible de réordonner les tâches',
      error: error.message
    });
  }
};