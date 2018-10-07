const express = require('express');
const router = express.Router();
const db = require("../db/mysql");
const{ensureAuthenticated} = require("../helpers/auth");

router.get('/', ensureAuthenticated, function(req, res, next) {
    db.getFriendRequests(req.user[0]["id"], (err, results) => {
        if(err) throw err;
        db.countFriends(req.user[0]["id"], (err1, results1) => {
            if(err1) throw err;
            res.render('profiil', {
                friendRequests: results,
                totalFriends: results1[0]["COUNT(*)"]
            });
        });
    });
});

router.post('/accept', ensureAuthenticated, (req, res) => {
    db.changeFriendRequestStatus(req.user[0]["id"], req.body.acceptRequest, 1, (err, results) => {
        if (err) throw err;
        req.flash("success_msg", "Friend request accepted!");
        res.redirect("/profiil");
    });
});

router.post('/decline', ensureAuthenticated, (req, res) => {
    db.changeFriendRequestStatus(req.user[0]["id"], req.body.declineRequest, 2, (err, results) => {
        if (err) throw err;
        req.flash("success_msg", "Friend request declined!");
        res.redirect("/profiil");
    });
});

module.exports = router;