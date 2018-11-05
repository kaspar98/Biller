const express = require('express');
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("../db/mysql");
const nodemailer = require("nodemailer");

router.get('/', function (req, res, next) {
    res.render('signup', {
        title: "Registreeru",
        description: "See leht on registeerumieks. Siin saad sisestada oma andmed ja oledki Billeri perekonna liige :-).",
        keywords: "Biller, registreeru, konto, nimi, parool, email",
    });
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
        errors.push({text: "Paroolid ei kattu"});
    }

    if (req.body.password.length < 4) {
        errors.push({text: "Parool peab olema vähemalt 4 tähemärki pikk"});
    }

    if (!req.body.firstName) {
        errors.push({text: 'Palun lisa eesnimi'});
    }

    if (!req.body.lastName) {
        errors.push({text: 'Palun lisa perekonnanimi'});
    }
 // Email check
    db.getUserByEmail(req.body.email, (err, results) => {
        if (err) console.log(err);
        if (results.length) {
            errors.push({text: "See email on juba võetud"});
            reRender();
        } else {
            // Username taken check
            db.getUserByUsername(req.body.username, (err1, results1) => {
                if (err1) console.log(err1);
                if (results1.length) {
                    errors.push({text: "See kasutajanimi on juba võetud"});
                    reRender();
                }
                else {
                    if (errors.length > 0) {
                        reRender();
                        errors.push({text: "Tundmatu error!"});
                    } else {
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(req.body.password, salt, (err, hash) => {
                                if (err) console.log(err);
                                db.addUser(req.body.firstName, req.body.lastName, req.body.email, req.body.username, hash, "", (err, results) => {
                                    if (err) console.log(err);
                                });
                            })
                        });
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.EMAIL,
                                pass: process.env.EMAIL_PASS
                            }
                        });

                        var mailOptions = {
                            from: process.env.EMAIL,
                            to: req.body.email,
                            subject: 'Biller account!',
                            text: 'Your Biller account username is ' + req.body.username
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(error);
                            }
                        });
                        req.flash("success_msg", "Oled nüüd registreeritud!");
                        res.redirect("/login");
                    }
                }
            });
        }
    });
})
;

module.exports = router;