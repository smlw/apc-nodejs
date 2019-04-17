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
  const logs = await models.Log.find({
    owner: req.user.id
  })
    .sort({
        createdAt: -1
    })
    .populate('App')

  // Decrypt domain field 
  apps.forEach((item) => {
    item.domain = key.decrypt(item.domain, 'utf8');
  });

  res.render('account', {
    apps,
    logs,
    user: req.user
  })
});

module.exports = router;