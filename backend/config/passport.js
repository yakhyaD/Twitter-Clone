const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const User = require('../models/User')

let login

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        seesion: false
    },
    function (email, password, done) {
        if (email.split('').includes('@')) {
            login = {email: email}
        } else {
            login = {username: email}
        }
        User.findOne(login , function(err, user) {
            if (err) return done(err)

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            bcrypt.compare(password, user.password, (err, match) => {
                if (err) return done(null, false, { error: 'Something went wrong' })
                if (!match) return done(null, false, { error: 'Incorrect Password' })

                return done(null, user)

            })
        })
  }
))
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'Bearer'

}, function (jwt_payload, done) {
        User.findById(jwt_payload.id, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            }
        })
}))