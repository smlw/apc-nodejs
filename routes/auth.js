const express = require('express');
const router = express.Router();
const models = require('../models')

module.exports = (passport) => {
    router.post('/signup', (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const repassword = req.body.repassword;

        //нужно сделать проверку на совпадение паролей и длину всех параметров
        models.User.findOne({
            email: email
        }, (err, doc) => {
            if (err) {
                res.json({
                    ok: false,
                    msg: 'Попробуйте позже!'
                });
            } else {
                if (doc) {
                    res.json({
                        ok: false,
                        msg: 'Пользователь с таким email уже зарегестрирован!'
                    });
                } else {
                    const schema = new models.User();
                    models.User.create({
                        email: email,
                        password: schema.hashPassword(password)
                    }).then(() => {
                        res.json({
                            ok: true
                        });
                    }).catch(err => {
                        res.json({
                            ok: false,
                            msg: err
                        });
                    })
                }
            }
        })
    });

    router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/account',
        failureFlash: true
    }));

    return router
};