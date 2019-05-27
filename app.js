const config = require('./config');
const spdy = require('spdy');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const expressHbs = require("express-handlebars");
const layouts = require('express-handlebars-layouts');
const handlebarsStatic = require('handlebars-static');

const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const session = require('express-session');
const models = require('./models');
const flash = require('connect-flash');
require('./passport')(passport)

const app = express();

// DATABASE
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connection
    .on('error', error => console.log(error))
    .on('close', () => console.log('Database connection closed.'))
    .once('open', () => {
        const info = mongoose.connections[0];
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    });

mongoose.connect(config.MONGO_URL);

// VIEW ENGINE
const staticUrl = '/';
const hbs = expressHbs.create({
    layoutsDir: "views/partials/layouts",
    partialsDir: "views/partials",
    defaultLayout: "base",
    extname: "hbs",
    helpers: {
        static: handlebarsStatic(staticUrl)
    }
});
hbs.handlebars.registerHelper(layouts(hbs.handlebars));

// BODYPARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// SET & USES
app.engine("hbs", hbs.engine)
app.set("view engine", "hbs");
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use('/stylesheets', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/javascripts', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/javascripts', express.static(__dirname + '/node_modules/bootstrap/js/dist'));
app.use('/javascripts', express.static(__dirname + '/node_modules/jquery-validation/dist'));
app.use('/javascripts', express.static(__dirname + '/node_modules/popper.js/dist'));
app.use(cookieParser());
app.use(session({
    secret: 'thisASecret',
    saveInitialized: false,
    resave: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// require('./utils/apcDriver')();

// ROUTERS
const routes = require('./routes');

// Check authentication
const loggedin = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')
app.use('/app/add', loggedin, routes.addApp);
app.use('/app/edit', loggedin, routes.editApp);
app.use('/account', loggedin, routes.account);
app.use('/apc/single', loggedin, routes.apcSingle);
app.use('/instruction', routes.instruction);
app.use('/auth', routes.auth(passport));

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login', {
        user: req.user,
        message: req.flash('message')
    })
});

app.get('/signup', (req, res) => {
    res.render('signup')
});


app.get('/', (req, res) => {
    res.render("index", {
        layout: 'base'
    })
});

// SERVER
spdy
    .createServer({
        key: fs.readFileSync(path.resolve(__dirname, './certs/privateKey.key')),
        cert: fs.readFileSync(path.resolve(__dirname, './certs/certificate.crt'))
    }, app)
    .listen(8000, (err) => {
        if (err) {
            throw new Error(err);
        }

        /* eslint-disable no-console */
        console.log(`Listening on port: ${config.PORT}`);
        /* eslint-enable no-console */
    });

module.exports = app;