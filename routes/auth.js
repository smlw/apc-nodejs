const express = require('express');
const router = express.Router();
const models = require('../models')



module.exports = (passport) => {
  router.post('/signup', (req, res) => {
      const body = req.body;
      const username = body.username;
      const password = body.password;
      models.User.findOne({login: username}, function(err, doc){
        if(err) {res.status(500).send('error occuraced')}
        else {
          if(doc){
            res.status(500).send('Username already exist')
          } else {
            var record = new models.User();
            record.login = username;
            record.password = record.hashPassword(password);
            record.save((err, user) => {
              if(err){
                res.status(500).send('db error')
              } else {
                res.send(user)
              }
            })
          }
        }
      })
  });

  router.post('/login', passport.authenticate('local', {
    failureRedicrect: '/login',
    successRedirect: '/account'
  }), function(req, res){
    res.send('hey')
  })

  return router
};  