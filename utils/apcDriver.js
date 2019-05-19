const models = require('../models');
const config = require('../config')
const NodeRSA = require('node-rsa');
const mysql = require('mysql');
const passGen = require('./passGen')
const key = new NodeRSA(config.PRIVATE_KEY);
const nodemailer = require('nodemailer');
const passwordHash = require('password-hash');
const bcrypt = require('bcrypt-nodejs')

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
        connection.connect( function (err) {
          if (err) {
            reject(err.code)
            connection.end();
            models.Log.create({
              owner: app.owner,
              appId: appId,
              recText: {
                res: 'Ошибка соединения с БД. Код ошибки ',
                user: err.code
              },
              category: 'database',
              type: 'error'
            })
          } else {
            connection.query(`SELECT * FROM apc_users222, ${app.dbTable} WHERE apc_users222.userId  = ${app.dbTable}.${app.colUserId}`, function (err, result) {
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

                  const hashNewPassword = bcrypt.hashSync(newPassword)
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

                  //setup e-mail data with unicode symbols
                  const today = new Date();
                  const dd = String(today.getDate());
                  const mm = String(today.getMonth()); //January is 0!
                  const m = String(today.getMinutes()); //January is 0!
                  const h = String(today.getHours()); //January is 0!
                  const s = String(today.getSeconds()); //January is 0!
                  const yyyy = today.getFullYear();
                  let now = `${mm}/${dd}/${yyyy} ${h}:${m}:${s}`

                  var mailOptions = {
                    from: 'APC.ru <password@apc.ru>', // sender address
                    to: `${u.email}`, // list of receivers
                    subject: 'Новый пароль!', // Subject line
                    text: 'Hello world ?', // plaintext body
                    html: `
                      Дата: ${now} <br>
                      Ресурс: ${app.domain}<br>
                      <b>Пароль: ${newPassword}</b>
                    ` // html body
                  };

                  // send mail with defined transport object
                  transporter.sendMail(mailOptions, async (error, info) => {
                    if (error) {
                      // Write erro to log
                      models.Log.create({
                        owner: app.owner,
                        appId: app._id,
                        recText: {
                          res: 'Ошибка отправки сообщеня на почту. Код ошибки ' + error.code + ' Email: ',
                          user: u.email
                        },
                        category: 'password',
                        type: 'error'
                      })
                      return false
                    } else {
                      // 3. Если отправлено было удачно, то меняем в базе данных
                      connection.query(`UPDATE ${app.dbTable} SET ${app.colUserPassword} = '${hashNewPassword}' WHERE ${app.colUserId} = ${u.id}`, function (err, result) {
                        // connection.query(`SELECT * FROM wercs_users`, function (err, result) {
                        if (err) throw err;
                        // Write succes to log
                        models.Log.create({
                          owner: app.owner,
                          appId: app._id,
                          recText: {
                            res: 'Успешная массовая смена пароля пользователя с email ',
                            user: u.email
                          },
                          category: 'password',
                          type: 'success'
                        })
                      });
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