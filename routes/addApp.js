const express = require('express');
const router = express.Router();
const models = require('../models');
const AdapterMongoDB = require('../adapters/mongodb');

router.get('/', async (req, res, next) => {

    const appData = {
        owner: 'smlw',
        uri: 'http://test.ru',
        dbType: 'mongodb',
        dbUser: 'dbUser',
        dbPassword: 'adq134r324wfg134r',
        dbTable: 'tablename',
        dbUrl: 'mongoDB://test.ru',
        isActive: true,
        port: '',
    };

    if(!appData.owner || !appData.uri || !appData.dbType || !appData.dbUser || !appData.dbPassword || !appData.dbTable || !appData.dbUrl){
        res.json({
            ok: false,
            message: 'Заполните все необходимые поля!'
        });
    } else {
        const App = await models.Apps.create(appData, (err, appInfo) => {
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