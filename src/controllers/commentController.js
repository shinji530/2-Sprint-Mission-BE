import commentService from '../services/commentService';
import asyncHandler from '../middlewares/asyncHandler';
import { assert } from 'superstruct';
import { CreateComment, PatchComment } from '../../struct';

export const getCommentList = asyncHandler(async (req, res) => {
    const { cursor } = req.query;
    const comments = await commentService.get({ cursor: cursor, take, skip });
    res.json(comments);
});

export const getProductComment = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { cursor } = req.query;
    const comments = await commentService.get({ productId, cursor: cursor, take, skip });
    res.json(comments);
});

export const getArticleComment = asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const { cursor } = req.query;
    const comments = await commentService.get({ articleId, cursor: cursor, take, skip });
    res.json(comments);
});

export const createProductComment = asyncHandler(async (req, res) => {
    assert(req.body, CreateComment);
    const { content, productId } = req.body;
    const comment = await commentService.create({ content, productId });
    res.json(comment);
});

export const createArticleComment = asyncHandler(async (req, res) => {
    assert(req.body, CreateComment);
    const { content, articleId } = req.body;
    const comment = await commentService.create({ content, articleId });
    res.json(comment);
});

export const patchComment = asyncHandler(async (req, res) => {
    assert(req.body, PatchComment);
    const { id } = req.params;
    const comment = await commentService.update(id, req.body);
    res.json(comment);
});

export const deleteComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comment = await commentService.remove(id);
    res.json(comment);
});
