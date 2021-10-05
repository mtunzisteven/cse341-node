const path = require('path');

const express = require('express');

const productController = require('../controllers/shop'); // import products controller

const router = express.Router();

router.get('/', productController.getIndex);
router.get('/product-list', productController.getShop);
router.get('/cart', productController.getCart);
router.get('/checkout', productController.getCheckout);
router.get('/orders', productController.getOrders);



module.exports = router;
