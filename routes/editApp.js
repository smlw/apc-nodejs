const express = require('express');
const router = express.Router();
const models = require('../models')

router.get('/:id', async (req, res) => {

    // Id of app & user
    const id = req.params.id.trim().replace(/ +(?= )/g, '');
    const userId = req.user.id;

    try {

        // DB query to get app info
        const app = await models.App.findOne({
            _id: id,
            owner: userId
        })

        console.log(app)

        // If !app return status code 404
        if (!app) {
            const err = new Error('Not Found');
            err.status = 404;
            next(err);
        }

        // Render view with app-object
        res.render('editApp', {
            app,
            user: req.user 
        })

    } catch (error) {
        res.json({
            ok: false,
            msg: 'Попробуйте позже'
        })
    }


});

module.exports = router;