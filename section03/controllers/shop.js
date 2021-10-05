const Products = require('../models/product');

exports.getCart = (req, res, next) => {
    Products.fetchAll(products => { // in fetchAll, products passed as empty variable(cb). It eventually is loaded with array of products
      res.render('shop/cart', { // open cart page
      prods: products, // put products array into prods
      pageTitle: 'Cart',  // the title of the ejs file to render
      path: '/cart', // the path entered on url
    });
  });
  };

exports.getShop = (req, res, next) => {
    Products.fetchAll(products => { // in fetchAll, products passed as empty variable(cb). It eventually is loaded with array of products
      res.render('shop/product-list', { // open shop page
      prods: products, // put products array into prods
      pageTitle: 'Shop',  // the title of the ejs file to render
      path: '/product-list', // the path entered on url
    });
  });
  };

  exports.getCheckout = (req, res, next) => {
      res.render('shop/checkout', { // open checkout page
      pageTitle: 'Checkout',  // the title of the ejs file to render
      path: '/checkout', // the path entered on url
    });
  };

  exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { // open orders page
    pageTitle: 'Orders',  // the title of the ejs file to render
    path: '/orders', // the path entered on url
  });
}; 

  exports.getIndex = (req, res, next) => {
    Products.fetchAll(products => { // in fetchAll, products passed as empty variable(cb). It eventually is loaded with array of products
      res.render('index', { // open index page
      prods: products, // put products array into prods
      pageTitle: 'Home',  // the title of the ejs file to render
      path: '/', // the path entered on url
    });
  });
};