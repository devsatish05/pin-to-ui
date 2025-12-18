import { Router } from 'express';
import * as commentController from '../controllers/comment.controller.js';
import { validateComment, validateCommentUpdate } from '../middleware/validation.middleware.js';

const router = Router();

// GET /api/comments?pageUrl={url}
router.get('/', commentController.getCommentsByPage);

// GET /api/comments/:id
router.get('/:id', commentController.getCommentById);

// POST /api/comments
router.post('/', validateComment, commentController.createComment);

// PUT /api/comments/:id
router.put('/:id', validateCommentUpdate, commentController.updateComment);

// DELETE /api/comments/:id
router.delete('/:id', commentController.deleteComment);

export default router;
