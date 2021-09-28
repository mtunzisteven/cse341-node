const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const books = [];

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    booksCSS: true,
    activeAddProduct: true
  });
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
  books.push({ title: req.body.title, price: req.body.price, description: req.body.description, rating: req.body.rating});
  res.redirect('/');
});

// /admin/delete-product => POST
router.post('/delete-product', (req, res, next) => {
  let index = req.body.index; // set index using the index value received from the delete form
  books.splice(index, 1);  // remove the product by index.
  res.redirect('/');
});

exports.routes = router;
exports.books = books;
