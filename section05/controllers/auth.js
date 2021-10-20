const bcrypt = require('bcryptjs');

// include sendiblue email package--------------------------------------------------------------------------------------||
var SibApiV3Sdk = require('sib-api-v3-sdk');

// enter my api key
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = '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'; 
//-----------------------------------------------------------------------------------------------------------------------||

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.flash('loginError') // send flash message for signup error to ../views/auth/login.ejs page for display in div
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
    .then(user => {
        
        if(!user){
            req.flash('loginError', 'Invalid email or password.');  // create flash message for login error
            return res.redirect('/login');
        }

        bcrypt
        .compare(password, user.password) // compare entered password with mongodb user password using bcrypt
        .then(passwordsMatch => {

            if(passwordsMatch){

                req.session.isLoggedIn = true; // stores isLoggedIn session variable in mongo db
                req.session.user = user; // stores user session variable in mongo db
                return req.session.save(err => { // save() required to ensure the session is saved before the redirect is carried out.
                    
                    if(err){
                        req.flash('loginError', 'Internal error, please try again.');  // create flash message for login error
                        console.log(err);
                    }
                    res.redirect('/'); // go to home page if passwords matched

                });
            }
            req.flash('loginError', 'Invalid email or password.');  // create flash message for login error
            res.redirect('/login'); // go to signin page if passwords don't match
        });

    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    // clear session from mongodb
    req.session.destroy(err =>{
                    
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
};


exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: req.flash('signupError'), // send flash message for signup error to ../views/auth/signup.ejs page for display in div
      isAuthenticated: false
    });
  };


  exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if(password !== confirmPassword){
        req.flash('signupError', 'Passwords do not match.'); // create flash message for signup error
        return res.redirect('/signup'); // got to sign up page if passwords don't match
    }

    User.findOne({email: email}) // find a user document with email on the right, defined above.
    .then(userDoc => {
        if(userDoc){
            req.flash('signupError', 'Email already exists.'); // create flash message for signup error
            return res.redirect('/signup'); // get out of function and redirect to sign up page if user email exists
        }
        return bcrypt
        .hash(password, 12) // return promise with hashed passwrd in order to add another then block where we'll create user
        .then(hashedPassword => {

            // if no matching email was found, you can create the new user
            const user = new User({ 
                email: email,
                password: hashedPassword, // password to supply to user is hashed
                cart: { items:[]}
            });

            // Create email using sendiblue
            new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
                {
                  'subject':'Hello from the Node SDK!',
                  'sender' : {'email':'st.vuma@gmail.com', 'name':'Steven'},
                  'replyTo' : {'email': 'mtunzi@sikhosim.co.za', 'name':'Mtunzi'},
                  'to' : [{'name': 'John Doe', 'email': email}],
                  'htmlContent' : '<html><body><h1>This is a transactional email {{params.bodyMessage}}</h1></body></html>',
                  'params' : {'bodyMessage':'Made just for you!'}
                }
              ).then(function(data) {
                console.log(data);
              }, function(error) {
                console.error(error);
              });

            return user.save(); // save user to mongodb
     
        })
        .then(result =>{
              res.redirect('/login');
        })
    })

    .catch(err => {
          console.log(err)
    })
};