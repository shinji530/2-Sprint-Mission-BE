import express from 'express';
import { getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from '../controllers/articleController';

const router = express.Router();

router.get('/', getArticleList);
router.get('/:id', getArticle);
router.post('/', createArticle);
router.patch('/:id', patchArticle);
router.delete('/:id', deleteArticle);

export default router;