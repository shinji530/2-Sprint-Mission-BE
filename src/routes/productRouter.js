import express from 'express';
import { getProductList, getProduct, createProduct, patchProduct, deleteProduct } from '../controllers/productController';

const router = express.Router();

router.get('/', getProductList);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.patch('/:id', patchProduct);
router.delete('/:id', deleteProduct);

export default router;