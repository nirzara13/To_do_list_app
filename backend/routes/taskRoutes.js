// routes/taskRoutes.js
// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const TaskComment = require('../models/TaskComment'); // Ajoutez cette ligne
const TaskCategory = require('../models/TaskCategory'); // Ajoutez cette ligne
const sequelize = require('../config/database'); // Ajoutez cette ligne
const authMiddleware = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController');
// Créer une tâche
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      due_date, 
      priority, 
      status 
    } = req.body;

    // Validation explicite du titre
    if (!title) {
      return res.status(400).json({ 
        success: false,
        message: 'Le titre est obligatoire' 
      });
    }

    const newTask = await Task.create({
      title,
      description: description || null,
      due_date: due_date ? new Date(due_date) : null,
      priority: priority || 'medium',
      status: status || 'todo',
      user_id: req.user.id
    });

    res.status(201).json({ 
      success: true,
      message: 'Tâche créée avec succès', 
      task: newTask 
    });
  } catch (error) {
    console.error('Erreur détaillée:', error);
    res.status(400).json({ 
      success: false,
      message: 'Impossible de créer la tâche', 
      error: error.message,
      details: error.errors || error
    });
  }
});

// Récupérer les tâches de l'utilisateur
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ 
      success: true,
      tasks 
    });
  } catch (error) {
    console.error('Erreur de récupération:', error);
    res.status(500).json({ 
      success: false,
      message: 'Impossible de récupérer les tâches' 
    });
  }
});

// Mettre à jour une tâche
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { 
        id: req.params.id, 
        user_id: req.user.id 
      }
    });

    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Tâche non trouvée' 
      });
    }

    const updatedTask = await task.update(req.body);

    res.json({ 
      success: true,
      message: 'Tâche mise à jour', 
      task: updatedTask 
    });
  } catch (error) {
    console.error('Erreur de mise à jour:', error);
    res.status(400).json({ 
      success: false,
      message: 'Impossible de mettre à jour la tâche' 
    });
  }
});

// Supprimer une tâche
// Dans routes/taskRoutes.js ou controllers/taskController.js
// Supprimer une tâche
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }

    // Étape 1: Supprimer tous les commentaires associés
    console.log(`Suppression des commentaires pour la tâche ${task.id}`);
    await TaskComment.destroy({
      where: { task_id: task.id }
    });
    
    // Étape 2: Supprimer toutes les associations avec les catégories
    console.log(`Suppression des associations de catégories pour la tâche ${task.id}`);
    await TaskCategory.destroy({
      where: { task_id: task.id }
    });

    // Étape 3: Enfin supprimer la tâche elle-même
    console.log(`Suppression de la tâche ${task.id}`);
    await task.destroy();

    res.json({
      success: true,
      message: 'Tâche supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur de suppression:', error);
    res.status(400).json({
      success: false,
      message: 'Impossible de supprimer la tâche',
      error: error.message
    });
  }
});

// routes/taskRoutes.js



router.post('/', authMiddleware, taskController.createTask);

// Récupérer toutes les tâches de l'utilisateur
router.get('/', authMiddleware, taskController.getAllTasks);

// Récupérer une tâche spécifique
router.get('/:id', authMiddleware, taskController.getTaskById);

// Mettre à jour une tâche
router.put('/:id', authMiddleware, taskController.updateTask);

// Supprimer une tâche
router.delete('/:id', authMiddleware, taskController.deleteTask);



module.exports = router;