const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../db/mysql");

module.exports = function(passport){
    // Log in
    passport.use(new LocalStrategy({usernameField: "email"}, (email,
        password, done) => {
            db.getUserByEmail(email, (err, results) =>{
                // Match email
                if(!results.length) {
                    return done(null, false, {message: "No user found"});
                }
                // Match password
                bcrypt.compare(password, results[0]["password"], (err, isMatch) => {
                    if (err) throw err;
                    if(isMatch){
                        return done(null, results);
                    } else{
                        return done(null, false, {message:"Password incorrect"});
                    }
                })
            })
    }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

};