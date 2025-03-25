// // controllers/listController.js
// const { List, Task } = require('../models');

// // Récupérer toutes les listes d'un utilisateur
// exports.getLists = async (req, res) => {
//   try {
//     const userId = req.user.id; // Supposons que l'utilisateur est disponible via middleware d'authentification
    
//     const lists = await List.findAll({
//       where: { user_id: userId },
//       order: [['createdAt', 'DESC']]
//     });
    
//     return res.status(200).json(lists);
//   } catch (error) {
//     console.error('Error getting lists:', error);
//     return res.status(500).json({ message: 'Erreur lors de la récupération des listes' });
//   }
// };

// // Récupérer une liste spécifique avec ses tâches
// exports.getListById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;
    
//     const list = await List.findOne({
//       where: { 
//         id,
//         user_id: userId 
//       },
//       include: [
//         {
//           model: Task,
//           as: 'tasks',
//           order: [['createdAt', 'DESC']]
//         }
//       ]
//     });
    
//     if (!list) {
//       return res.status(404).json({ message: 'Liste non trouvée' });
//     }
    
//     return res.status(200).json(list);
//   } catch (error) {
//     console.error('Error getting list:', error);
//     return res.status(500).json({ message: 'Erreur lors de la récupération de la liste' });
//   }
// };

// // Créer une nouvelle liste
// exports.createList = async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const userId = req.user.id;
    
//     // Validation
//     if (!title) {
//       return res.status(400).json({ message: 'Le titre est requis' });
//     }
    
//     const newList = await List.create({
//       title,
//       description,
//       user_id: userId,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     });
    
//     return res.status(201).json(newList);
//   } catch (error) {
//     console.error('Error creating list:', error);
//     return res.status(500).json({ message: 'Erreur lors de la création de la liste' });
//   }
// };

// // Mettre à jour une liste
// exports.updateList = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description } = req.body;
//     const userId = req.user.id;
    
//     // Vérifier si la liste existe et appartient à l'utilisateur
//     const list = await List.findOne({
//       where: { 
//         id,
//         user_id: userId 
//       }
//     });
    
//     if (!list) {
//       return res.status(404).json({ message: 'Liste non trouvée' });
//     }
    
//     // Mettre à jour la liste
//     await list.update({
//       title: title || list.title,
//       description: description !== undefined ? description : list.description,
//       updatedAt: new Date()
//     });
    
//     return res.status(200).json(list);
//   } catch (error) {
//     console.error('Error updating list:', error);
//     return res.status(500).json({ message: 'Erreur lors de la mise à jour de la liste' });
//   }
// };

// // Supprimer une liste
// exports.deleteList = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;
    
//     // Vérifier si la liste existe et appartient à l'utilisateur
//     const list = await List.findOne({
//       where: { 
//         id,
//         user_id: userId 
//       }
//     });
    
//     if (!list) {
//       return res.status(404).json({ message: 'Liste non trouvée' });
//     }
    
//     // Supprimer la liste (les tâches associées auront leur list_id mis à NULL grâce à la contrainte ON DELETE SET NULL)
//     await list.destroy();
    
//     return res.status(200).json({ message: 'Liste supprimée avec succès' });
//   } catch (error) {
//     console.error('Error deleting list:', error);
//     return res.status(500).json({ message: 'Erreur lors de la suppression de la liste' });
//   }
// };

// // Récupérer toutes les tâches d'une liste
// exports.getTasksByListId = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;
    
//     // Vérifier si la liste existe et appartient à l'utilisateur
//     const list = await List.findOne({
//       where: { 
//         id,
//         user_id: userId 
//       }
//     });
    
//     if (!list) {
//       return res.status(404).json({ message: 'Liste non trouvée' });
//     }
    
//     // Récupérer les tâches de la liste
//     const tasks = await Task.findAll({
//       where: { 
//         list_id: id,
//         user_id: userId 
//       },
//       order: [['createdAt', 'DESC']]
//     });
    
//     return res.status(200).json(tasks);
//   } catch (error) {
//     console.error('Error getting tasks from list:', error);
//     return res.status(500).json({ message: 'Erreur lors de la récupération des tâches de la liste' });
//   }
// };






const List = require('../models/List');
const Task = require('../models/Task');
const sequelize = require('../config/database');

