const express = require("express");
const exphbs = require("express-handlebars");
const fileUpload = require("express-fileupload");
const path = require("path");
const flash = require('connect-flash');
const bodyParser = require("body-parser");
const session = require('express-session');
const mysql = require("mysql");
const passport = require('passport');
const app = express();

const port = 5000;

// Load routers
const indexRouter = require('./routes/index');
const bilanssRouter = require('./routes/bilanss');
const loginRouter = require('./routes/login');
const profiilRouter = require('./routes/profiil');
const signUpRouter = require('./routes/signup');
const logoutRouter = require('./routes/logout');


// // Andmebaasiga ühenduse loomine
// const db = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '',
//     database : 'Biller'
// });
// db.connect((err) => {
//     if(err){
//         throw err;
//     }
//     console.log("Database Connected")
// });

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
    secret: 'secret',
    resave: true,
    saveUninitialized: true
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

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});