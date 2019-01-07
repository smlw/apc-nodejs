const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const models = require('../models');
const cheerio = require('cheerio');
const request = require('request');

router.get('/', (req, res) => {
    res.render('addApp');
});

// CHECK VALID URL
const checkValidUrl = async (req, res) => {
    const url = req.body.url.trim();
    const isValidUrl = (url) => {
        const regex = /http(?:s?):\/\/([\w]+\.{1}[\w]+\.?[\w]+)+/g;
        const occurrence = url.match(regex);
        return (regex.test(url)) && (url === occurrence[0]);
    }
    if(isValidUrl(url)){
        await request(url, function (error, response) {
            if (!error && response.statusCode == 200) {
                res.json({
                    ok: true,
                    msg: 'Url сохранен',
                    url
                })
            } else {
                res.json({
                    ok: false,
                    msg: error.code
                })
            }
        });
    } else {
        res.json({
            ok: false,
            msg: 'Url должен быть вида http://site.ru или https://site.ru'
        })
    }
}

const checkRights = async (req, res) => { 
    const url = req.body.url.trim();
    const secretKey = req.body.secretKey.trim();

    try {
        await request(url, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                // const metaVerify = $("meta[name='apc-verification']").attr("content");
                const metaVerify = $("meta[http-equiv='content-type']").attr("content");

                // if (metaVerify === secretKey) {
                if (metaVerify) {
                    res.json({
                        ok: true,
                        msg: 'Права были подтверждены!'
                    });
                } else {
                    res.json({
                        ok: false,
                        msg: 'Ошибка. Метатег не найден'
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
}

const checkDbConnection = async (req, res) => { 
    const host = req.body.host.trim();
    const database = req.body.database.trim();
    const user = req.body.user.trim();
    const password = req.body.password.trim();
    const tableName = req.body.tableName.trim();
    const port = req.body.port.trim();
    const type = req.body.dbType.trim();

    // Проверяем, существует ли уже такая же БД
    try {
        const check = await models.App.findOne({
            dbHost: host
        });
        
        if(check){
            res.json({
                ok: false,
                msg: 'Приложение уже зарегистрировано!'
            });
        } else {
            try {
                let connection = mysql.createConnection({
                    host: host,
                    user: user,
                    password: password,
                    tableName: tableName,
                    database: database,
                    port: port
                });
        
                connection.connect(function (err) {
                    if (err) {
                        res.json({
                            ok: false,
                            msg: err.code
                        });
                        connection.end();
                    } else {
                        connection.query(`DESCRIBE ${tableName}`, function (err, result) {
                            if (err) {
                                res.json({
                                    ok: false,
                                    msg: err.code
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
                res.json({
                    ok: false,
                    msg: 'Ошибка соединения.'
                })
            }
        }
    } catch (error) {
        res.json({
            ok: false,
            msg: 'Попробуйте позже.'
        })   
    }
}



// CHECK STEP URL
router.post('/url', async(req, res) => checkValidUrl(req, res));

// CHECK RIGHTS 
router.post('/rights', async (req, res) => checkRights(req, res));

//CHECK DB CONNECTION
router.post('/db', async (req, res) => checkDbConnection(req, res));

// Saving app into database
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

    if(!domainName || (domainName.length < 6 || domainName.length > 60) ){
        res.json({
            ok: false,
            msg: 'Отказано. Проверьте поле домена!',
        });
    } else if (!rights) {
        res.json({
            ok: false,
            msg: 'Отказано. Не подтверждены права на сайт!'
        });
    } else if (!host || !database || !user || !password || !table || !type){
        res.json({
            ok: false,
            msg: 'Отказано. Проверьте правильность полей базы данных. Проверьте соединение!'
        });
    } else if (host.length < 6 || host.length > 60) {
        res.json({
            ok: false,
            msg: 'Отказано. Длина хоста от 4 до 64 символов!'
        });
    } else if (database.length < 1 || database.length > 60){
        res.json({
            ok: false,
            msg: 'Отказано. Длина имени базы данных от 1 до 64 символов!'
        });
    } else if (user.length < 2 || user.length > 60){
        res.json({
            ok: false,
            msg: 'Отказано. Длина имени пользователя БД от 1 до 64 символов!'
        });
    } else if (password.length < 8){
        res.json({
            ok: false,
            msg: 'Отказано. Длина пароля от 8 симоволов'
        });
    } else if (table.length < 2 || table.length > 60){
        res.json({
            ok: false,
            error: 'Отказано. Длина таблцы БД от 2 до 64 символов!'
        });
    } else if (port && Number.isInteger(port)){
        res.json({
            ok: false,
            msg: 'Отказано. Проверьте порт подключения!'
        });
    } else if (!col_user_id || !col_user_password || !col_user_email || !col_user_phone){
        res.json({
            ok: false,
            msg: 'Проверьте правильность полей для колонок!'
        });
    } else {
        // создаем запись в нашей БД
        const check = await models.App.findOne({
            dbHost: host
        });
        
        if(check){
            res.json({
                ok: false,
                msg: 'Приложение уже зарегистрировано!'
            });
        } else {
            try {
                const app = await models.App.create({
                    owner: 'owner',
                    domain : domainName,
                    dbHost: host,
                    dbName: database,
                    dbUser: user,
                    dbPassword: password,
                    dbTable: table,
                    dbPort: port,
                    dbType: type,
                    colUserId: col_user_id,
                    colUserPassword: col_user_password,
                    colUserEmail: col_user_email,
                    colUserPhone: col_user_phone
                });
    
                if(app){
                    res.json({
                        ok: true,
                        msg: 'Приложение было успешно зарегистрировано!'
                    })
                } else {
                    res.json({
                        ok: false,
                        msg: 'Настройки не сохранены! Повторите позже!'
                    });
                }
                
            } catch (error) {
                res.json({
                    ok: false,
                    msg: 'Повторите позже!'
                });
            }
        }
    }
})

module.exports = router;