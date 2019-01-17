const express = require('express');
const router = express.Router();
const models = require('../models')



router.get('/', async (req, res) => {

    const apps = await models.App.find({
        owner: req.user
    });

    console.log(apps)

    res.render('account', {
        apps,
        user: req.user
    })
});

module.exports = router;