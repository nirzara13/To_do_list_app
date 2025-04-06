

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