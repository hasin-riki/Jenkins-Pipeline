const express = require('express');
const router = express.Router();
const {addProduct, getProductsByCategory, getProduct, updateProduct, deleteProduct}=require('../controllers/productController');

router.post('/products', addProduct);

router.get('/products/categories/:category', getProductsByCategory);

router.get('/products/:productId', getProduct);

router.patch('/products/:productId', updateProduct);

router.delete('/products/:productId', deleteProduct);

module.exports=router;