




// // Ajouter au début de server.js, avant les routes
// // server.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const sequelize = require('./config/database');
// const taskRoutes = require('./routes/taskRoutes');
// const userRoutes = require('./routes/users');
// // Ajoutez cette ligne pour le nouveau fichier de routes
// const profileRoutes = require('./routes/profileRoutes');
// // Ajoutez cette ligne
// const taskCommentRoutes = require('./routes/taskCommentRoutes');
// const taskRoutes = require('./routes/taskRoutes');
// const listRoutes = require('./routes/listRoutes');
// const categoryRoutes = require('./routes/categoryRoutes');


// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/user', userRoutes);
// app.use('/api/tasks', taskRoutes);
// // Ajoutez cette ligne pour configurer les nouvelles routes
// app.use('/api/profile', profileRoutes);
// app.use('/api/task-comments', taskCommentRoutes);



// // Routes API
// app.use('/api/tasks', taskRoutes);
// app.use('/api/lists', listRoutes); // Nouvelle route pour les listes
// app.use('/api/categories', categoryRoutes);



// // Route de test simple pour vérifier que le serveur fonctionne
// app.get('/api/test', (req, res) => {
//   res.json({ message: 'Le serveur fonctionne correctement!' });
// });

// sequelize.sync({ alter: true })
//   .then(() => console.log('✅ Base de données synchronisée'))
//   .catch(error => console.error('❌ Erreur de synchronisation:', error));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`));












require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const authMiddleware = require('./middleware/authMiddleware');
const taskCommentController = require('./controllers/taskCommentController');

// Import des routes (sans duplication)
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/taskRoutes');
const profileRoutes = require('./routes/profileRoutes');
const taskCommentRoutes = require('./routes/taskCommentRoutes');
const listRoutes = require('./routes/listRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const contactRoutes = require('./routes/contactRoutes');



const app = express();






// Middleware
app.use(cors());
app.use(express.json());



app.use((req, res, next) => {
  if (req.body && req.body.list_id !== undefined) {
    req.body.list_id = req.body.list_id ? parseInt(req.body.list_id) : null;
  }
  next();
});


// Charger les associations
require('./models/associations');

// Route directe pour les commentaires
app.post('/api/direct-comment', authMiddleware, async (req, res) => {
  try {
    console.log('Route directe de commentaire appelée avec:', req.body);
    
    const { content, task_id } = req.body;
    const userId = req.user.id;
    
    // Vérification des données
    if (!content || !task_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Contenu et ID de tâche requis' 
      });
    }
    
    // Insertion directe dans la base de données
    await sequelize.query(
      `INSERT INTO task_comments (content, task_id, user_id, created_at, updatedAt) 
       VALUES (?, ?, ?, NOW(), NOW())`,
      { 
        replacements: [content, task_id, userId]
      }
    );
    
    console.log('Commentaire enregistré avec succès dans la base de données');
    
    res.status(201).json({
      success: true,
      message: 'Commentaire ajouté avec succès'
    });
    
  } catch (error) {
    console.error('Erreur dans la route directe de commentaire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'ajout du commentaire',
      error: error.message
    });
  }
});

// Route pour récupérer les commentaires d'une tâche
app.get('/api/task-comments/:taskId', authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    console.log('Récupération des commentaires pour la tâche:', taskId);
    
    // Récupération directe depuis la base de données
    const [comments] = await sequelize.query(
      `SELECT * FROM task_comments WHERE task_id = ? ORDER BY created_at DESC`,
      { 
        replacements: [taskId]
      }
    );
    
    console.log('Commentaires récupérés:', comments);
    
    res.status(200).json({
      success: true,
      comments: comments
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des commentaires',
      error: error.message
    });
  }
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Modifiez la route pour des commentaires
app.use('/api/task-comments', taskCommentRoutes);

// Ajoutez une route directe pour les commentaires
app.post('/api/comments', authMiddleware, taskCommentController.createComment);

// Configuration des routes (sans duplication)
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/profile', profileRoutes);

app.use('/api/lists', listRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);


app.post('/api/test-comment', (req, res) => {
  console.log('Test de commentaire reçu :', req.body);
  res.status(200).json({ message: 'Route de test pour commentaire accessible', data: req.body });
});

// Route de test simple
app.get('/api/test', (req, res) => {
  res.json({ message: 'Le serveur fonctionne correctement!' });
});

// Vérifier la connexion à la base de données sans synchronisation
sequelize.authenticate()
  .then(() => console.log('✅ Connexion à la base de données réussie.'))
  .catch(error => console.error('❌ Erreur de connexion à la base de données:', error));

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`));