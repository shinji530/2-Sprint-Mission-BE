import productService from '../services/productService';
import asyncHandler from '../middlewares/asyncHandler';
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct } from '../../struct';

export const getProductList = asyncHandler(async (req, res) => {
    const { page = 0, pageSize = 10, orderBy = 'recent', keyword = '' } =req.query;
    
    const products = await productService.get({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        orderBy,
        keyword,
    });

    res.json(products);
});

export const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await productService.getById(id);
    res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
    assert(req.body, CreateProduct);
    const product = await productService.create(req.body);
    res.json(product);
});

export const patchProduct = asyncHandler(async (req, res) => {
    assert(req.body, PatchProduct);
    const { id } = req.params;
    const product = await productService.update(id, req.body);
    res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await productService.remove(id);
    res.json(product);
});
