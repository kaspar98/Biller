const express = require("express");
const exphbs = require("express-handlebars");
const fileUpload = require("express-fileupload");
const path = require("path");
const flash = require('connect-flash');
const bodyParser = require("body-parser");
const env = require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
var http = require('http');
const https = require("https");
const fs = require("fs");
const browser = require('browser-detect');
const db = require("./db/mysql");
const app = express();
const serveStatic = require("serve-static");

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
const statsRouter = require('./routes/statistics');

// Handlebars Middleware
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Bodyparser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // parse form data client

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Fileupload
app.use(fileUpload());

// Express session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Express static (backup)
/*app.use(express.static(__dirname + "/public/!*", {
    maxAge: "1d"
}));*/

// Serve static
app.get(["/css/*", "/scripts/*"], express.static("public", {maxAge:86400000}));

function setCustomCacheControl(res, path) {
    if (serveStatic.mime.lookup(path) === "text/html") {
        res.setHeader("Cache-Control", "public, max-age=0")
    }
}

app.use(serveStatic(path.join(__dirname, "/public/css/"), {
    maxAge: "1d",
    setHeaders: setCustomCacheControl
}));

app.use(serveStatic(path.join(__dirname, "/public/scripts/"), {
    maxAge: "1d",
    setHeaders: setCustomCacheControl
}));


// Statistika kogumine sessiooni käivitamisel
app.use(function (req, res, next) {
    if (!req.session.begin) {
        req.session.begin = true;

        var currentdate = new Date();
        var date = currentdate.getFullYear() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getDate();
        var time = currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        var currentBrowser = browser(req.headers['user-agent']);
        var clientBrowser = currentBrowser["name"];
        var os = currentBrowser["os"];

        db.addStatistics(fullUrl, time, date, clientBrowser, os, (err, result) => {
            if (err) throw err;
            next()
        });
    } else {
        next();
    }
});

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
app.use('/statistics', statsRouter);

db.init();

const options = {
    key: fs.readFileSync('./config/certificates/client-key.pem'),
    cert: fs.readFileSync('./config/certificates/client-cert.pem'),
    passphrase: process.env.PASSPHRASE,
};


http.createServer(app).listen(port);


// https.createServer(options, app).listen(port);
/*
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});*/
