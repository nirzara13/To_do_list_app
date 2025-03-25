

// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Modèles nécessaires
const Category = require('../models/Category');
const Task = require('../models/Task');
const TaskCategory = require('../models/TaskCategory');

// Routes pour les catégories standard
router.post('/', authMiddleware, categoryController.createCategory);
router.get('/', authMiddleware, categoryController.getAllCategories);
router.put('/:id', authMiddleware, categoryController.updateCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

// Route pour associer une tâche à une catégorie
router.post('/task-association', authMiddleware, async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { taskId, categoryId } = req.body;
        
        // Vérification des paramètres
        if (!taskId || !categoryId) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'taskId et categoryId sont requis'
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
                message: 'Tâche non trouvée ou non autorisée'
            });
        }
        
        // Vérifier que la catégorie existe
        const category = await Category.findByPk(categoryId, { transaction });
        
        if (!category) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Catégorie non trouvée'
            });
        }
        
        // Vérifier si l'association existe déjà
        const existingAssociation = await TaskCategory.findOne({
            where: { 
                task_id: taskId, 
                category_id: categoryId 
            },
            transaction
        });
        
        if (existingAssociation) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cette tâche est déjà associée à cette catégorie'
            });
        }
        
        // Calculer le prochain ordre d'affichage
        const lastOrder = await TaskCategory.max('display_order', {
            where: { category_id: categoryId },
            transaction
        }) || 0;
        
        // Créer l'association
        const taskCategory = await TaskCategory.create({
            task_id: taskId,
            category_id: categoryId,
            display_order: lastOrder + 1
        }, { transaction });
        
        await transaction.commit();
        
        res.status(201).json({
            success: true,
            message: 'Association créée avec succès',
            association: taskCategory
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Erreur lors de la création de l\'association:', error);
        res.status(500).json({
            success: false,
            message: 'Impossible de créer l\'association',
            error: error.message
        });
    }
});

// Route pour supprimer une association spécifique
router.delete('/task-association/:taskId/:categoryId', authMiddleware, async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { taskId, categoryId } = req.params;
        
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
                message: 'Tâche non trouvée ou non autorisée'
            });
        }
        
        // Supprimer l'association spécifique
        const deletedCount = await TaskCategory.destroy({
            where: { 
                task_id: taskId,
                category_id: categoryId 
            },
            transaction
        });
        
        if (deletedCount === 0) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Association non trouvée'
            });
        }
        
        // Réorganiser les ordres d'affichage restants
        await TaskCategory.update(
            { display_order: sequelize.literal('display_order - 1') },
            { 
                where: { 
                    category_id: categoryId,
                    display_order: { [sequelize.Op.gt]: deletedCount }
                },
                transaction
            }
        );
        
        await transaction.commit();
        
        res.json({
            success: true,
            message: 'Association supprimée avec succès'
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Erreur lors de la suppression de l\'association:', error);
        res.status(500).json({
            success: false,
            message: 'Impossible de supprimer l\'association',
            error: error.message
        });
    }
});

// Route pour supprimer toutes les associations d'une tâche
router.delete('/tasks/:taskId/categories', authMiddleware, async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { taskId } = req.params;
        
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
                message: 'Tâche non trouvée ou non autorisée'
            });
        }
        
        // Supprimer toutes les associations
        const deletedCount = await TaskCategory.destroy({
            where: { task_id: taskId },
            transaction
        });
        
        await transaction.commit();
        
        res.json({
            success: true,
            message: `${deletedCount} associations supprimées avec succès`
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Erreur lors de la suppression des associations:', error);
        res.status(500).json({
            success: false,
            message: 'Impossible de supprimer les associations',
            error: error.message
        });
    }
});

module.exports = router;