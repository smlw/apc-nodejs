const express = require('express');
const router = express.Router();
const models = require('../models');
const config = require('../config');
const NodeRSA = require('node-rsa');
const key = new NodeRSA(config.PRIVATE_KEY);

router.get('/', async (req, res) => {

  const apps = await models.App.find({
    owner: req.user.id
  });

  // Decrypt domain field 
  apps.forEach((item) => {
    item.domain = key.decrypt(item.domain, 'utf8');
  });

  res.render('account', {
    apps,
    user: req.user
  })
});

module.exports = router;