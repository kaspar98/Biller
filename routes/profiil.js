const express = require('express');
const router = express.Router();
const db = require("../db/mysql");
const {ensureAuthenticated} = require("../helpers/auth");
const path = require("path");
const fs = require("fs");
const script = "../scripts/profiil.js";
const sharp = require("sharp");

router.get('/', ensureAuthenticated, function (req, res, next) {
    db.getFriendRequests(req.user[0]["id"], (err, results) => {
        if (err) console.log(err);

        db.countFriends(req.user[0]["id"], (err1, results1) => {
            if (err) console.log(err);

            var picId = "";

            if (fs.existsSync(path.join(__dirname, '../public/img/' + req.user[0]["id"] + '.png'))) {
                picId = [req.user[0]["id"]]
            }

            res.render('profiil', {
                title: "Sõbrad",
                description: "See leht on sinu profiili vaatamiseks. Siin näed oma sõpru ja uusi sõbrakutseid.",
                keywords: "Biller, profiil, sõbrad, sõbrakutsed",
                friendRequests: results,
                totalFriends: results1[0]["COUNT(*)"],
                script: [script],
                picId: picId
            });
        });
    });
});

router.get('/allfriends', ensureAuthenticated, function (req, res, next) {
    db.getFriends(req.user[0]["id"], (err, results) => {
        if (err) console.log(err);
        res.json({friends: results, msg: "Sõbrad leitud!", status: 200});
    });
});


router.post('/accept', ensureAuthenticated, (req, res) => {
    db.changeFriendRequestStatus(req.user[0]["id"], req.body.acceptRequest, 1, (err, results) => {
        if (err) console.log(err);

        req.flash("success_msg", "Sõbrakutse vastu võetud!");
        res.redirect("/profiil");
    });
});

router.post('/decline', ensureAuthenticated, (req, res) => {
    db.changeFriendRequestStatus(req.user[0]["id"], req.body.declineRequest, 2, (err, results) => {
        if (err) console.log(err);

        req.flash("success_msg", "Sõbrakutsest keeldutud!");
        res.redirect("/profiil");
    });
});

router.post("/upload", ensureAuthenticated, (req, res) => {
    if (!req.files.avatar) {
        req.flash("error_msg", "Lisa fail!");
        res.redirect("/profiil");
    } else {
        var file = req.files.avatar;

        if (file.mimetype != "image/png" && file.mimetype != "image/jpeg") {
            req.flash("error_msg", "Vale failitüüp!");
            res.redirect("/profiil");
        } else {
            sharp(file.data)
                .resize(200, 200)
                .png()
                .toFile(path.join(__dirname, '../public/img/' + req.user[0]["id"] + '.png'),
                    (err) => {
                        if (err) console.log(err);

                        req.flash("success_msg", "Pilt laetud!");
                        res.redirect("/profiil");
                    });

            /*file.mv(path.join(__dirname, '../public/img/' + req.user[0]["id"] + '.png'), function (err) {
                if (err) console.log(err);

                req.flash("success_msg", "Pilt laetud!");
                res.redirect("/profiil");
            });*/
        }
    }
});

router.post("/remove", ensureAuthenticated, (req, res) => {
    if (fs.existsSync(path.join(__dirname, '../public/img/' + req.user[0]["id"] + '.png'))) {
        fs.unlinkSync(path.join(__dirname, '../public/img/' + req.user[0]["id"] + '.png'));

        req.flash("success_msg", "Pilt eemaldatud!");
        res.redirect("/profiil");
    } else {
        req.flash("error_msg", "Pole midagi eemaldada!");
        res.redirect("/profiil");
    }
});

router.post('/delete', ensureAuthenticated, (req, res) => {
    db.deleteAccount(req.user[0]["id"], (err, results) => {
        if (err) console.log(err);

        req.logout();

        req.flash("success_msg", "Kasutaja kustutatud!");
        res.redirect("/");
    });
});

module.exports = router;