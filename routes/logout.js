const express = require('express');
const router = express.Router();

router.get("/", function(req, res) {
    res.render('logut', {
        title: "Login välja",
        description: "See leht on välja logimiseks.",
        keywords: "Biller, logi välja",
    });
    req.logout();
    req.flash("success_msg", "Oled välja logitud!");
    res.redirect("/login");
});

module.exports = router;