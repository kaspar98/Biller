const express = require('express');
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("../db/mysql");

router.get('/', function (req, res, next) {
    res.render('signup');
});

router.post('/', (req, res) => {
    function reRender() {
        res.render('signup', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    }

    let errors = [];

    if (req.body.password != req.body.password2) {
        errors.push({text: "Passwords do not match"});
    }

    if (req.body.password.length < 4) {
        errors.push({text: "Password must be at least 4 chars"});
    }

    if (!req.body.firstName) {
        errors.push({text: 'Please add a first name'});
    }

    if (!req.body.lastName) {
        errors.push({text: 'Please add a last name'});
    }
 // Email check
    db.getUserByEmail(req.body.email, (err, results) => {
        if (err) throw err;
        if (results.length) {
            errors.push({text: "Email taken"});
            reRender();
        } else {
            // Username taken check
            db.getUserByUsername(req.body.username, (err1, results1) => {
                if (err1) throw err1;
                if (results1.length) {
                    errors.push({text: "Username taken"});
                    reRender();
                }
                else {
                    if (errors.length > 0) {
                        reRender();
                        errors.push({text: "Unknown error!"});
                    } else {
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(req.body.password, salt, (err, hash) => {
                                if (err) throw err;
                                db.addUser(req.body.firstName, req.body.lastName, req.body.email, req.body.username, hash, "", (err, results) => {
                                    if (err) throw err;
                                });
                            })
                        });
                        req.flash("success_msg", "You are now registered!");
                        res.redirect("/login");
                    }
                }
            });
        }
    });
})
;

module.exports = router;