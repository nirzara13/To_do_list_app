// routes/taskCommentRoutes.js
const express = require('express');
const router = express.Router();
const taskCommentController = require('../controllers/taskCommentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, taskCommentController.createComment);
router.get('/:task_id', authMiddleware, taskCommentController.getTaskComments);

module.exports = router;