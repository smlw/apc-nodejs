const LocalStrategy = require('passport-local').Strategy;
const models = require('./models');


module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user)
    });
    passport.deserializeUser ((user, done) => {
        done(null, user)
    }); 

    passport.use('local', new LocalStrategy((username, password, done) => {
        models.User.findOne({
            login: username
        }, (err, doc) => {
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