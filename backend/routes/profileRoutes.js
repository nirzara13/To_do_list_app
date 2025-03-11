const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Route pour mettre à jour le profil (sans middleware d'authentification pour l'instant)
router.post('/update', async (req, res) => {
  try {
    const { userId, username, email, currentPassword, newPassword } = req.body;
    
    console.log('Tentative de mise à jour du profil pour l\'utilisateur:', userId);
    console.log('Données reçues:', req.body);
    
    // Trouver l'utilisateur
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    
    // Si un nouveau mot de passe est fourni, vérifier l'ancien mot de passe
    // Route pour mettre à jour le profil
// Route pour mettre à jour le profil
router.post('/update', async (req, res) => {
  try {
    const { userId, username, email, currentPassword, newPassword } = req.body;
    
    console.log('Tentative de mise à jour du profil pour l\'utilisateur:', userId);
    
    // Trouver l'utilisateur
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    
    // Si un nouveau mot de passe est fourni
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ 
          success: false, 
          message: 'Le mot de passe actuel est requis pour changer de mot de passe' 
        });
      }
      
      // Vérifier si le mot de passe stocké est haché ou non
      let validPassword = false;
      if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
        // Mot de passe haché
        validPassword = await bcrypt.compare(currentPassword, user.password);
      } else {
        // Mot de passe en texte clair
        validPassword = (currentPassword === user.password);
      }
      
      if (!validPassword) {
        return res.status(400).json({ 
          success: false, 
          message: 'Le mot de passe actuel est incorrect' 
        });
      }
      
      // Hasher le nouveau mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Mettez à jour manuellement l'objet user pour éviter le hashage par les hooks
      user.username = username;
      user.email = email;
      user.password = hashedPassword;
      
      // Sauvegarder directement sans passer par les hooks
      await user.save({ hooks: false });
    } else {
      // Mise à jour sans mot de passe
      await user.update({ username, email });
    }
    
    // Récupérer l'utilisateur mis à jour
    const updatedUser = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email']
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
    
    // Retourner les données mises à jour (sans le mot de passe)
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

// Route pour supprimer un compte (sans middleware d'authentification pour l'instant)
router.post('/delete', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Trouver l'utilisateur
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    
    // Supprimer l'utilisateur
    await user.destroy();
    
    res.json({ success: true, message: 'Compte supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Route spécifique pour le changement de mot de passe
router.post('/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    
    console.log('Tentative de changement de mot de passe pour l\'utilisateur:', userId);
    
    // Vérifier si tous les champs nécessaires sont présents
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tous les champs sont requis' 
      });
    }
    
    // Récupérer l'utilisateur
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }
    
    // Vérifier le mot de passe actuel
    let validPassword = false;
    
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      validPassword = await bcrypt.compare(currentPassword, user.password);
    } else {
      validPassword = (currentPassword === user.password);
    }
    
    if (!validPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mot de passe actuel incorrect' 
      });
    }
    
    // Générer un nouveau hash pour le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Mettre à jour le mot de passe en utilisant la méthode SQL directe pour éviter les problèmes
    await User.sequelize.query(
      'UPDATE users SET password = ? WHERE id = ?',
      {
        replacements: [hashedPassword, userId],
        type: User.sequelize.QueryTypes.UPDATE
      }
    );
    
    res.json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors du changement de mot de passe'
    });
  }
});

module.exports = router;