const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors') 


const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin'); 
const shopRoutes = require('./routes/shop');
const User = require('./models/user');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById('616b9dbf15b4a69e7d148a59')
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const corsOptions = {
    origin: "https://aqueous-badlands-04319.herokuapp.com/",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://mtunzi:MongoDBJune2021.@firstcluster21.ik5m1.mongodb.net/shop?retryWrites=true&w=majority";
               
const PORT = process.env.PORT || 3000;

// mongoose will give us the connection. No need for mongoConnect
mongoose
  .connect(
    MONGODB_URL, options
  )
  .then(result => {
    
    // This should be your user handling code implement following the course videos
    User.findById('616b9dbf15b4a69e7d148a59')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));

    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });