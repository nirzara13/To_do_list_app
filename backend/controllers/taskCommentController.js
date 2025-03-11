// controllers/taskCommentController.js
const TaskComment = require('../models/TaskComment');
const Task = require('../models/Task');
const User = require('../models/User'); // Ajoutez cette ligne d'import


exports.createComment = async (req, res) => {
  try {
    const { task_id, content } = req.body;

    // Vérifier que la tâche existe et appartient à l'utilisateur
    const task = await Task.findOne({
      where: { 
        id: task_id, 
        user_id: req.user.id 
      }
    });

    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Tâche non trouvée ou non autorisée' 
      });
    }

    // Créer le commentaire
    const newComment = await TaskComment.create({
      task_id,
      user_id: req.user.id,
      content
    });

    res.status(201).json({ 
      success: true,
      message: 'Commentaire ajouté avec succès',
      comment: newComment 
    });
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error);
    res.status(400).json({ 
      success: false,
      message: 'Impossible de créer le commentaire',
      error: error.message 
    });
  }
};

exports.getTaskComments = async (req, res) => {
    try {
      const { task_id } = req.params;
      
      // Vérifier que la tâche existe et appartient à l'utilisateur
      const task = await Task.findOne({
        where: { 
          id: task_id, 
          user_id: req.user.id 
        }
      });
  
      if (!task) {
        return res.status(404).json({ 
          success: false,
          message: 'Tâche non trouvée ou non autorisée' 
        });
      }
  
      // Récupérer les commentaires
      const comments = await TaskComment.findAll({
        where: { task_id },
        include: [
          { 
            model: User, 
            as: 'user', 
            attributes: ['id', 'username'] 
          }
        ],
        order: [['created_at', 'DESC']]
      });
  
      res.json({ 
        success: true,
        comments 
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      res.status(500).json({ 
        success: false,
        message: 'Impossible de récupérer les commentaires',
        error: error.message 
      });
    }
  };