// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // Clé secrète pour JWT - idéalement à stocker dans les variables d'environnement
// const JWT_SECRET = process.env.JWT_SECRET || 'Hello123';

// const authMiddleware = async (req, res, next) => {
//   try {
//     // Vérifier si le header Authorization existe
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Non autorisé - Token manquant' 
//       });
//     }

//     // Extraire le token
//     const token = authHeader.split(' ')[1];

//     // Vérifier le token
//     const decoded = jwt.verify(token, JWT_SECRET);
    
//     // Trouver l'utilisateur
//     const user = await User.findByPk(decoded.userId);
//     if (!user) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Utilisateur non trouvé' 
//       });
//     }

//     // Ajouter l'utilisateur à la requête
//     req.user = user;
    
//     next();
//   } catch (error) {
//     console.error('Erreur d\'authentification:', error);
    
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Token expiré' 
//       });
//     }
    
//     return res.status(401).json({ 
//       success: false, 
//       message: 'Non autorisé - Token invalide' 
//     });
//   }
// };

// module.exports = authMiddleware;





const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Clé secrète pour JWT - idéalement à stocker dans les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET || 'Hello123';

const authMiddleware = async (req, res, next) => {
  try {
    // Vérifier si le header Authorization existe
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Token manquant'
      });
    }

    // Extraire le token
    const token = authHeader.split(' ')[1];

    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Trouver l'utilisateur
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;

    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token invalide'
    });
  }
};

module.exports = authMiddleware;
