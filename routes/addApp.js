const express = require('express');
const router = express.Router();
const models = require('../models');
const cheerio = require('cheerio');
const request = require('request');
const AdapterMongoDB = require('../adapters/mongodb');

router.get('/', (req, res) => {
    res.render('addApp');
});


// CHECK RIGHTS 
router.post('/rights', async (req, res) => {
    const url = req.body.url.trim();
    const secretKey = req.body.secretKey.trim();

    try {
        await request(url, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                // const metaVerify = $("meta[name='apc-verification']").attr("content");
                const metaVerify = $("meta[http-equiv='content-type']").attr("content");

                if(metaVerify){
                    res.json({
                        ok: true,
                        msg: 'Успех',
                        metaVerify
                    });
                } else {
                    res.json({
                        ok: false,
                        msg: 'Ошибка. Метатег не найден',
                        metaVerify
                    });
                }
            } else {
                res.json({
                    ok: false,
                    msg:  'Ошибка',
                });
            }

        });
    } catch (error) {
        if(error.code === 503){
            console.log()
            res.json({
                ok: false,
                msg: 'Ошибка 503'
            })
        }
    }


});

router.post('/', async (req, res, next) => {

    const owner = req.body.owner.trim();
    const uri = req.body.uri.trim();
    const dbType = req.body.dbType.trim();
    const dbUser = req.body.dbUser.trim();
    const dbPassword = req.body.dbPassword.trim();
    const dbTable = req.body.dbTable.trim();
    const dbUrl = req.body.dbUrl.trim();
    const port = req.body.owner.trim();

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

    if (!appData.owner || !appData.uri || !appData.dbType || !appData.dbUser || !appData.dbPassword || !appData.dbTable || !appData.dbUrl) {
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