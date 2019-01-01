const express = require('express');
const router = express.Router();
const models = require('../models');
const AdapterMongoDB = require('../adapters/mongodb');

router.get('/', (req, res) => {
    res.render('addApp');
});

router.post('/rights', (req, res) => {
    const url = req.body.url.trim();
    const secretKey = req.body.secretKey.trim();

    res.json({
        ok: true,
        url,
        secretKey
    });
});

router.post('/', async (req, res, next) => {

    const owner         =   req.body.owner.trim();
    const uri           =   req.body.uri.trim();
    const dbType        =   req.body.dbType.trim();
    const dbUser        =   req.body.dbUser.trim();
    const dbPassword    =   req.body.dbPassword.trim();
    const dbTable       =   req.body.dbTable.trim();
    const dbUrl         =   req.body.dbUrl.trim();
    const port          =   req.body.owner.trim();

    const appData = {
        owner,
        uri,
        dbType,
        dbUser,
        dbPassword,
        dbTable,
        dbUrl,
        port
    };

    if(!appData.owner || !appData.uri || !appData.dbType || !appData.dbUser || !appData.dbPassword || !appData.dbTable || !appData.dbUrl){
        res.json({
            ok: false,
            message: 'Заполните все необходимые поля!'
        });
    } else {
        await models.Apps.create(appData, (err, appInfo) => {
            console.log(err);
            console.log(appInfo)
        });

        res.json({
            ok: true,
            message: 'Приложение было успешно создано!',
            appData
        });
    }
})

module.exports = router;