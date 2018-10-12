const express = require('express');
const router = express.Router();
const script = "../scripts/test.js";


router.get('/', function(req, res, next) {
    res.render('test', {
        script: script
    });
});

module.exports = router;