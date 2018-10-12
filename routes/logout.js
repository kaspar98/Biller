const express = require('express');
const router = express.Router();

router.get("/", function(req, res) {
    req.logout();
    req.flash("success_msg", "Oled välja logitud!");
    res.redirect("/login");
});

module.exports = router;