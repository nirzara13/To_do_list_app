// routes/categoryRoutes.js
const sequelize = require('../config/database');
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes pour les catégories
router.post('/', authMiddleware, categoryController.createCategory);
router.get('/', authMiddleware, categoryController.getAllCategories);
router.put('/:id', authMiddleware, categoryController.updateCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

// Routes pour les associations tâches-catégories
router.post('/task-association', authMiddleware, categoryController.addTaskToCategory);
router.delete('/task-association/:taskId/:categoryId', authMiddleware, categoryController.removeTaskFromCategory);
router.put('/reorder', authMiddleware, categoryController.reorderTasksInCategory);


// Route pour associer une tâche à une catégorie
router.post('/task-association', authMiddleware, async (req, res) => {
    try {
      const { taskId, categoryId } = req.body;
      
      if (!taskId || !categoryId) {
        return res.status(400).json({
          success: false,
          message: 'taskId et categoryId sont requis'
        });
      }
      
      // Insertion directe dans la table task_categories
      const [result] = await sequelize.query(
        `INSERT INTO task_categories (task_id, category_id, display_order, created_at, updated_at) 
         VALUES (?, ?, ?, NOW(), NOW())`,
        { 
          replacements: [taskId, categoryId, 0]
        }
      );
      
      res.json({
        success: true,
        message: 'Association créée avec succès',
        result
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'association:', error);
      res.status(500).json({
        success: false,
        message: 'Impossible de créer l\'association',
        error: error.message
      });
    }
  });
  
  // Route pour supprimer toutes les associations d'une tâche
  router.delete('/tasks/:taskId/categories', authMiddleware, async (req, res) => {
    try {
      const { taskId } = req.params;
      
      await sequelize.query(
        `DELETE FROM task_categories WHERE task_id = ?`,
        { 
          replacements: [taskId]
        }
      );
      
      res.json({
        success: true,
        message: 'Associations supprimées avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression des associations:', error);
      res.status(500).json({
        success: false,
        message: 'Impossible de supprimer les associations',
        error: error.message
      });
    }
  });


module.exports = router;