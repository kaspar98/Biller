const express = require('express');
const router = express.Router();
const passport = require("passport");

// Passport config
require("../config/passport")(passport);

router.get('/', function (req, res, next) {
    res.render('login');
});

router.post("/", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Welcome!"
    })
);

router.get('/google', passport.authenticate("google",
    {scope: ["profile", "email"]}));

router.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect:
            "/login"
    }),
    (req, res) => {
        res.redirect("/");
    });

module.exports = router;