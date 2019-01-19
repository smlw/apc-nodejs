const express = require('express');
const router = express.Router();
const models = require('../models')
const config = require('../config');
const NodeRSA = require('node-rsa');
const key = new NodeRSA(config.PRIVATE_KEY); 

router.get('/:id', async (req, res, next) => {

    // Id of app & user
    const id = req.params.id.trim().replace(/ +(?= )/g, '');

    try {

        // DB query to get app info
        const app = await models.App.findOne({
            _id: id,
            owner: req.user.id
        })

        // If !app return status code 404
        if (!app) {
            res.send(404)
        }

        // Render view with app-object
        res.render('editApp', {
            app: {
                domain:     key.decrypt(app.domain, 'utf8'),
                dbHost:     key.decrypt(app.dbHost, 'utf8'),
                dbName:     key.decrypt(app.dbName, 'utf8'),
                dbUser:     key.decrypt(app.dbUser, 'utf8'),
                dbPassword: 'Скрыто',
                dbTable:    key.decrypt(app.dbTable, 'utf8'),
                dbType: app.dbType
            },
            user: req.user 
        })

    } catch (error) {
        res.status(500)
    }


});

module.exports = router; 