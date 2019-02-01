const models = require('../models');
const config = require('../config')
const NodeRSA = require('node-rsa');
const mysql = require('mysql');
const passGen = require('./passGen')
const key = new NodeRSA(config.PRIVATE_KEY);
const nodemailer = require('nodemailer');
const PasswordHash = require('phpass').PasswordHash;
const passwordHash = new PasswordHash();

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
                        connection.query(`SELECT * FROM apc_users, ${app.dbTable} WHERE apc_users.userId  = ${app.dbTable}.${app.colUserId}`, function (err, result) {
                            if (!err) {
                                result.forEach(u => {
                                    // func to converting 1/0 to true/false
                                    convertBool = (param) => param === 1 ? true : false;

                                    // 1. Генерируем пароль

                                    // Generate new password with user settings
                                    const newPassword = passGen(
                                        u.length,
                                        convertBool(u.numbers),
                                        convertBool(u.symbols),
                                        convertBool(u.uppersace),
                                        convertBool(u.excludeSimilarCharacters),
                                        u.exclude,
                                        convertBool(u.strict))

                                    const hashNewPassword = passwordHash.hashPassword(newPassword);
                                    console.log(hashNewPassword)
                                    // 2. Отсылаем его на почту
                                    // NODE-MAILER
                                    const transporter = nodemailer.createTransport({
                                        host: "smtp.gmail.com",
                                        port: 587,
                                        secure: false, // upgrade later with STARTTLS
                                        tls: {
                                            rejectUnauthorized: false
                                        },
                                        auth: {
                                            user: config.EMAIL.LOGIN,
                                            pass: config.EMAIL.PASSWORD
                                        }
                                    });

                                    // setup e-mail data with unicode symbols
                                    var mailOptions = {
                                        from: `${app.domain}`, // sender address
                                        to: `${u.email}`, // list of receivers
                                        subject: 'Hello ✔', // Subject line
                                        text: 'Hello world ?', // plaintext body
                                        html: `Дата: Тут дата <br><b>Пароль: ${newPassword}</b>` // html body
                                    };

                                    // send mail with defined transport object
                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            return console.log(error);
                                        } else {
                                            // 3. Если отправлено было удачно, то меняем в базе данных
                                            connection.query(`UPDATE ${app.dbTable} SET ${app.colUserPassword} = '${hashNewPassword}' WHERE ${app.colUserId} = ${u.id}`, function (err, result) {
                                            // connection.query(`SELECT * FROM wercs_users`, function (err, result) {
                                                if (err) throw err;
                                                console.log(result);
                                            });
                                            console.log('Message sent: ' + info.response);
                                        }
                                    });

                                    transporter.verify(function (error, success) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            console.log("Server is ready to take our messages");
                                        }
                                    });


                                    console.log(newPassword)
                                })
                            } else {
                                reject(err.code)
                            }
                        });
                        // connection.end();
                    };
                });
            })

            console.log(apps)
        })
    } catch (error) {
        console.log(error)
    }


}