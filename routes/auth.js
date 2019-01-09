const express = require('express');
const router = express.Router();
const models = require('../models')
const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(
    function (username, password, done) {
        models.findOne({
            login: username
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (!user.verifyPassword(password)) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

router.get('/', (req, res) => {
    res.render('auth')
});

router.post('/signin',
    passport.authenticate('local', {
        failureRedirect: '/signin'
    }),
    function (req, res) {
        res.redirect('/');
    });

module.exports = router;