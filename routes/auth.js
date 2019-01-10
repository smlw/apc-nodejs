const express = require('express');
const router = express.Router();
const models = require('../models')

module.exports = (passport) => {
  router.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    //нужно сделать проверку на совпадение паролей и длину всех параметров
    models.User.findOne({
      login: username
    }, (err, doc) => {
      if (err) {
        res.status(500).send('error occuraced')
      } else {
        if (doc) {
          res.status(500).send('Username already exist')
        } else {
          const schema = new models.User();
          models.User.create({
            login: username,
            password: schema.hashPassword(password)
          }).then(user => res.send(user)).catch(err => res.send(err))
        }
      }
    })
  });

  router.post('/login', passport.authenticate('local', {
    failureRedicrect: '/login',
    successRedirect: '/account'
  }))

  return router
};