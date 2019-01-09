const LocalStrategy = require('passport-local').Strategy;
const models = require('./models')
module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user)
    });
    passport.deserializeUser(function (user, done) {
        done(null, user)

    }); 

    passport.use(new LocalStrategy(function(username, password, done){
        models.User.findOne({
            login: username
        }, function(err, doc){
            if(err) { done(err) }
            else {
                if(doc){
                    const valid = doc.comparePassword(password, doc.password)
                    if(valid){
                        done(null, {
                            login: doc.username,
                            password: doc.password
                        })
                    } else {
                        done(null, false)
                    }
                } else {
                    done(null, false)
                }
            }
        })
    }))
}