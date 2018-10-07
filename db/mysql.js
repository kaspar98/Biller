const mysql = require("mysql");
const fs = require('fs');
const path = require("path");

const pool  = mysql.createPool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    multipleStatements: true
});

function addUser(firstName, lastName, email, username, password, googleID, cb) {
    var sql = "CALL sp_new_user('" + firstName + "', '" + lastName + "', '" + email + "', '" +
        username + "', '" + password + "', '"+googleID+"');";
    pool.query(sql, cb);
}

function addFriend(uid, fid, cb) {
    var sql = "CALL sp_add_friend('"+uid+"', '"+fid+"');";
    pool.query(sql, cb);
}

function getUserByUsername(username, cb) {
    pool.query("SELECT * FROM v_users WHERE username=?", username, cb);
}

function getUserByEmail(email, cb) {
    pool.query("SELECT * FROM v_users WHERE email=?", email, cb);
}

function getUserByName(firstName, lastName, uid, cb) {
    // Hetkel tagastab inimesi, kellel puudub kastuajaga sõprus
    pool.query("SELECT DISTINCT firstName, lastName, id, username FROM v_users, v_friends WHERE NOT id1='"+uid+"' AND NOT id2='"+uid+"'" +
        " AND firstName='" + firstName + "' AND lastName='" + lastName + "'", cb);
}

function getUserByGoogleID(googleID, cb) {
    pool.query("SELECT * FROM v_users WHERE googleID=?", googleID, cb);
}

function getFriendRequests(uid, cb){
    pool.query("SELECT firstName, lastName, username, id FROM v_friends, v_users WHERE id1=id AND id2=? AND confirmed=0", uid, cb);
}

function getFriends(uid, cb){
    pool.query("SELECT firstName, lastName, username, id FROM v_friends, v_users WHERE id1='"+uid+"' OR id2='"+uid+"'" +
        " AND confirmed=1 AND id<>'"+uid+"' ", cb);
}

function changeFriendRequestStatus(uid, fid, status, cb){
    pool.query("CALL sp_changeFriendRequestStatus('"+uid+"','"+fid+"','"+status+"')", cb);
}

function addEvent(title, descriptionIn, creatorId, cb) {
    var sql = "CALL sp_addEvent('"+title+"', '"+descriptionIn+"', '"+creatorId+"')";
    pool.query(sql, cb);
}

function getEvents(uid, cb) {
    var sql = "SELECT * FROM v_events_and_payments WHERE creatorId='"+uid+"' OR idFrom='"+uid+"' OR idTo='"+uid+"'";
    pool.query(sql, cb);
}

function getEmptyEvents(uid, cb) {
    var sql = "SELECT E.id as eventId, creatorId, firstName as receiverFName, lastName as receiverLName, title, description, pictureId" +
        " FROM v_events as E, v_users WHERE NOT EXISTS (SELECT * FROM v_payments WHERE eventId=E.id)" +
        " AND creatorId=v_users.id AND creatorId=?";
    pool.query(sql, uid, cb);
}

function addPayment(toid, fromusername, amountIn, eventid, cb){
    var sql = "CALL sp_addPayment('"+toid+"', '"+fromusername+"', '"+amountIn+"', '"+eventid+"')";
    pool.query(sql, cb);
}

function getPayments(uid, cb){
    var sql = "SELECT * FROM v_payments, v_users WHERE (idFrom='"+uid+"' OR idTo='"+uid+"')" +
        "AND (idFrom=v_users.id OR idTo=v_users.id) AND v_users.id <> '"+uid+"' AND confirmed=1";
    pool.query(sql, cb);
}

function countFriends(uid, cb){
    var sql = "SELECT COUNT(*) FROM Friends WHERE confirmed=1 AND id1='"+uid+"' OR id2='"+uid+"'";
    pool.query(sql, cb);
}

function changePaymentStatus(id, status, cb){
    var sql = "CALL sp_changePaymentStatus('"+id+"', '"+status+"')";
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
    getUserByUsername,
    getUserByEmail,
    init,
    getUserByName,
    addFriend,
    getFriends,
    getFriendRequests,
    changeFriendRequestStatus,
    addEvent,
    addPayment,
    getEvents,
    getEmptyEvents,
    changePaymentStatus,
    getUserByGoogleID,
    getPayments,
    countFriends
};