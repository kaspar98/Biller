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
            if (err) throw err;
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
                if (err) throw err;
                for (i = 0; i < results1.length; i++) {
                    myEvents[results1[i]["eventId"]] = [];
                    myEvents[results1[i]["eventId"]].push(results1[i]);
                }
                res.render('index', {
                    myEvents: myEvents,
                    otherEventsConfirmed: otherEventsConfirmed,
                    otherEventsUnconfirmed: otherEventsUnconfirmed,
                    script: script
                });
            })
        });
    } else {
        res.render('index', {
            myEvents: myEvents,
            otherEventsConfirmed: otherEventsConfirmed,
            otherEventsUnconfirmed: otherEventsUnconfirmed,
        });
    }
});

router.post('/addevent', ensureAuthenticated, (req, res) => {
    db.addEvent(req.body.title, req.body.eventDescription, req.user[0]["id"], (err, results) => {
        if (err) throw err;
        req.flash("success_msg", "Event made!");
        res.redirect("/");
    })
});

router.post('/addpayer', ensureAuthenticated, (req, res) => {
    db.addPayment(req.user[0]["id"], req.body.friendName, parseFloat(req.body.friendPayAmount), parseInt(req.body.eventIdAddPayer), (err, results) => {
        if (err){
            if (req.xhr) {
                res.json({msg: "Database error!", status: 400});
            } else {
                req.flash("error_msg", "Ebakorrektne sisend!");
                res.redirect("/");
            }
        } else{
            if (req.xhr) {
                res.json({msg: "Võlgnik lisatud!", status: 200});
            } else{
                req.flash("success_msg", "Võlgnik lisatud!");
                res.redirect("/");
            }

        }
    })
});

router.post('/confirm', ensureAuthenticated, (req, res) => {
    db.changePaymentStatus(req.body.confirmPayment, 1, (err, results) => {
        if (err) throw err;
        req.flash("success_msg", "Payment confirmed!");
        res.redirect("/");
    })
});

router.post('/decline', ensureAuthenticated, (req, res) => {
    db.changePaymentStatus(req.body.declinePayment, 2, (err, results) => {
        if (err) throw err;
        req.flash("success_msg", "Payment declined!");
        res.redirect("/");
    })
});

module.exports = router;