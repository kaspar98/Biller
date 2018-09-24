const mysql = require("mysql");

const pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'Biller',
    connectionLimit : 20
});

function addUser(firstName, lastName, email, username, password, cb) {
    var sql = "INSERT INTO users (first_name, last_name, email, user_name, password) VALUES ('" +firstName+ "', " +
        "'" + lastName + "', '" + email + "', '" + username + "', '" + password + "')";
    pool.query(sql, cb);
}

function getUserByEmail(email, cb) {
    pool.query("SELECT * FROM users WHERE email=?", email, cb);
}

function getUserById(id, cb) {
    pool.query("SELECT * FROM users WHERE id=?", id, cb);
}

module.exports = {
    addUser,
    getUserByEmail,
    getUserById
}