const express = require('express');
const router = express.Router();
const models = require('../models')
const config = require('../config');
const NodeRSA = require('node-rsa');
const key = new NodeRSA(config.PRIVATE_KEY);
const mysql = require('mysql');

router.get('/:id', async (req, res, next) => {

  // Id of app & user
  const id = req.params.id.trim().replace(/ +(?= )/g, '');

  try {
    // DB query to get app info
    const app = await models.App.findOne({
      _id: id,
      owner: req.user.id
    })
    const logs = await models.Log.find({
        owner: req.user.id,
        appId: id
      })
      .sort({
        createdAt: -1
      })

    const appUser = async () => {
      const host = key.decrypt(app.dbHost, 'utf8');
      const user = key.decrypt(app.dbUser, 'utf8');
      const password = key.decrypt(app.dbPassword, 'utf8');
      const tableName = key.decrypt(app.dbTable, 'utf8');
      const database = key.decrypt(app.dbName, 'utf8');
      return new Promise(async (resolve, reject) => {
        let connection = mysql.createConnection({
          host: host,
          user: user,
          password: password,
          tableName: tableName,
          database: database,
          port: app.dbPort
        });
        await connection.connect(function (err) {
          if (err) {
            reject(err.code)
            console.log(err.code)
            connection.end();
          } else {
            const SQLUsers = `SELECT * FROM apc_users222`;
            connection.query(SQLUsers, function (err, result) {
              if (err) {
                reject(err.code)
                console.log(err.code)
              } else {
                resolve(result)
                // console.log(result)
              }
            });
            connection.end();
          };
        });
      })
    }
    // If !app return status code 404
    if (!app) {
      res.send(404)
    }


    appUser()
      .then((users) => {
        // Render view with app-object
        console.log(users)
        res.render('editApp', {
          logs,
          app: [{
            users,
            appId: app._id,
            domain: key.decrypt(app.domain, 'utf8'),
            dbHost: key.decrypt(app.dbHost, 'utf8'),
            dbName: key.decrypt(app.dbName, 'utf8'),
            dbUser: key.decrypt(app.dbUser, 'utf8'),
            dbPassword: 'Скрыто',
            dbTable: key.decrypt(app.dbTable, 'utf8'),
            dbType: app.dbType
          }],
          user: req.user
        })
      })
      .catch((err) => {
        console.log(err)
      });



  } catch (error) {
    res.status(500)
  }


});

module.exports = router;