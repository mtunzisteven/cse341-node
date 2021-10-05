// The logic of the app admin views and data connection
// we save data, fetch it and specify ejs files to render
const Products = require('../models/product');

exports.addProduct = (req, res, next) => {
    res.render('admin/add-product', { // the ejs file to render
      pageTitle: 'Add Product', // the title of the ejs file to render
      path: '/admin/add-product', // the path entered on url
    });
};

exports.postProduct =(req, res, next) => {
    const title = req.body.title;
    const imgUrl = req.body.imgUrl; 
    const price = req.body.price;
    const description = req.body.description;
    const product = new Products(title, imgUrl, price, description); // we store the product object in a constant product 
    product.save();  // save that product in the storage created for products
    res.redirect('/product-list'); // the path redirecting to on url
};

exports.getAdminProducts = (req, res, next) => {
  Products.fetchAll(products => { // in fetchAll, products passed as empty variable(cb). It eventually is loaded with array of products
    res.render('admin/products', { // open admin products page
    prods: products, // put products array into prods
    pageTitle: 'Products',  // the title of the ejs file to render
    path: '/admin/products', // the path entered on url
  });
});
};

exports.getEditProduct = (req, res, next) => {
  res.render('admin/edit-product', { // the ejs file to render
    pageTitle: 'Edit Product', // the title of the ejs file to render
    path: '/admin/edit-product', // the path entered on url
  });
};