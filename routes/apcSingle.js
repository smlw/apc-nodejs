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
        connection.query(`SELECT * FROM apc_users222, ${app.dbTable} WHERE apc_users222.userId = ${userId}`, function (err, result) {
          convertBool = (param) => param === 1 ? true : false;
          // 1. Генерируем пароль
          // Generate new password with user settings
          const newPassword = passGen(
            10,
            1,
            1,
            1,
            1,
            0,
            1)

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
                }
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
              })
            }
          })
        })
      };
    });
  })

  // lego()
  //   .then(() => {
  //     console.log('then')
  //   })
  //   .catch(() => {
  //     console.log('catch')
  //   })

  // const newPassword = passGen(8, 1, 1, 1, 1, 1, 1)
  // const hashNewPassword = bcrypt.hashSync(newPassword)

  // const transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   port: 587,
  //   secure: false, // upgrade later with STARTTLS
  //   tls: {
  //     rejectUnauthorized: false
  //   },
  //   auth: {
  //     user: config.EMAIL.LOGIN,
  //     pass: config.EMAIL.PASSWORD
  //   }
  // });

  // //setup e-mail data with unicode symbols
  // const today = new Date();
  // const dd = String(today.getDate());
  // const mm = String(today.getMonth()); //January is 0!
  // const m = String(today.getMinutes()); //January is 0!
  // const h = String(today.getHours()); //January is 0!
  // const s = String(today.getSeconds()); //January is 0!
  // const yyyy = today.getFullYear();
  // let now = `${mm}/${dd}/${yyyy} ${h}:${m}:${s}`

  // var mailOptions = {
  //   from: 'APC.ru <password@apc.ru>', // sender address
  //   to: `${u.email}`, // list of receivers
  //   subject: 'Новый пароль!', // Subject line
  //   text: 'Hello world ?', // plaintext body
  //   html: `
  //     Дата: ${now} <br>
  //     <b>Пароль: ${newPassword}</b>
  //   ` // html body
  // };

  // // send mail with defined transport object
  // transporter.sendMail(mailOptions, async (error, info) => {
  //   if (error) {
  //     // Write erro to log
  //     return false
  //   } else {
  //     // 3. Если отправлено было удачно, то меняем в базе данных
  //     connection.query(`UPDATE ${app.dbTable} SET ${app.colUserPassword} = '${hashNewPassword}' WHERE ${app.colUserId} = ${u.id}`, function (err, result) {
  //       // connection.query(`SELECT * FROM wercs_users`, function (err, result) {
  //       if (err) throw err;
  //     });
  //   }
  // });

  // transporter.verify(function (error, success) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Server is ready to take our messages");
  //   }
  // });
  // console.log(newPassword)
})

module.exports = router;