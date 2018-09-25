const mysql = require("mysql");
const fs = require('fs');
const path = require("path");

const pool  = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
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