const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a product schema to let mongoose know how data will look(data definition)
const productSchema = new Schema({
  // title: String gives a version of the title where we can add product without title
  // the versions below ensure that product entered always has the required fields

  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imgUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,  // call schema to describe id type of mongoDb
    ref: 'User', // referes to mongodb id in User model | relation : not used when docs embedded
    required: true
  }

});

// Product arg is a name we give to our exported schema | Caps first letter
// this same name is used to create a collection in db | Product creates products, Cat creates cats
module.exports = mongoose.model('Product', productSchema); // this export connects the model with the schema

// const mongodb = require('mongodb'); // import mogodb
// const getDB = require('../util/database').getDb; // exported using : exports.getDb = getDb;

// class Product {

//   constructor(title, price, description, imgUrl, id, userId){
//     this.title = title;
//     this.imgUrl = imgUrl;
//     this.price = price;
//     this.description = description;
//     this._id = id? new mongodb.ObjectId(id):null; // mongoObjectId creates id if id arg is null or empty. Tenary op corrects that so null id for add prodt remains null
//     this.userId = userId;

//   }

//   // instead of tables, mogodb has collections 
//   // here we specify which to use for the data
//   // if it doesn't exist, one will be created
//   // the first time you insert data
//   // products collection will take documents = (this product being created)
//   // returns a promise, just like fetch
//   save(){

//     const db = getDB(); // get db connection

//     let dbOp; // operation path selector

//     if(this._id){ // update existing prod

//       dbOp = db.collection('products')
//       .updateOne({_id : this._id}, {$set: this}); // select pro with _id = this._id and update all properties

//     }else{ // insert for new prod

//       dbOp = db.collection('products')
//       .insertOne(this);

//     }

//     return dbOp
    
//     .then(result => {
//       console.log(result);
//     })
//     .catch(err => {
//       console.log(err);
//     })

//   }

//   static findById(id){

//     const db = getDB(); // get db connection

//     // find() returns handle, not the entire collection.
//     // find({title: boom}) returns products with title boom works in conjunction with next, otherwise cursor returned
//     // find().toArray() returns all items. Use only if few items in collection
//     return db.collection('products').find({_id:new mongodb.ObjectId(id)}).next()
//     .then(product => {

//       console.log(product);
//       return product; 

//     })
//     .catch(err => {

//       console.log(err);

//     })

//   }

//   static fetchAll(){

//     const db = getDB(); // get db connection

//     // find() returns handle, not the entire collection.
//     // find({title: boom}) returns products with title boom
//     // find().toArray() returns all items. Use only if few items in collection
//     return db.collection('products').find().toArray()
//     .then(products => {

//       console.log(products);
//       return products;

//     })
//     .catch(err => {

//       console.log(err);

//     })

//   }

//   static deleteById(id){

//     const db = getDB(); // get db connection

//     return db
//     .collection('products')
//     .deleteOne({_id:new mongodb.ObjectId(id)})
//     .then(result => {

//       console.log('Delete Successfully!');

//     })
//     .catch(err => {

//       console.log(err);

//     })

//   }

// }

// module.exports = Product;
