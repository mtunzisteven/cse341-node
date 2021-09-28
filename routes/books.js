const path = require('path');

const express = require('express');

const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  const books = adminData.books;
  res.render('books', {
    bks: books,
    pageTitle: 'Books',
    path: '/',
    hasBooks: books.length > 0,
    activeShop: true,
    formsCSS: true,
    productCSS: true
  });
});

module.exports = router;
