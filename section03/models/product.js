const fs = require('fs');
const path = require('path');

// define file storage path to be used in data saving and data retrieval
const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', // data folder where we stored our JSON
    'products.json' // the actual JSON file we're writing data into / this could be an http path to an online resource
    ); // getting the data folder 

module.exports = class Product{ // the class we'll export

    // title is what stands for product in our code
    constructor(title, imgUrl, price, description){
        this.title = title;
        this.imgUrl = imgUrl;
        this.description = description;
        this.price = price;
    }

    save(){

            fs.readFile(p, (err, fileContent)=>{ // arrow function helps this in this fn point to object
                let products = []; // define array for products
                if(!err){  // null if error does not exist
                    products = JSON.parse(fileContent); // takes incoming JSON into array
                }
                products.push(this); // adding the created object to the products array

                fs.writeFile(p, JSON.stringify(products), err =>{ // storing that list inside p from above, which is a JSON file
                    console.log(err);
                })

            });
    }

    static fetchAll(cb){ // cb : callback to call callback arrow fn below. 

        fs.readFile(p, (err, fileContent)=>{ // The arrow fun is registered and fetch returns nothing. We need to call back the arrow fn to have it return someting
            if(err){

                return cb([]); // empty array returned if there's an error

            }else{

                cb(JSON.parse(fileContent)); // when no error and content retrieval complete, the array format of JSON returned

            }

        })
    }
}