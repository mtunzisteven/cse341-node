const path = require('path');

const express = require('express'); // import middleware manager 
const bodyParser = require('body-parser'); // import request.body values manager 
const mongoose = require('mongoose'); // import mongodb query manager 
const cors = require('cors')  // import Heroku options manager 
const session = require('express-session'); // import session  manager 
const sessionDBStorage = require('connect-mongodb-session')(session); // function returned instead of the usual object
const csrf = require('csurf'); // import csrf token manager 
const flash = require('connect-flash'); // import session flash message manager 
require('dotenv').config();

const errorController = require('./controllers/error');  // import error controller

const app = express(); // instantiate express middleware manager app


const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGODB_URI;
               
const PORT = process.env.PORT || 3000;

// initialize session storage
// store used to store sessions in the db 
// using constructor fn returned to sessionDBStorage constant above
const store = new sessionDBStorage({
  uri: MONGODB_URL, // the url to the db connection
  collection: 'sessions' // the collection created to store sessions in the db
});

const csrfProtection = csrf(); // using the token as default, through token

// set ejs and views folder
app.set('view engine', 'ejs');
app.set('views', 'views');

// fetch all routes and assign them to constants
const adminRoutes = require('./routes/admin'); 
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth'); 

// get the user model into scope
const User = require('./models/user');

// initialize body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// setup session storage middle ware(storage in the database)
// secret: used for signing the hash that secretly saves the id in a cookie. the value must be a long string in production
// resave: set to false to make sure session is not saved with every request, but on every change
// saveUninitialized: set to false ensures no session is saved where it is not necessary(e.g: nothing changed)
app.use(
  session({ 
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false, 
    store: store  // session db storage const defined above
  })
);

app.use(csrfProtection); // register csrf token after session creation code

app.use(flash()); // register flash token after session creation code

// // find the user in the db
// // if found, we proceed to set user object into each request on the app.
app.use((req, res, next) => {
  if(!req.session.user){
    return next(); // skip code below this if statement in this middleware when user not logged in
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

// middleware to add all enclosed values to views using special express fn: res.locals
app.use((req, res, next) => {

  res.locals.isAuthenticated = req.session.isLoggedIn; // login confirmation using session variable: isLoggedIn
  res.locals.csrfToken = req.csrfToken(); // csrf token provided by csurf package allows only pages with valid token to use site
  next();
});

// get routes into scope for use in app
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// error controller has no route, so is used directly from controller
app.use(errorController.get404);

const corsOptions = {
    origin: "https://aqueous-badlands-04319.herokuapp.com/",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false, 
    family: 4
};


// mongoose will give us the connection. No need for mongoConnect
mongoose
  .connect(
    MONGODB_URL, options
  )
  .then(result => {
    
    // This should be your user handling code implement following the course videos
    User.findOne() // MOngoose fn finds user in users db
    .then(user => {

      // only create a user if there's none found
      if(!user){
        // call user at start of server
        const user = new User({
          name: 'Mtunzi',
          email: 'st.vuma@gmail.com',
          cart: {
            items: []
          }
        });

        // save user in db using mongoose save() fn
        user.save();
    
      }
    })

    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });