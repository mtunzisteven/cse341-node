const mongoose = require('mongoose'); // import mongoose
const Schema = mongoose.Schema; // store schema 

const orderSchema = new Schema({

  products:
    [
      {
        product: {type: Object, required: true},
        quantity: {type: Number, required: true}
      }
    ],
    user: {
      email: {
        type: String,
        required: true
      },
      userId: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
      }
    }
});

// order arg is a name we give to our exported schema | Caps first letter
// this same name is used to create a collection in db | order creates orders, Cat creates cats
module.exports = mongoose.model('Order', orderSchema); // this export connects the model with the schema

// addOrder(){
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
