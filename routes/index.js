const express = require('express');
const router = express.Router();
const db = require("../db/mysql");
const {ensureAuthenticated} = require("../helpers/auth");
const script = "../scripts/index.js";

router.get('/', function (req, res) {
    var myEvents = [];
    var otherEventsConfirmed = [];
    var otherEventsUnconfirmed = [];
    if (req.isAuthenticated()) {
        // Leiame kõik sündmused, mis sisaldavad juba võlgnikke
        db.getEvents(req.user[0]["id"], (err, results) => {
            if (err) console.log(err);
            for (i = 0; i < results.length; i++) {
                if (results[i]["creatorId"] == req.user[0]["id"]) {
                    if (!myEvents[results[i]["eventId"]]) {
                        myEvents[results[i]["eventId"]] = []
                    }
                    myEvents[results[i]["eventId"]].push(results[i]);
                } else {
                    if (results[i]["confirmed"] == 0) {
                        if (!otherEventsUnconfirmed[results[i]["eventId"]]) {
                            otherEventsUnconfirmed[results[i]["eventId"]] = []
                        }
                        otherEventsUnconfirmed[results[i]["eventId"]].push(results[i]);
                    } else if (results[i]["confirmed"] == 1) {
                        if (!otherEventsConfirmed[results[i]["eventId"]]) {
                            otherEventsConfirmed[results[i]["eventId"]] = []
                        }
                        otherEventsConfirmed[results[i]["eventId"]].push(results[i]);
                    }
                }
            }

            // Leiame ka need sündmused, mis ei sisalda veel võlgnikke
            db.getEmptyEvents(req.user[0]["id"], (err, results1) => {
                if (err) console.log(err);
                for (i = 0; i < results1.length; i++) {
                    myEvents[results1[i]["eventId"]] = [];
                    myEvents[results1[i]["eventId"]].push(results1[i]);
                }
                res.render('index', {
                    title: "Biller - rahaasjad korda!",
                    description: "See on sinu avaleht. Sisselogitult saad luua uusi sündmusi, vaadata kinnitamata" +
                        " sündmusi, enda loodud sündmusi ja kinnitatud sündmusi.",
                    keywords: "Biller, avaleht, uus sündmus, kinnita, sündmus, raha, võlg, uus",
                    myEvents: myEvents,
                    otherEventsConfirmed: otherEventsConfirmed,
                    otherEventsUnconfirmed: otherEventsUnconfirmed,
                    script: [script]
                });
            })
        });
    } else {
        res.render('index', {
            title: "Biller - rahaasjad korda!",
            description: "See on sinu avaleht. Sisselogitult saad luua uusi sündmusi, vaadata kinnitamata" +
                " sündmusi, enda loodud sündmusi ja kinnitatud sündmusi.",
            keywords: "Biller, avaleht, uus sündmus, kinnita, sündmus, raha, võlg, uus",
            myEvents: myEvents,
            otherEventsConfirmed: otherEventsConfirmed,
            otherEventsUnconfirmed: otherEventsUnconfirmed,
        });
    }
});

router.post('/addevent', ensureAuthenticated, (req, res) => {
    db.addEvent(req.body.title, req.body.eventDescription, req.user[0]["id"], (err, results) => {
        if (req.xhr || req.headers["content-type"] == 'application/json') {
            if (err) {
                res.send(JSON.stringify({msg: "Ühendus ebaõnnestus! Proovime hiljem uuesti", status: 400}));
            } else {
                res.send(JSON.stringify({msg: "Sündmus tehtud!", status: 200}));
            }
        } else {
            if (err) {
                req.flash("error_msg", "Ilmus viga!");
                res.redirect("/");

            } else {
                req.flash("success_msg", "Sündmus tehtud!");
                res.redirect("/");
            }
        }
    })
});

router.post('/addpayer', ensureAuthenticated, (req, res) => {
    db.addPayment(req.user[0]["id"], String(req.body.friendName), req.body.friendPayAmount, req.body.eventIdAddPayer, (err, results) => {
        if (err) {
            console.log(err);
            if (req.xhr || req.headers["content-type"] == 'application/json') {
                res.send(JSON.stringify({msg: "Database error!", status: 400}));
            } else {
                req.flash("error_msg", "Ebakorrektne sisend!");
                res.redirect("/");
            }
        } else {
            if (req.xhr || req.headers["content-type"] == 'application/json') {
                res.send(JSON.stringify({msg: "Võlgnik lisatud!", status: 200}));
            } else {
                req.flash("success_msg", "Võlgnik lisatud!");
                res.redirect("/");
            }

        }
    })
});

router.post('/confirm', ensureAuthenticated, (req, res) => {
    db.changePaymentStatus(req.body.confirmPayment, 1, (err, results) => {
        if (err) console.log(err);
        req.flash("success_msg", "Makse kinnitatud!");
        res.redirect("/");
    })
});

router.post('/decline', ensureAuthenticated, (req, res) => {
    db.changePaymentStatus(req.body.declinePayment, 2, (err, results) => {
        if (err) console.log(err);
        req.flash("success_msg", "Maksest keeldutud!");
        res.redirect("/");
    })
});

module.exports = router;