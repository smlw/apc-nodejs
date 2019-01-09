const express = require('express');
const router = express.Router();
const models = require('../models')
const passport = require('passport');
const LocalStrategy = require('passport-local');

router.get('/', (req, res) => {
    res.render('auth')
});

passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    // check in mongo if a user with username exists or not
    models.User.findOne({ 'login' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false, 
                req.flash('message', 'User Not found.'));                 
        }
        // User exists but wrong password, log the error 
        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false, 
              req.flash('message', 'Invalid Password'));
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
      }
    );
}));

const isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
}

router.post('/signin', 
  passport.authenticate('local', { failureRedirect: '/auth' }), 
  function(req, res) {
    res.redirect('/');
  });



module.exports = router;