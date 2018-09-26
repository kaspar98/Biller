const express = require('express');
const router = express.Router();
const db = require("../db/mysql");

router.post('/', (req, res) => {
    let jupid = req.body.findName.split(" ");
    let last = jupid[jupid.length - 1];
    let first = jupid.join(" ").replace(" " + last, "");
    db.getUserByName(first, last, (err, results) => {
        if (results.length) {
            res.render('add', {
                email: results[0]["email"]
            });
        } else {
            res.render('add', {
                email: "No users found!"
            });
        }
    })
});

module.exports = router;