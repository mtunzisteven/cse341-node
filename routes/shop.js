const path = require('path');

const express = require('express');

const productController = require('../controllers/shop'); // import products controller

const router = express.Router();

// path is the one used to access ejs on link href.
router.get('/', productController.getIndex);
router.get('/products', productController.getProducts);
router.get('/products/:productId', productController.getProduct);
router.get('/cart', productController.getCart);
router.post('/cart', productController.postCart);
router.post('/delete-cart-product', productController.postDeleteCart);
router.get('/checkout', productController.getCheckout);
router.get('/orders', productController.getOrders);



module.exports = router;
