const express = require('express');
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("../db/mysql");

router.get('/', function (req, res, next) {
    res.render('event');
});

router.post('/', (req, res) => {
    function reRender() {
        res.render('event', {
            errors: errors,
            eventDescription: req.body.eventDescription,
            idFrom: req.body.idFrom,
            idTo: req.body.idTo,
            amount: req.body.amount,
        });
    }

    let errors = [];

    if (req.body.amount.length >= 0) {
        errors.push({text: "Amount pos"});
    }

    if (!req.body.idFrom) {
        errors.push({text: 'Please add idfrom'});
    }

    if (!req.body.idTo) {
        errors.push({text: 'Please add idto'});
    }

    // lisada id-de kontroll

    // console.log(req.body.eventDescription, req.body.idFrom, req.body.idTo, req.body.amount);


    db.addEvent(req.body.eventDescription, 0, (err, results) => {
        if (err) throw err;
        // console.log(results);
        // console.log(results[1][0]["LAST_INSERT_ID()"]);
        let eventId = results[1][0]["LAST_INSERT_ID()"];

        // db.addPayment(req.body.idFrom, req.body.idTo, req.body.amount, eventId, (err, results) => {
        //     if (err) throw err;
        //     console.log(results);
        //     console.log(results[1][0]["LAST_INSERT_ID()"]);
        //
        //     req.flash("success_msg", "Payment made!");
        // });

        req.flash("success_msg", "Event made!");
        res.redirect("/event");
    })
});

module.exports = router;