


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Clé secrète pour JWT - idéalement à stocker dans les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_temporaire';

const authController = {
  // Inscription
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      
      // Vérifier si l'email existe déjà
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
      }
      
      // Vérifier si le username existe déjà
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        return res.status(400).json({ success: false, message: 'Ce nom d\'utilisateur est déjà utilisé' });
      }
      
      // Créer l'utilisateur
      const user = await User.create({
        username,
        email,
        password // Le hash est géré par le hook du modèle
      });
      
      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de l\'inscription' });
    }
  },
  
  // Connexion
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Trouver l'utilisateur
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
      }
      
      // Vérifier le mot de passe
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
      }
      
      // Créer le token
      const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la connexion' });
    }
  },
  
  // Vérifier le mot de passe actuel
  async verifyPassword(userId, password) {
    try {
      // Récupérer l'utilisateur avec son mot de passe
      const user = await User.findByPk(userId);
      if (!user) {
        return false;
      }
      
      // Vérifier le mot de passe
      return bcrypt.compare(password, user.password);
    } catch (error) {
      console.error('Erreur lors de la vérification du mot de passe:', error);
      return false;
    }
  }
};

module.exports = authController;