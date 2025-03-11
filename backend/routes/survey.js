const express = require('express');
const { Sondage, Question, Reponse } = require('../models');
const router = express.Router();

// Créer un nouveau sondage
router.post('/surveys', async (req, res) => {
  try {
    const survey = await Sondage.create(req.body);
    res.status(201).json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du sondage' });
  }
});

// Récupérer tous les sondages
router.get('/surveys', async (req, res) => {
  try {
    const surveys = await Sondage.findAll();
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des sondages' });
  }
});

// Récupérer un sondage par ID
router.get('/surveys/:id', async (req, res) => {
  try {
    const survey = await Sondage.findByPk(req.params.id, {
      include: [{ model: Question, include: [Reponse] }]
    });
    res.status(200).json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du sondage' });
  }
});

// Mettre à jour un sondage
router.put('/surveys/:id', async (req, res) => {
  try {
    await Sondage.update(req.body, { where: { id: req.params.id } });
    res.status(200).json({ message: 'Sondage mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du sondage' });
  }
});

// Supprimer un sondage
router.delete('/surveys/:id', async (req, res) => {
  try {
    await Sondage.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: 'Sondage supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du sondage' });
  }
});

module.exports = router;
