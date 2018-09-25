const express = require('express');
const router = express.Router();
const{ensureAuthenticated} = require("../helpers/auth");

router.get('/', ensureAuthenticated, function(req, res, next) {
    res.render('profiil');
});

module.exports = router;