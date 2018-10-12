const express = require("express");
const exphbs = require("express-handlebars");
const fileUpload = require("express-fileupload");
const path = require("path");
const flash = require('connect-flash');
const bodyParser = require("body-parser");
const env = require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const db = require("./db/mysql");
const app = express();

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 5000;

// Load routers
const indexRouter = require('./routes/index');
const bilanssRouter = require('./routes/bilanss');
const loginRouter = require('./routes/login');
const profiilRouter = require('./routes/profiil');
const signUpRouter = require('./routes/signup');
const logoutRouter = require('./routes/logout');
const addRouter = require('./routes/add');
const testRouter = require('./routes/test');

// Handlebars Middleware
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Fileupload
app.use(fileUpload());

// Express session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Routers in use
app.use('/', indexRouter);
app.use('/bilanss', bilanssRouter);
app.use('/profiil', profiilRouter);
app.use('/login', loginRouter);
app.use('/signup', signUpRouter);
app.use('/logout', logoutRouter);
app.use('/add', addRouter);
app.use('/test', testRouter);

db.init();

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});