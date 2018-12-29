const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', (req, res, next) => {
    res.send('ok');

    models.Apps.create({
            owner: 'test',
            uri: 'http://test.ru',
            dbType: 'mongodb',
            dbUser: 'dbUser',
            dbPassword: 'adq134r324wfg134r',
            dbTable: 'tablename',
            dbUrl: 'mongoDB://test.ru',
            isActive: true,
            port: '',
        },
        function (err, user) {
            console.log('add');
        });
})

module.exports = router;