const express = require('express');
const router = express.Router();
const db = require("../db/mysql");
const {ensureAuthenticated} = require("../helpers/auth");
const script = "../scripts/profiil.js";

router.get('/', ensureAuthenticated, function (req, res, next) {
    db.getFriendRequests(req.user[0]["id"], (err, results) => {
        if (err) throw err;
        db.countFriends(req.user[0]["id"], (err1, results1) => {
            if (err1) throw err;
            res.render('profiil', {
                title: "Sõbrad",
                description: "See leht on sinu profiili vaatamiseks. Siin näed oma sõpru ja uusi sõbrakutseid.",
                keywords: "Biller, profiil, sõbrad, sõbrakutsed",
                friendRequests: results,
                totalFriends: results1[0]["COUNT(*)"],
                script: script
            });
        });
    });
});

router.get('/allfriends', ensureAuthenticated, function (req, res, next) {
    db.getFriends(req.user[0]["id"], (err, results) => {
        if (err) throw err;
        res.json({friends:results, msg: "Sõbrad leitud!", status: 200});
    });
});


router.post('/accept', ensureAuthenticated, (req, res) => {
    db.changeFriendRequestStatus(req.user[0]["id"], req.body.acceptRequest, 1, (err, results) => {
        if (err) throw err;
        req.flash("success_msg", "Sõbrakutse vastu võetud!");
        res.redirect("/profiil");
    });
});

router.post('/decline', ensureAuthenticated, (req, res) => {
    db.changeFriendRequestStatus(req.user[0]["id"], req.body.declineRequest, 2, (err, results) => {
        if (err) throw err;
        req.flash("success_msg", "Sõbrakutsest keeldutud!");
        res.redirect("/profiil");
    });
});

module.exports = router;