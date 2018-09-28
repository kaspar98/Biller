const express = require('express');
const router = express.Router();
const db = require("../db/mysql");

router.get('/', function(req, res, next) {
    res.render('index');
});


router.post('/', (req, res) => {
    function reRender() {
        res.render('index', {
            errors: errors,
            eventDescription: req.body.eventDescription,
            idFrom: req.body.idFrom,
            idTo: req.body.idTo,
            amount: req.body.amount,
        });
    }

    let errors = [];

    if (!req.body.idFrom) {
        errors.push({text: 'Please add idFrom'});
    }

    if (!req.body.idTo) {
        errors.push({text: 'Please add idTo'});
    }

    if (!req.body.amount) {
        errors.push({text: 'Please add amount'});
    }

    if (req.body.amount <= 0) {
        errors.push({text: "Amount must be positive"});
    }

    if (errors.length > 0) {
        reRender();
    } else {
        db.addEvent(req.body.eventDescription, req.body.idFrom, req.body.idTo, req.body.amount, (err, results) => {
            if (err) throw err;
        });
    }

    req.flash("success_msg", "You have made an event!");
    res.redirect("/profiil");

});

module.exports = router;