

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { Op } = require('sequelize'); // Ajout de Op pour les recherches

// Routes d'authentification (publiques)
router.post('/signup', authController.register);
router.post('/login', authController.login);

// Route simple pour obtenir le profil d'un utilisateur par ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'email'] // On exclut le mot de passe
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Route simple pour mettre à jour un profil utilisateur
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    
    const { username, email, password } = req.body;
    
    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: req.params.id } 
        } 
      });
      
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
      }
    }
    
    // Préparation des données à mettre à jour
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = password; // Le hash est géré par le hook du modèle
    
    // Mise à jour de l'utilisateur
    await user.update(updateData);
    
    // Récupération de l'utilisateur avec les données mises à jour
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'email'] // On exclut le mot de passe
    });
    
    res.json({ 
      success: true,
      message: 'Profil mis à jour avec succès',
      user: updatedUser
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Route simple pour supprimer un compte utilisateur
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    
    await user.destroy();
    
    res.json({ success: true, message: 'Compte supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Ajouter cette route à la fin du fichier users.js
// router.post('/update-user-profile', async (req, res) => {
//   try {
//     const { userId, username, email } = req.body;
    
//     console.log('Tentative de mise à jour du profil', {userId, username, email});
    
//     // Rechercher l'utilisateur
//     const user = await User.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
//     }
    
//     // Mettre à jour l'utilisateur
//     await user.update({ username, email });
    
//     // Retourner les données mises à jour
//     res.json({
//       success: true,
//       message: 'Profil mis à jour avec succès',
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     console.error('Erreur lors de la mise à jour du profil:', error);
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// });




// Ajoutez cette route à la fin du fichier users.js
router.post('/update-user-profile', authMiddleware, async (req, res) => {
  // Le code que je vous ai précédemment fourni
  try {
    const { userId, username, email } = req.body;
    
    console.log('Tentative de mise à jour du profil', {userId, username, email});
    
    // Vérifier si l'utilisateur tente de modifier son propre profil
    if (userId !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Non autorisé à modifier ce profil' 
      });
    }
    
    // Rechercher l'utilisateur
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    
    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: userId } 
        } 
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cet email est déjà utilisé' 
        });
      }
    }
    
    // Mettre à jour l'utilisateur
    await user.update({ 
      username: username || user.username, 
      email: email || user.email 
    });
    
    // Retourner les données mises à jour
    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;