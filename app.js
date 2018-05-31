require('dotenv').config();
require('./configs/passport-config');

const bodyParser      = require('body-parser');
const cookieParser    = require('cookie-parser');
const express         = require('express');
const favicon         = require('serve-favicon');
const hbs             = require('hbs');
const mongoose        = require('mongoose');
const logger          = require('morgan');
const path            = require('path');
const session         = require("express-session");
const bcrypt          = require("bcrypt");
const passport        = require("passport");
const LocalStrategy   = require("passport-local").Strategy;
const User            = require('./models/user');
// const Product         = require("../models/product");
// const Cart            = require('../models/cart')
const flash           = require("connect-flash");
const GoogleStrategy  = require("passport-google-oauth").OAuth2Strategy;
const cors            = require('cors')  
const app = express();


mongoose.Promise = Promise;
mongoose
.connect(process.env.MONGODB_URI)
  // .connect('mongodb://localhost/express-server-the-final-project', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);


// Middleware Setup
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200']
}))

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// default value for title local
app.locals.title = "Tripple C'z";

const index = require('./routes/index');
app.use('/', index);

const authRoutes = require("./routes/auth-routes");
app.use('/api', authRoutes)

const productRoutes = require("./routes/product");
app.use('/product', productRoutes)

const cartRoutes = require('./routes/cart-routes');
app.use('/api', cartRoutes);

app.use((req, res, next) => {
  // If no routes match, send them the Angular HTML.
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;
