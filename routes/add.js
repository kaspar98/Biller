const express = require('express');
const router = express.Router();
const db = require("../db/mysql");
const {ensureAuthenticated} = require("../helpers/auth");

/*router.get('/', (req, res, next) => {
    res.render('add', {
        title: "Tulemused",
        description: "See leht on sõprade otsimiseks. Siin saad otsingust leitud sõpru lisada.",
        keywords: "Biller, otsing, tulemused, sõbrad, sõber, lisamine"
    });
});*/

router.post('/', ensureAuthenticated, (req, res) => {
    let jupid = req.body.findName.split(" ");
    let last = jupid[jupid.length - 1];
    let first = jupid.join(" ").replace(" " + last, "");
    db.getUserByName(first, last, req.user[0]["id"], (err, results) => {
        for (i = 0; i < results.length; i++) {
            if (results[i]["id"] == req.user[0]["id"]) {
                results.splice(i, 1);
            }
        }
        res.render('add', {
            userFound: results
        });

    })
});

router.post('/added', ensureAuthenticated, (req, res) => {
    db.addFriend(req.user[0]["id"], req.body.addFriend, (err, results) => {
        if (err) throw err;
        req.flash("success_msg", "Sõbrakutse saadetud!");
        res.redirect("/");
    });
});

module.exports = router;