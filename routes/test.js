const express = require('express');
const router = express.Router();
const script = "../scripts/test.js";

router.get('/', function(req, res, next) {
    res.render('test', {
        title: "Testimine",
        description: "Sellel lehel saad vajutada nupukest, mis teise elemendi värvi ja suurust muudab." +
            "Lisaks saad kaardikest ka vaadata",
        keywords: "Biller, nupp, värvid, kaart",
        script: [script]
    });
});

module.exports = router;