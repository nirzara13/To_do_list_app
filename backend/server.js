// // backend/server.js
// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();  // Charge les variables d'environnement depuis le fichier .env
// const { Pool } = require('pg');  // Utilisation de pg pour la connexion à PostgreSQL

// // Configuration de la connexion PostgreSQL via Pool
// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// });

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());  // Middleware pour analyser le corps des requêtes en JSON

// // Route d'accueil
// app.get('/', (req, res) => {
//     res.send('Bienvenue sur le backend de App-Sondage');
// });

// // Test de la connexion à la base de données
// app.get('/test-db', async (req, res) => {
//     try {
//         const result = await pool.query('SELECT NOW()');
//         res.send(result.rows);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Erreur de connexion à la base de données');
//     }
// });

// // Route POST pour ajouter un sondage
// app.post('/api/sondages', async (req, res) => {
//     const { title, description } = req.body;  // Récupère les données du sondage à partir du corps de la requête

//     try {
//         const result = await pool.query(
//             'INSERT INTO sondages (title, description) VALUES ($1, $2) RETURNING *', 
//             [title, description]
//         );
//         res.status(201).json(result.rows[0]);  // Retourne le sondage créé
//     } catch (err) {
//         console.error('Erreur d\'insertion du sondage', err);
//         res.status(500).send('Erreur d\'insertion du sondage');
//     }
// });

// // Lancer le serveur sur le port spécifié
// app.listen(PORT, () => {
//     console.log(`Serveur démarré sur le port ${PORT}`);
// });

// // Importer et utiliser le routeur pour les sondages
// const sondagesRouter = require('./routes/survey');
// app.use('/api/sondages', sondagesRouter);





// Ajouter au début de server.js, avant les routes
// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/users');
// Ajoutez cette ligne pour le nouveau fichier de routes
const profileRoutes = require('./routes/profileRoutes');
// Ajoutez cette ligne
const taskCommentRoutes = require('./routes/taskCommentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/tasks', taskRoutes);
// Ajoutez cette ligne pour configurer les nouvelles routes
app.use('/api/profile', profileRoutes);
app.use('/api/task-comments', taskCommentRoutes);
app.use('/api/categories', categoryRoutes);

// Route de test simple pour vérifier que le serveur fonctionne
app.get('/api/test', (req, res) => {
  res.json({ message: 'Le serveur fonctionne correctement!' });
});

sequelize.sync({ alter: true })
  .then(() => console.log('✅ Base de données synchronisée'))
  .catch(error => console.error('❌ Erreur de synchronisation:', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`));