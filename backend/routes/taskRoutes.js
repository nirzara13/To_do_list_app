// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const authMiddleware = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController');

// Routes pour la gestion des tâches
// ================================

// Créer une nouvelle tâche
router.post('/', authMiddleware, taskController.createTask);

// Récupérer toutes les tâches de l'utilisateur connecté
router.get('/', authMiddleware, taskController.getAllTasks);

// Récupérer une tâche spécifique par son ID
router.get('/:id', authMiddleware, taskController.getTaskById);

// Mettre à jour une tâche existante
router.put('/:id', authMiddleware, taskController.updateTask);

// Supprimer une tâche
router.delete('/:id', authMiddleware, taskController.deleteTask);

// Routes pour la gestion des catégories liées aux tâches
// ====================================================

// Ajouter des catégories à une tâche (notez que le chemin est corrigé)
router.post('/:taskId/categories', authMiddleware, taskController.addCategoriesToTask);

module.exports = router;