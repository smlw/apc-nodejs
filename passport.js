const LocalStrategy = require('passport-local').Strategy;
const models = require('./models');


module.exports = (passport) => {
    passport.serializeUser(function(user, cb) {
        cb(null, user.id);
      });
      
      passport.deserializeUser(function(id, cb) {
        models.User.findById(id, function (err, user) {
          if (err) { return cb(err); }
          cb(null, user);
        });
      });
      
    passport.use(new LocalStrategy(
        {
            usernameField: 'login_email',
            passwordField: 'login_password',
            passReqToCallback: true
        },
        function (req, email, password, cb) {
            models.User.findOne({
                email: email
            }, function (err, user) {
                if (err) {
                    return cb(err, req.flash('message', 'Попробуйте позже!'));
                }
                if (!user || !user.comparePassword(password, user.password)) {
                    return cb(null, false, req.flash('message', 'Неверный логин и/или пароль!'));
                } else {
                    return cb(null, user)
                }
            });
        }));
}