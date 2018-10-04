const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("./keys");
const bcrypt = require("bcryptjs");
const db = require("../db/mysql");

module.exports = function (passport) {
    // Log in
    passport.use(new LocalStrategy({usernameField: "email"}, (email,
                                                              password, done) => {
        db.getUserByEmail(email, (err, results) => {
            // Match email
            if (!results.length) {
                return done(null, false, {message: "No user found"});
            }
            // Match password
            bcrypt.compare(password, results[0]["password"], (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, results);
                } else {
                    return done(null, false, {message: "Password incorrect"});
                }
            })
        })
    }));

    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: "/login/google/callback",
            proxy: true
        }, (accessToken, refreshToken, profile, done) => {
            db.getUserByGoogleID(profile.id, (err, res) => {
                if (err) return done(err);
                if (!res.length) {
                    // Uus kasutaja andmebaasi
                    user = {
                        googleID: profile.id,
                        username: profile.displayName,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                    };

                    db.addUser(user.firstName, user.lastName, user.email, user.username, "", user.googleID, (err, res) => {
                        if (err) {
                            console.log("Error adding new Facebook user!");
                            throw err;
                        } else Object.assign(user, {id: res[0][0]["id"]});
                        return done(null, [user])
                    })
                } else {
                    return done(null, [res[0]]);
                }
            })
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

};