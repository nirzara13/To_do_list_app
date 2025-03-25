const TaskComment = require('../models/TaskComment');
const Task = require('../models/Task');
const User = require('../models/User');

const taskCommentController = {
  // Créer un commentaire
  createComment: async (req, res) => {
    try {
      console.log("Requête de création de commentaire reçue:", req.body);
      
      const { content, task_id } = req.body;
      const userId = req.user.id;
      
      // Vérifier que la tâche existe
      const task = await Task.findByPk(task_id);
      if (!task) {
        return res.status(404).json({ 
          success: false, 
          message: 'Tâche non trouvée' 
        });
      }
      
      // Créer le commentaire en utilisant le modèle
      const comment = await TaskComment.create({
        content,
        task_id,
        user_id: userId
      });
      
      console.log("Commentaire créé avec succès, ID:", comment.id);
      
      res.status(201).json({
        success: true,
        message: 'Commentaire ajouté avec succès',
        comment
      });
    } catch (error) {
      console.error('Erreur détaillée lors de la création du commentaire:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du commentaire',
        error: error.message
      });
    }
  },
  
  // Récupérer les commentaires d'une tâche
  getTaskComments: async (req, res) => {
    try {
      const taskId = req.params.task_id;
      console.log("Récupération des commentaires pour la tâche:", taskId);
      
      // Récupérer les commentaires avec les infos de l'utilisateur
      const comments = await TaskComment.findAll({
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
      
      console.log(`${comments.length} commentaires récupérés pour la tâche ${taskId}`);
      
      res.status(200).json({
        success: true,
        comments
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des commentaires',
        error: error.message
      });
    }
  },
  
  // Mettre à jour un commentaire
  updateComment: async (req, res) => {
    try {
      const commentId = req.params.id;
      const { content } = req.body;
      const userId = req.user.id;
      
      // Trouver le commentaire
      const comment = await TaskComment.findByPk(commentId);
      
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
      }
      
      // Vérifier que l'utilisateur est l'auteur du commentaire
      if (comment.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'êtes pas autorisé à modifier ce commentaire'
        });
      }
      
      // Mettre à jour le commentaire
      await comment.update({ content });
      
      res.status(200).json({
        success: true,
        message: 'Commentaire mis à jour avec succès',
        comment
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du commentaire:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du commentaire',
        error: error.message
      });
    }
  },
  
  // Supprimer un commentaire
  deleteComment: async (req, res) => {
    try {
      const commentId = req.params.id;
      const userId = req.user.id;
      
      // Trouver le commentaire
      const comment = await TaskComment.findByPk(commentId);
      
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
      }
      
      // Vérifier que l'utilisateur est l'auteur du commentaire
      if (comment.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'êtes pas autorisé à supprimer ce commentaire'
        });
      }
      
      // Supprimer le commentaire
      await comment.destroy();
      
      res.status(200).json({
        success: true,
        message: 'Commentaire supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du commentaire',
        error: error.message
      });
    }
  }
};

module.exports = taskCommentController;