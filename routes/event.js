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
            ifFrom: req.body.lastName,
            idTo: req.body.email,
            amount: req.body.password,
        });
    }

    let errors = [];

    if (req.body.amount.length >= 0) {
        errors.push({text: "Amount pos"});
    }

    if (!req.body.ifFrom) {
        errors.push({text: 'Please add idfrom'});
    }

    if (!req.body.idTo) {
        errors.push({text: 'Please add idto'});
    }

    db.addEvent(req.body.eventDescription, req.body.ifFrom, req.body.idTo, req.body.amount, (err, results) => {
        if (err) throw err;

        req.flash("success_msg", "Event made!");
        res.redirect("/event");
    })
});

module.exports = router;