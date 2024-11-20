import articleService from '../services/articleService';
import asyncHandler from '../middlewares/asyncHandler';
import { assert } from 'superstruct';
import { CreateArticle, PatchArticle } from '../../struct';

export const getArticleList = asyncHandler(async (req, res) => {
    const { page = 0, pageSize = 10, orderBy = 'recent', keyword = '' } = req.query;
    
    const articles = await articleService.get({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        orderBy,
        keyword,
    });

    res.json(articles);
});

export const getArticle = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await articleService.getById(id);
    res.json(article);
});

export const createArticle = asyncHandler(async (req, res) => {
    assert(req.body, CreateArticle);
    const article = await articleService.create(req.body);
    res.json(article);
});

export const patchArticle = asyncHandler(async (req, res) => {
    assert(req.body, PatchArticle);
    const { id } = req.params;
    const article = await articleService.update(id, req.body);
    res.json(article);
});

export const deleteArticle = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await articleService.remove(id);
    res.json(article);
});
