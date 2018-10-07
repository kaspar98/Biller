const express = require('express');
const router = express.Router();
const passport = require("passport");

// Passport config
require("../config/passport")(passport);

router.get('/', (req, res, next) => {
    res.render('login');
});

router.post("/", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true, successFlash: "Welcome!"}),
    (req, res, next) => {
    res.redirect(req.session.returnTo || '/');
    delete req.session.returnTo;
});

router.get('/google', passport.authenticate("google",
    {scope: ["profile", "email"]}));

router.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect:
            "/login"
    }),
    (req, res) => {
        res.redirect(req.session.returnTo || '/');
        delete req.session.returnTo;
    });

module.exports = router;