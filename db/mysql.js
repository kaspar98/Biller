const mysql = require("mysql");
const fs = require('fs');
const path = require("path");

const pool  = mysql.createPool({
    host: "us-cdbr-iron-east-01.cleardb.net",
    user: "b86c2dfee35cd0",
    password: "2efcfe28",
    database: "heroku_56b9a13d37e5dfb",
    // host     : 'localhost',
    // user     : 'root',
    // password : '',
    // database : 'Biller',
    // connectionLimit : 20
});

function addUser(firstName, lastName, email, username, password, cb) {
    var sql = "INSERT INTO users (first_name, last_name, email, username, password) VALUES ('" +firstName+ "', " +
        "'" + lastName + "', '" + email + "', '" + username + "', '" + password + "')";
    pool.query(sql, cb);
}

function getUserByEmail(email, cb) {
    pool.query("SELECT * FROM users WHERE email=?", email, cb);
}

function getUserById(id, cb) {
    pool.query("SELECT * FROM users WHERE id=?", id, cb);
}

function init () {
    fs.readFileSync(path.join(__dirname, '/init.sql'), 'utf8', (err, data) => {
        if (err) {
            return console.log(err);
        }
        pool.query(data);
    })
}

module.exports = {
    addUser,
    getUserByEmail,
    getUserById,
    init
}