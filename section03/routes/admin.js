// Here we register our pages from the views folder 
// Our perspective is from the routes folder: "/...""
// we get our actual redirections and paths in the admin controller

const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.addProduct);

// /admin/add-product => POST
router.post('/add-product', adminController.postProduct);

// /admin/products => GET
router.get('/products', adminController.getAdminProducts);

// /admin/edit-products => GET
router.get('/edit-product', adminController.getEditProduct);

module.exports = router;
