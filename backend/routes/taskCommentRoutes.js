// // routes/taskCommentRoutes.js
// const express = require('express');
// const router = express.Router();
// const taskCommentController = require('../controllers/taskCommentController');
// const authMiddleware = require('../middleware/authMiddleware');

// router.post('/', authMiddleware, taskCommentController.createComment);
// router.get('/:task_id', authMiddleware, taskCommentController.getTaskComments);

// module.exports = router;



const express = require('express');
const router = express.Router();
const taskCommentController = require('../controllers/taskCommentController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes pour les commentaires - utilisent les modèles
router.post('/tasks/comments', authMiddleware, taskCommentController.createComment);
router.get('/tasks/:task_id/comments', authMiddleware, taskCommentController.getTaskComments);
router.put('/comments/:id', authMiddleware, taskCommentController.updateComment);
router.delete('/comments/:id', authMiddleware, taskCommentController.deleteComment);

module.exports = router;