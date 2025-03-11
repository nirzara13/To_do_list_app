// fix-passwords.js
const bcrypt = require('bcrypt');
const sequelize = require('./backend/config/database');
const User = require('./backend/models/User');

// Fonction pour déterminer si un mot de passe est déjà haché
const isPasswordHashed = (password) => {
  return password.startsWith('$2a$') || password.startsWith('$2b$');
};

// Fonction pour mettre à jour tous les mots de passe non hachés
const updateUnhashedPasswords = async () => {
  try {
    // Récupérer tous les utilisateurs
    const users = await User.findAll();
    
    // Compter combien de mots de passe nécessitent une mise à jour
    let updateCount = 0;
    
    // Parcourir tous les utilisateurs et mettre à jour les mots de passe non hachés
    for (const user of users) {
      if (!isPasswordHashed(user.password)) {
        console.log(`Mise à jour du mot de passe pour ${user.username} (ID: ${user.id})`);
        
        // Hacher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        // Mettre à jour directement dans la base de données
        await User.update(
          { password: hashedPassword },
          { 
            where: { id: user.id },
            individualHooks: false // Désactiver les hooks pour éviter un double hashage
          }
        );
        
        updateCount++;
      }
    }
    
    console.log(`Mise à jour terminée. ${updateCount} mots de passe ont été hachés.`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des mots de passe :', error);
  } finally {
    // Fermer la connexion à la base de données
    await sequelize.close();
  }
};

// Exécuter la fonction
updateUnhashedPasswords();