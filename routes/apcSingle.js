const express = require('express');
const router = express.Router();
const models = require('../models');
const config = require('../config')
const NodeRSA = require('node-rsa');
const mysql = require('mysql');
const passGen = require('../utils/passGen')
const key = new NodeRSA(config.PRIVATE_KEY);
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt-nodejs')

router.post('/loadUsers', async (req, res) => {

  const appId = req.body.appId.trim();

  const mainApp = await models.App.findOne({
    _id: appId
  })

  const app = {
    domain: key.decrypt(mainApp.domain, 'utf8'),
    dbHost: key.decrypt(mainApp.dbHost, 'utf8'),
    dbName: key.decrypt(mainApp.dbName, 'utf8'),
    dbUser: key.decrypt(mainApp.dbUser, 'utf8'),
    dbPassword: key.decrypt(mainApp.dbPassword, 'utf8'),
    dbTable: key.decrypt(mainApp.dbTable, 'utf8')
  }

  return new Promise(async (resolve, reject) => {
    let connection = mysql.createConnection({
      host: app.dbHost,
      user: app.dbUser,
      password: app.dbPassword,
      tableName: app.dbTable,
      database: app.dbName,
      port: app.dbPort
    });
    await connection.connect(function (err) {
      if (err) {
        reject(err.code)
        console.log(err.code)
        res.json({
          ok: false,
          msg: 'Код ошибки' + err.code
        })
        connection.end();
      } else {
        connection.query(`INSERT INTO apc_users222 (userId, username, email) SELECT DISTINCT id, username, email FROM wercs_users WHERE id NOT IN (SELECT DISTINCT userId FROM apc_users222)`, function (err, result) {
          if (err) {
            console.log(err)
            reject(false)
            res.json({
              ok: false,
              msg: 'Ошибка. Не удалось обновить список пользователей.'
            })
          } else {
            res.json({
              ok: true,
              msg: 'Список пользователей успешно обновлен!'
            })

            // Write succes to log
            models.Log.create({
              owner: app.owner,
              appId: appId,
              recText: {
                res: result.message
              },
              category: 'password',
              type: 'success'
            })
          }
          connection.end();
        })
      }
    })
  })
})

router.post('/', async (req, res) => {
  // const changerId = req.body.changerId.trim();
  const appId = req.body.app.trim();
  const userId = req.body.user;

  const mainApp = await models.App.findOne({
    _id: appId
  })

  const app = {
    domain: key.decrypt(mainApp.domain, 'utf8'),
    dbHost: key.decrypt(mainApp.dbHost, 'utf8'),
    dbName: key.decrypt(mainApp.dbName, 'utf8'),
    dbUser: key.decrypt(mainApp.dbUser, 'utf8'),
    dbPassword: key.decrypt(mainApp.dbPassword, 'utf8'),
    dbTable: key.decrypt(mainApp.dbTable, 'utf8')
  }

  return new Promise(async (resolve, reject) => {
    let connection = mysql.createConnection({
      host: app.dbHost,
      user: app.dbUser,
      password: app.dbPassword,
      tableName: app.dbTable,
      database: app.dbName,
      port: app.dbPort
    });
    await connection.connect(function (err) {
      if (err) {
        reject(err.code)
        console.log(err.code)
        connection.end();
      } else {
        connection.query(`SELECT * FROM apc_users222 WHERE apc_users222.userId = ${userId}`, function (err, result) {
          convertBool = (param) => param === 1 ? true : false;
          // 1. Генерируем пароль
          // Generate new password with user settings
          const newPassword = passGen(10,1,1,1,1,0,1)

          const hashNewPassword = bcrypt.hashSync(newPassword)
          console.log(newPassword, hashNewPassword)
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
            to: `${result[0].email}`, // list of receivers
            subject: 'Новый пароль!', // Subject line
            text: 'Hello world ?', // plaintext body
            html: `
              Дата: ${now} <br>
              Ресурс: ${app.domain}<br>
              Пользователь: ${result[0].username}<br>
              <b>Пароль: ${newPassword}</b>
            ` // html body
          };

          // send mail with defined transport object
          transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
              // Write erro to log
              models.Log.create({
                owner: app.owner,
                appId: appId,
                recText: {
                  res: error.code,
                  user: result[0].email
                },
                category: 'password',
                type: 'error'
              })
              return false
            } else {
              connection.query(`UPDATE ${app.dbTable} SET ${mainApp.colUserPassword} = '${hashNewPassword}' WHERE ${mainApp.colUserId} = ${userId}`, function (err, result) {
                if (err) {
                  console.log(err)
                  res.json({
                    ok: false,
                    msg: 'Ошибка при обновлении пароля!'
                  })
                  
                  // Write succes to log
                  models.Log.create({
                    owner: app.owner,
                    appId: appId,
                    recText: {
                      res: err,
                      user: userId
                    },
                    category: 'password',
                    type: 'error'
                  })
                } else {
                  res.json({
                    ok: true,
                    msg: 'Пароль пользователя успешно изменен!'
                  })

                  // Write succes to log
                  models.Log.create({
                    owner: app.owner,
                    appId: appId,
                    recText: {
                      res: result.message,
                      user: userId
                    },
                    category: 'password',
                    type: 'success'
                  })
                }
              })
            }
          })
        })
      };
    });
  })
})

module.exports = router;