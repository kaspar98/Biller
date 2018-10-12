const express = require('express');
const router = express.Router();
const passport = require("passport");

// Passport config
require("../config/passport")(passport);

router.get('/', (req, res, next) => {
    res.render('login', {
        title: "Logi sisse",
        description: "See leht on sisse logimiseks. Siin võid sisse logida oma emaili ja parooli või google kontoga.",
        keywords: "Biller, logi sisse, google",
    });
});

router.post("/", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true, successFlash: "Tere!"}),
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