// Créer une nouvelle liste
exports.createList = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { title, description } = req.body;
    
    // Validation
    if (!title || title.trim() === '') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Le titre est obligatoire'
      });
    }
    
    // Créer la liste
    const newList = await List.create({
      title,
      description: description || null,
      user_id: req.user.id
    }, { transaction });
    
    await transaction.commit();
    
    res.status(201).json({
      success: true,
      message: 'Liste créée avec succès',
      list: newList
    });
  } catch (error) {
    await transaction.rollback();
    
    console.error('Erreur lors de la création de la liste:', error);
    res.status(400).json({
      success: false,
      message: 'Impossible de créer la liste',
      error: error.message
    });
  }
};

// Récupérer toutes les listes d'un utilisateur
exports.getAllLists = async (req, res) => {
  try {
    const lists = await List.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      lists
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des listes:', error);
    res.status(500).json({
      success: false,
      message: 'Impossible de récupérer les listes'
    });
  }
};

// Récupérer une liste spécifique
exports.getListById = async (req, res) => {
  try {
    const listId = parseInt(req.params.id);
    if (isNaN(listId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de liste invalide'
      });
    }
    
    const list = await List.findOne({
      where: {
        id: listId,
        user_id: req.user.id
      }
    });
    
    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'Liste non trouvée'
      });
    }
    
    res.json({
      success: true,
      list
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste:', error);
    res.status(500).json({
      success: false,
      message: 'Impossible de récupérer la liste'
    });
  }
};

// Mettre à jour une liste
exports.updateList = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { title, description } = req.body;
    
    const listId = parseInt(req.params.id);
    if (isNaN(listId)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'ID de liste invalide'
      });
    }
    
    // Validation
    if (!title || title.trim() === '') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Le titre est obligatoire'
      });
    }
    
    const list = await List.findOne({
      where: {
        id: listId,
        user_id: req.user.id
      },
      transaction
    });
    
    if (!list) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Liste non trouvée'
      });
    }
    
    // Mettre à jour la liste
    await list.update({
      title,
      description: description !== undefined ? description : list.description
    }, { transaction });
    
    await transaction.commit();
    
    res.json({
      success: true,
      message: 'Liste mise à jour avec succès',
      list
    });
  } catch (error) {
    await transaction.rollback();
    
    console.error('Erreur lors de la mise à jour de la liste:', error);
    res.status(400).json({
      success: false,
      message: 'Impossible de mettre à jour la liste',
      error: error.message
    });
  }
};

// Supprimer une liste
exports.deleteList = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const listId = parseInt(req.params.id);
    if (isNaN(listId)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'ID de liste invalide'
      });
    }
    
    const list = await List.findOne({
      where: {
        id: listId,
        user_id: req.user.id
      },
      transaction
    });
    
    if (!list) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Liste non trouvée'
      });
    }
    
    // Mettre à jour les tâches associées (enlever l'association avec la liste)
    await Task.update(
      { list_id: null },
      { 
        where: { list_id: listId },
        transaction
      }
    );
    
    // Supprimer la liste
    await list.destroy({ transaction });
    
    await transaction.commit();
    
    res.json({
      success: true,
      message: 'Liste supprimée avec succès'
    });
  } catch (error) {
    await transaction.rollback();
    
    console.error('Erreur lors de la suppression de la liste:', error);
    res.status(400).json({
      success: false,
      message: 'Impossible de supprimer la liste',
      error: error.message
    });
  }
};

// Récupérer toutes les tâches d'une liste
exports.getListTasks = async (req, res) => {
  try {
    const listId = parseInt(req.params.id);
    if (isNaN(listId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de liste invalide'
      });
    }
    
    // Vérifier si la liste existe et appartient à l'utilisateur
    const list = await List.findOne({
      where: {
        id: listId,
        user_id: req.user.id
      }
    });
    
    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'Liste non trouvée'
      });
    }
    
    // Récupérer les tâches de la liste
    const tasks = await Task.findAll({
      where: { 
        list_id: listId,
        user_id: req.user.id
      },
      include: [
        {
          model: require('../models/Category'),
          as: 'categories',
          through: {
            model: require('../models/TaskCategory'),
            attributes: ['display_order']
          }
        }
      ],
      order: [['updatedAt', 'DESC']]
    });
    
    res.json({
      success: true,
      list,
      tasks
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches de la liste:', error);
    res.status(500).json({
      success: false,
      message: 'Impossible de récupérer les tâches de la liste'
    });
  }
};