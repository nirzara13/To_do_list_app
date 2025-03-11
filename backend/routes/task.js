const express = require('express');
const Task = require('./models/task');  // Importer le modèle Task

const router = express.Router();

// Créer une tâche
router.post('/tasks', async (req, res) => {
  const { title, description, due_date, priority, category_id } = req.body;
  try {
    const task = await Task.create({ title, description, due_date, priority, category_id });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lister toutes les tâches
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour une tâche
router.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, priority, category_id } = req.body;
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    task.title = title;
    task.description = description;
    task.due_date = due_date;
    task.priority = priority;
    task.category_id = category_id;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Supprimer une tâche
router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    await task.destroy();
    res.status(200).json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
