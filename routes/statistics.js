const express = require('express');
const router = express.Router();
const db = require("../db/mysql");
const script = "../scripts/statistics.js";


router.get('/', function(req, res, next) {
    db.getStatistics((err ,results) => {
        if (err) throw err;
        var browsers = {};
        var oss = {};
        var hours = {};
        var landingPages = {};
        for(i=0;i<results.length;i++){
            browsers[results[i]["browser"]] = (browsers[results[i]["browser"]] || 0);
            browsers[results[i]["browser"]] += 1;
            oss[results[i]["os"]] = (oss[results[i]["os"]] || 0);
            oss[results[i]["os"]] += 1;
            hours[results[i]["landingTime"].split(":")[0]] = (hours[results[i]["landingTime"].split(":")[0]] || 0);
            hours[results[i]["landingTime"].split(":")[0]] += 1;
            landingPages[results[i]["landingPage"]] = (landingPages[results[i]["landingPage"]] || 0);
            landingPages[results[i]["landingPage"]] += 1;
        }
        var mostUsedBrowser = Object.keys(browsers).reduce((a, b) => browsers[a] > browsers[b] ? a : b);
        var mostUsedOS = Object.keys(oss).reduce((a, b) => oss[a] > oss[b] ? a : b);
        res.render('statistics', {
            title: "Statistics",
            description: "Siin lehel kuvame külastajate statistikat.",
            keywords: "Biller, statistika, külastajad",
            mostUsedBrowser: mostUsedBrowser,
            mostUsedOS: mostUsedOS,
            landingPages: landingPages,
            hours: hours,
            results: results,
            script: ["https://canvasjs.com/assets/script/canvasjs.min.js", script]
        });

    });
});

module.exports = router;