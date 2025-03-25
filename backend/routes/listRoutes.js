const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware');

// Appliquer le middleware d'authentification à toutes les routes
router.use(authMiddleware);

// Route pour créer une nouvelle liste
router.post('/', listController.createList);

// Route pour récupérer toutes les listes de l'utilisateur
router.get('/', listController.getAllLists);

// Route pour récupérer une liste spécifique
router.get('/:id', listController.getListById);

// Route pour mettre à jour une liste
router.put('/:id', listController.updateList);

// Route pour supprimer une liste
router.delete('/:id', listController.deleteList);

// Route pour récupérer toutes les tâches d'une liste
router.get('/:id/tasks', listController.getListTasks);

module.exports = router;