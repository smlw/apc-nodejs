const models = require('../models');
const config = require('../config')
const NodeRSA = require('node-rsa');
const mysql = require('mysql');
const passGen = require('./passGen')
const key = new NodeRSA(config.PRIVATE_KEY);

module.exports = async () => {
    try {
        // Query to get apps from database
        const apps = await models.App.find({
            isActive: true
        });

        // Decrypt domain fields
        apps.forEach(field => {
            field.domain = key.decrypt(field.domain, 'utf8');
            field.dbHost = key.decrypt(field.dbHost, 'utf8');
            field.dbName = key.decrypt(field.dbName, 'utf8');
            field.dbUser = key.decrypt(field.dbUser, 'utf8');
            field.dbPassword = key.decrypt(field.dbPassword, 'utf8');
            field.dbTable = key.decrypt(field.dbTable, 'utf8');
        });

        return new Promise(async (resolve, reject) => {
            apps.forEach(app => {
                let connection = mysql.createConnection({
                    host: app.dbHost,
                    user: app.dbUser,
                    password: app.dbPassword,
                    database: app.dbName,
                    port: app.dbPort
                });
    
                // DB conenction
                connection.connect(function (err) {
                    if (err) {
                        reject(err.code)
                        connection.end();
                    } else {
                        connection.query(`SELECT * FROM apc_users WHERE isActive = 1`, function (err, result) {
                            if (!err) {
                                result.forEach(u => {
                                    // func to converting 1/0 to true/false
                                    convertBool = (param) => param === 1 ? true : false;

                                    // 1. Генерируем пароль
                                    // 2. Отсылаем его на почту
                                    // 3. Если отправлено было удачно, то меняем в базе данных

                                    // Generate new password with user settings
                                    const newPassword = passGen(
                                            u.length, 
                                            convertBool(u.numbers), 
                                            convertBool(u.symbols), 
                                            convertBool(u.uppersace), 
                                            convertBool(u.excludeSimilarCharacters), 
                                            u.exclude, 
                                            convertBool(u.strict))

                                    console.log(newPassword)
                                }) 
                            } else {
                                reject(err.code)
                            }
                        });
                        connection.end();
                    };
                });
            })
    
            console.log(apps)
        })
    } catch (error) {
        console.log(error)
    }


}