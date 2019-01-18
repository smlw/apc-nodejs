const express = require('express');
const router = express.Router();
const models = require('../models')
const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 512});

router.get('/', async (req, res) => {

    const apps = await models.App.find({
        owner: req.user
    });

    res.render('account', {
        apps,
        user: req.user
    })
});

module.exports = router;