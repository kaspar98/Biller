const express = require('express');
const router = express.Router();
const db = require("../db/mysql");
const{ensureAuthenticated} = require("../helpers/auth");

router.get('/', ensureAuthenticated, function(req, res, next) {
    db.getPayments(req.user[0]["id"], (err, results) => {
        if (err) throw err;
        var balances = {};
        for (i = 0; i < results.length; i++) {
            if(balances[results[i].username] == null){
                balances[results[i].username] = {};
                balances[results[i].username]["amount"] = 0;
                balances[results[i].username]["id"] = results[i].id;
                balances[results[i].username]["firstName"] = results[i].firstName;
                balances[results[i].username]["lastName"] = results[i].lastName;
                balances[results[i].username]["username"] = results[i].username;
            }
            if(results[i].idFrom == req.user[0]["id"]){
                balances[results[i].username]["amount"] -= results[i].amount;
            }else {
                balances[results[i].username]["amount"] += results[i].amount;
            }
        }
        res.render('bilanss', {
            allBalances: balances
        });
    })
});

module.exports = router;