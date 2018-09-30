const mysql = require("mysql");
const fs = require('fs');
const path = require("path");

const pool  = mysql.createPool({
    host: "us-cdbr-iron-east-01.cleardb.net",
    user: "b86c2dfee35cd0",
    password: "2efcfe28",
    database: "heroku_56b9a13d37e5dfb",
    port: 3306,
    multipleStatements: true
    // host     : 'localhost',
    // user     : 'root',
    // password : '',
    // database: 'heroku_56b9a13d37e5dfb',
    // connectionLimit : 20,
    // multipleStatements: true
});

function addUser(firstName, lastName, email, username, password, cb) {
    var sql = "CALL sp_new_user('" + firstName + "', '" + lastName + "', '" + email + "', '" +
        username + "', '" + password + "');";
    pool.query(sql, cb);
}

function addFriend(uid, fid, cb) {
    var sql = "INSERT INTO Friends(id1, id2, confirmed) VALUES ('"+uid+"', '"+fid+"', 0);";
    pool.query(sql, cb);
}

function getUserByEmail(email, cb) {
    pool.query("SELECT * FROM Users WHERE email=?", email, cb);
}

function getUserByName(firstName, lastName, cb) {
    // Hetkel tagastab inimesi, kellel puudub kastuajaga sõprus
    pool.query("SELECT DISTINCT firstName, lastName, id, username FROM users, friends WHERE NOT id=id1 AND NOT id=id2" +
        " AND firstName='" + firstName + "' AND lastName='" + lastName + "'", cb);
}

function getFriendRequests(uid, cb){
    pool.query("SELECT firstName, lastName, username, id FROM friends, users WHERE id1=id AND id2=? AND confirmed=0", uid, cb);
}

function changeFriendRequestStatus(uid, fid, status, cb){
    pool.query("UPDATE friends SET confirmed='"+status+"' WHERE id2='"+uid+"' AND id1='"+fid+"'", cb);
}

function addEvent(title, descriptionIn, creatorId, cb) {
    var sql = "INSERT INTO events(title, description, creatorId) VALUES ('"+title+"', '"+descriptionIn+"', '"+creatorId+"')";
    pool.query(sql, cb);
}

function getEvents(uid, cb) {
    var sql = "SELECT * FROM v_events_and_payments WHERE creatorId='"+uid+"' OR idFrom='"+uid+"' OR idTo='"+uid+"'";
    pool.query(sql, cb);
}

function getEmptyEvents(uid, cb) {
    var sql = "SELECT E.id as eventId, creatorId, firstName as receiverFName, lastName as receiverLName, title, description, pictureId" +
        " FROM Events as E, Users WHERE NOT EXISTS (SELECT * FROM payments WHERE eventId=E.id)" +
        " AND creatorId=users.id AND creatorId=?";
    pool.query(sql, uid, cb);
}

function addPayment(fromid, toid, amountIn, eventid, cb){
    var sql = "INSERT INTO payments (idFrom, idTo, amount, confirmed, eventId) VALUES ('"+fromid+"', '"+toid+"', '"+amountIn+"', '"+eventid+"', 0);";
    pool.query(sql, cb);
}

function changePaymentStatus(id, status, cb){
    var sql = "UPDATE payments SET confirmed='"+status+"' WHERE id='"+id+"'";
    pool.query(sql, cb);
}


function init () {
    data = fs.readFileSync(path.join(__dirname, '/init.sql'), 'utf8');
    pool.query(data, (error) => {
        if (error) {
            console.log(error.message);
            throw error;
        }
        console.log("Database reset!")
    });
}

module.exports = {
    addUser,
    getUserByEmail,
    init,
    getUserByName,
    addFriend,
    getFriendRequests,
    changeFriendRequestStatus,
    addEvent,
    addPayment,
    getEvents,
    getEmptyEvents,
    changePaymentStatus
};