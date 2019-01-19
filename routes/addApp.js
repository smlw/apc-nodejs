const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const models = require('../models');
const cheerio = require('cheerio');
const request = require('request');
const async = require('async');
const config = require('../config');
const NodeRSA = require('node-rsa');
const key = new NodeRSA(config.PRIVATE_KEY); 

router.get('/', (req, res) => {
    res.render('addApp', {user: req.user});
});
 
// CHECK VALID URL
const checkValidUrl = async (req, res) => {

    const url = req.body.url.trim();

    // func of test valid url
    const isValidUrl = (url) => {
        const regex = /http(?:s?):\/\/([\w]+\.{1}[\w]+\.?[\w]+)+/g;
        const occurrence = url.match(regex);
        return (regex.test(url)) && (url === occurrence[0]);
    }

    return new Promise(async (resolve, reject) => {
        // If url is correct await to this site
        if (isValidUrl(url)) {
            await request(url, function (error, response) {
                if (!error && response.statusCode == 200) {
                    resolve(true)
                } else {
                    reject(error.code)
                }
            });
        } else {
            reject('Url должен быть вида http://site.ru или https://site.ru')
        }
    })
}

// CHECK RIGHTS
const checkRights = async (req, res) => {
    const url = req.body.url.trim();
    const secretKey = req.body.secretKey.trim();

    return new Promise(async (resolve, reject) => {
        // Check rights of the site. Compare contains metatag as secret key
        try {
            await request(url, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
                    // const metaVerify = $("meta[name='apc-verification']").attr("content");
                    const metaVerify = $("meta[http-equiv='content-type']").attr("content");

                    // if (metaVerify === secretKey) {
                    if (metaVerify) {
                        resolve(true)
                    } else {
                        reject(error.code)
                    }
                } else {
                    reject(error.code)
                }
            });
        } catch (error) {
            reject('Попробуйте позже!')
        }
    })
}

// CHECK DB CONECTION
const checkDbConnection = async (req, res) => {
    const host = req.body.host.trim();
    const database = req.body.database.trim();
    const user = req.body.user.trim();
    const password = req.body.password.trim();
    const tableName = req.body.tableName.trim();
    const port = req.body.port.trim();
    const type = req.body.dbType.trim().toLowerCase();

    // Проверяем, существует ли уже такая же БД
    return new Promise(async (resolve, reject) => {
        try {
            // Select from DB
            const checkDeplucateDB = await models.App.findOne({
                dbHost: host
            });

            if (checkDeplucateDB) {
                reject('Приложение уже зарегистрировано!')
            } else {
                // Connect to DB
                try {
                    switch (type) {
                        case "mysql":
                            // DB data
                            let connection = mysql.createConnection({
                                host: host,
                                user: user,
                                password: password,
                                tableName: tableName,
                                database: database,
                                port: port
                            });

                            // DB conenction
                            connection.connect(function (err) {
                                if (err) {
                                    reject(err.code)
                                    connection.end();
                                } else {
                                    connection.query(`DESCRIBE ${tableName}`, function (err, result) {
                                        if (err) {
                                            reject(err.code)
                                        } else {
                                            let cols = [];
                                            result.forEach(element => {
                                                cols.push(element.Field)
                                            });
                                            resolve(cols)
                                        }
                                    });
                                    connection.end();
                                };
                            });
                            break;

                        default:
                            break;
                    }
                } catch (error) {
                    reject('Ошибка соединения!')
                }
            }
        } catch (error) {
            reject('Попробуйте позже!')
        }
    })
}



// CHECK URL
router.post('/url', async (req, res) => {
    checkValidUrl(req, res)
        .then((response) => {
            res.json({
                ok: response,
                msg: 'Url сохранен!'
            });
        })
        .catch((err) => {
            res.json({
                ok: false,
                msg: err
            });
        });
});

// CHECK RIGHTS 
router.post('/rights', async (req, res) => {
    checkRights(req, res)
        .then((response) => {
            res.json({
                ok: response,
                msg: 'Права подтверждены!'
            });
        })
        .catch((err) => {
            res.json({
                ok: false,
                msg: err
            });
        });
});

//CHECK DB CONNECTION
router.post('/db', async (req, res) => {
    checkDbConnection(req, res)
        .then((response) => {
            res.json({
                ok: true,
                msg: 'Соединение установлено!',
                cols: response
            });
        })
        .catch((err) => {
            res.json({
                ok: false,
                msg: err
            });
        });
});

// Saving app into database
router.post('/save', async (req, res) => {
    async.parallel([
        function (callback) {
            checkValidUrl(req, res)
                .then(() => {
                    callback(null, 'Url проверен ... Ок')
                })
                .catch((err) => {
                    callback(err)
                });
        },
        function (callback) {
            checkRights(req, res)
                .then(() => {
                    callback(null, 'Права подтверждены ... Ок')
                })
                .catch((err) => {
                    callback(err)
                });
        },
        function (callback) {
            checkDbConnection(req, res)
                .then(() => {
                    callback(null, 'Соединение с базой есть ... Ок')
                })
                .catch((err) => {
                    callback(err)
                });
        }
    ], async (err, results) => {
        // optional callback
        if (err) {
            console.log(err)
            res.json({
                ok: false,
                msg: err,
            })
        } else if (results) {
            console.log(results)
            try {
                const userId = req.user.id;
                const url = req.body.url.trim();
                const host = req.body.host.trim();
                const database = req.body.database.trim();
                const user = req.body.user.trim();
                const password = req.body.password.trim();
                const table = req.body.tableName.trim();
                const port = req.body.port.trim() || '';
                const dbType = req.body.dbType.trim();

                const col_user_id = req.body.col_user_id.trim();
                const col_user_password = req.body.col_user_password.trim();
                const col_user_email = req.body.col_user_email.trim();
                const col_user_phone = req.body.col_user_phone.trim();

                // console.log(key)
                const newApp = await models.App.create({
                    owner: userId,
                    domain:     key.encrypt(url, 'base64'),
                    dbHost:     key.encrypt(host, 'base64'),
                    dbName:     key.encrypt(database, 'base64'),
                    dbUser:     key.encrypt(user, 'base64'),
                    dbPassword: key.encrypt(password, 'base64'),
                    dbTable:    key.encrypt(table, 'base64'),
                    dbPort: port,
                    dbType: dbType,
                    colUserId: col_user_id,
                    colUserPassword: col_user_password,
                    colUserEmail: col_user_email,
                    colUserPhone: col_user_phone
                });

                if (newApp) {
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
    });
})

module.exports = router;