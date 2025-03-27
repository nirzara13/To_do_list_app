





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

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Configuration des routes principales
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);

// Routes pour les commentaires - montées avec le préfixe /api/task-comments
app.use('/api/task-comments', taskCommentRoutes);

// Routes additionnelles pour la compatibilité avec le frontend - utilisent les contrôleurs existants
app.get('/api/tasks/:task_id/comments', authMiddleware, taskCommentController.getTaskComments);
app.post('/api/tasks/comments', authMiddleware, taskCommentController.createComment);
app.post('/api/comments', authMiddleware, taskCommentController.createComment);

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