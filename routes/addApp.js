const express = require('express');
const router = express.Router();
const models = require('../models');
const cheerio = require('cheerio');
const request = require('request');
const mysql = require('mysql');

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

                if (metaVerify) {
                    res.json({
                        ok: true,
                        msg: 'Права были подтверждены!',
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
                    msg: 'Ошибка',
                });
            }

        });
    } catch (error) {
        if (error) {
            res.json({
                ok: false,
                msg: 'Ошибка проверки. Попробуйте позже.'
            })
        }
        if (error.code === 503) {
            res.json({
                ok: false,
                msg: 'Ошибка 503'
            })
        }
    }
});

//CHECK DB CONNECTION
router.post('/db', async (req, res) => {
    const host = req.body.host.trim();
    const database = req.body.database.trim();
    const user = req.body.user.trim();
    const password = req.body.password.trim();
    const tableName = req.body.tableName.trim();
    const port = req.body.port.trim() || '';
    const type = req.body.dbType.trim();

    try {
        let connection = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            tableName: tableName,
            database: database
        });

        connection.connect(function (err) {
            console.log('Tried connection')
            if (err) {
                res.json({
                    ok: false,
                    msg: 'Ошибка подключения! ' + err.code
                });
                connection.end();
            } else {
                connection.query('DESCRIBE wercs_users', function (err, result, field) {
                    if (err) {
                        res.json({
                            ok: false,
                            msg: 'Ошибка. Таблица не найдена'
                        });
                    } else {
                        let cols = [];
                        result.forEach(element => {
                            cols.push(element.Field)
                        });

                        res.json({
                            ok: true,
                            msg: 'Соединение было установлено!',
                            cols
                        });
                    }
                });
                connection.end();
            };
        });
    } catch (error) {
        if (error) {
            res.json({
                ok: false,
                msg: 'Ошибка.'
            })
        }
    }
});


router.post('/save', async (req, res, next) => {
    const domainName = req.body.domainName.trim();
    const rights = req.body.checkRights;
    const host = req.body.DBData.host.trim();
    const database = req.body.DBData.database.trim();
    const user = req.body.DBData.user.trim();
    const password = req.body.DBData.password.trim();
    const table = req.body.DBData.tableName.trim();
    const port = req.body.DBData.port.trim();
    const type = req.body.DBData.DBtype.trim();
    const col_user_id = req.body.DBData.cols.user_id.trim();
    const col_user_password = req.body.DBData.cols.user_password.trim();
    const col_user_email = req.body.DBData.cols.user_email.trim();
    const col_user_phone = req.body.DBData.cols.user_phone.trim();

    console.log(appData)
    if(!domainName || (domainName.length < 6 || domainName.length > 60) ){
        res.json({
            ok: false,
            error: 'Отказано. Проверьте поле домена!',
        });
    } else if (!rights) {
        res.json({
            ok: false,
            error: 'Отказано. Не подтверждены права на сайт!'
        });
    } else if (!host || !database || !user || !password || !table || !port || !type){
        res.json({
            ok: false,
            error: 'Отказано. Проверьте правильность полей базы данных. Проверьте соединение!'
        });
    } else if (host.length < 6 || host.length > 60) {
        res.json({
            ok: false,
            error: 'Отказано. Длина хоста от 4 до 64 символов!'
        });
    } else if (database.length < 1 || database.length > 60){
        res.json({
            ok: false,
            error: 'Отказано. Длина имени базы данных от 1 до 64 символов!'
        });
    } else if (user.length < 2 || user.length > 60){
        res.json({
            ok: false,
            error: 'Отказано. Длина имени пользователя БД от 1 до 64 символов!'
        });
    } else if (password.length < 8){
        res.json({
            ok: false,
            error: 'Отказано. Длина пароля от 8 симоволов'
        });
    } else if (table.length < 2 || table.length > 60){
        res.json({
            ok: false,
            error: 'Отказано. Длина таблцы БД от 2 до 64 символов!'
        });
    } else if (!(Number.isNan(port))){
        res.json({
            ok: false,
            error: 'Отказано. Порт должен быть числом!'
        });
    } else if (!col_user_id || !col_user_password || !col_user_email || !col_user_phone){
        res.json({
            ok: false,
            error: 'Проверьте правильность полей для колонок!'
        });
    }
    
    else {
        // создаем запись в нашей БД
    }
})

module.exports = router;