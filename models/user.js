const mongoose = require('mongoose'); // import mongoose
const Schema = mongoose.Schema; // store schema 

const userSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                product: {type: Schema.Types.ObjectId, ref: 'Product', required: true}, // call schema to describe id type of mongoDb in User model | relation : not used when docs embedded
                quantity: {type: Number, required: true}
            }
        ]
    }
});

// methods key allows us to add our own methods to defined user schema : userSchema
// has to be written as bellow so that 'this' keyword still refers to schema
userSchema.methods.addToCart = function(product){

    const cartProductIndex = this.cart.items.findIndex(cp => { // this.cart still refers to the one defined in the userSchema
      // returns cart item index if product beong added already exists in the cart
      // returns -1 if the product does not exist
      // productId is how we save product ids in data base | cp.'product' is from 'ref: Product' above
      return cp.product.toString() === product._id.toString(); 
    });

    let newQuantity = 1; // clicking add to cart adds one item
    const updatedCartItems = [...this.cart.items];  // created a new ref array we can edit without editing cart array

    if(cartProductIndex >= 0){ 

      let newCartQuantity = this.cart.items[cartProductIndex].quantity + newQuantity;  // increment cart product qty
      updatedCartItems[cartProductIndex].quantity = newCartQuantity;  // add the incremented qty to ref cart array

    }else{ // or just add the cart item into cart ref array

      updatedCartItems.push({
        product: product._id, // 'product' is from 'ref: Product' above
        quantity: newQuantity
      });

    }

    const updatedCart = {
      items: updatedCartItems
    } // adding new cart id and new product qty to cart 

    this.cart = updatedCart;

    return this.save();
}

// methods key allows us to add our own methods to defined user schema : userSchema
// has to be written as bellow so that 'this' keyword still refers to schema
userSchema.methods.deleteCartItem = function(productId){

    const updatedCartItems = this.cart.items.filter(item => {
      return item.product.toString() !== productId.toString(); // item.'product' is from 'ref: Product' above
    });

    this.cart.items = updatedCartItems;
    return this.save();

}

// methods key allows us to add our own methods to defined user schema : userSchema
// has to be written as bellow so that 'this' keyword still refers to schema
userSchema.methods.clearCart = function(product){

    this.cart = {items:[]}; //empty cart

    return this.save(); // save empty cart
}

// User arg is a name we give to our exported schema | Caps first letter
// this same name is used to create a collection in db | User creates products, Cat creates cats
module.exports = mongoose.model('User', userSchema); // this export connects the model with the schema

// // const getDB = require('../util/database').getDb; // exported using : exports.getDb = getDb;

// class User{

//   constructor(username, email, id, cart){
//     this.username = username;
//     this.email = email;
//     this._id = id? new mongodb.ObjectId(id): null;
//     this.cart = cart; // looks like this: {items: []}

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

//     if(this._id){ // update existing user

//       dbOp = db.collection('users')
//       .updateOne({_id : this._id}, {$set: this}); // select user with _id = this._id and update all properties

//     }else{ // insert for new user

//       dbOp = db.collection('users')
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

//   addToCart(product){

//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       // returns cart item index if product beong added already exists in the cart
//       // returns -1 if the product does not exist
//       // productId is how we save product ids in data base
//       return cp.productId.toString() === product._id.toString(); 
//     });

//     let newQuantity = 1; // clicking add to cart adds one item
//     const updatedCartItems = [...this.cart.items];  // created a new ref array we can edit without editing cart array

//     if(cartProductIndex >= 0){ 

//       let newCartQuantity = this.cart.items[cartProductIndex].quantity + newQuantity;  // increment cart product qty
//       updatedCartItems[cartProductIndex].quantity = newCartQuantity;  // add the incremented qty to ref cart array

//     }else{ // or just add the cart item into cart ref array

//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id), 
//         quantity: newQuantity
//       });

//     }

//     const updatedCart = {
//       items: updatedCartItems
//     } // adding new cart id and new product qty to cart 

//     const db = getDB(); // get db connection

//     return db
//     .collection('users')
//     .updateOne(
//       {_id : this._id}, 
//       {$set: {cart:updatedCart}
//     }) // select user with _id = this._id and update cart with new cart(replace)

//     .then(result => {
//       console.log(result);
//     })
//     .catch(err => {
//       console.log(err);
//     })
//   }

//   getCart(){
//     const db = getDB(); // get db connection

//     // get product ids from cart items into array using map function
//     const productIds = this.cart.items.map(item => {
//       return item.productId;
//     });

//     // get cart products info from db using product ids obtained from the cart
//     return db
//     .collection('products')
//     .find({_id: {$in: productIds}}) // fetch all products that have ids that match those found in the productIds array
//     .toArray()                      // all returned products added to array instead of cursor being returned
//     .then(products => {

//       return products.map(product => {                                   // return an array 

//         return {                                                         // of objects with product info array and
//           ...product,
//           quantity: this.cart.items.find(item => {                       // ------------------------------------->>
//                                                                          //                                       |
//             return item.productId.toString() === product._id.toString(); // quantity for that product             |
//           }).quantity                                                    // <<-------------------------------------
//         };
//       });
//     }) ;

//   }
  
//   static findById(id){

//     const db = getDB(); // get db connection

//     // find() returns handle, not the entire collection.
//     // find({title: boom}) returns products with title boom works in conjunction with next, otherwise cursor returned
//     // find().toArray() returns all items. Use only if few items in collection
//     return db.collection('users').findOne({_id:new mongodb.ObjectId(id)})
//     .then(user => {

//       console.log(user);
//       return user; 

//     })
//     .catch(err => {

//       console.log(err);

//     })

//   }

//   deleteCartItem(id){
    
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== id.toString();
//     });

//     const db = getDB(); // get db connection
//     return db
//     .collection('users')
//     .updateOne(
//       {_id : this._id}, 
//       {$set: {cart: {items: updatedCartItems}}
//     }) // select user with _id = this._id and update cart items in cart with new items(replace)

//   }

//   addOrder(){
//     const db = getDB(); // get db connection

//     return this.getCart()
//     .then(products => {

//       const order = {
//         items: products,
//         user: {
//           _id:  this._id,
//           name: this.username,
//           email: this.email
//         }
//       };

      
//       db
//       .collection('orders')
//       .insertOne(order)               // add cart of the current user into an order collection
//       .then(result =>{
//         this.cart = {items: []};          // empty current cart

//         return db
//         .collection('users')
//         .updateOne(
//           {_id: this._id},
//           {$set: {cart: {items: []}}}     // empty cart in the databse
//         );
//       });

//     });
//   }

//   getOrders(){
    
//     const db = getDB(); // get db connection

//     return db
//     .collection('orders')
//     .find({'user._id': this._id}) // fetch order that has id that matches those found in the user ids. path to nested _id: 'user._id'
//     .toArray()
//   }

// }

// module.exports = User;
