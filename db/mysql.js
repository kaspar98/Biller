const mysql = require("mysql");
const pathModule = require('path');

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
    return readFile(pathModule.resolve(__dirname, './init.sql'), 'utf8')
        .then(tableDef => pool.query(tableDef))
}

module.exports = {
    addUser,
    getUserByEmail,
    getUserById,
    init
}