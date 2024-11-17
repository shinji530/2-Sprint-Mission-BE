import express from 'express';
import { getCommentList, getProductComment, getArticleComment, createProductComment, createArticleComment, patchComment, deleteComment } from '../controllers/commentController.js';

const router = express.Router();

router.get('/comments', getCommentList);
router.get('/products/:productId/comments', getProductComment);
router.get('/articles/:articleId/comments', getArticleComment);
router.post('/products/:productId/comments', createProductComment);
router.post('/articles/:articleId/comments', createArticleComment);
router.patch('/comments/:commentId', patchComment);
router.delete('/comments/:commentId', deleteComment);

export default router;
