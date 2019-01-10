const LocalStrategy = require('passport-local').Strategy;
const models = require('./models');


module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user)
    });
    passport.deserializeUser((user, done) => {
        done(null, user)
    });

    passport.use(new LocalStrategy(
        function (username, password, cb) {
            models.User.findOne({
                login: username
            }, function (err, user) {
                if (err) {
                    return cb(err);
                }
                if (!user) {
                    return cb(null, false);
                }
                if (user.comparePassword(password, user.password)) {
                    return cb(null, user);
                }
                return cb(null, false);
            });
        }));
}