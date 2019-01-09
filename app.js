const spdy = require('spdy');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const expressHbs = require("express-handlebars");
const layouts = require('express-handlebars-layouts');
const handlebarsStatic = require('handlebars-static');

const passport = require('passport');
const session = require('express-session');
const models = require('./models')

require('./passport')(passport)

//database
const mongoose = require('mongoose');
// const config = require('./config');

mongoose.Promise = global.Promise;
// mongoose.set('debug', config.IS_PRODUCTION);

mongoose.connection
    .on('error', error => console.log(error))
    .on('close', () => console.log('Database connection closed.'))
    .once('open', () => {
        const info = mongoose.connections[0];
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
        // require('./mocks')();
    });

mongoose.connect('mongodb://127.0.0.1:27017/apc');


const app = express();

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
app.use(session({
    secret: 'thisASecret',
    saveInitialized: false,
    resave: false
}));
app.use(passport.initialize())
app.use(passport.session())


// BODYPARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// ROUTERS
const auth = require('./routes/auth')(passport);
const routes = require('./routes');
app.use('/app/add', routes.addApp);
app.use('/account', routes.account);
app.use('/auth', auth);


app.get('/', (req, res) => {
    res.render("index", {
        layout: 'base'
    })
});

const loggedin = function (req, res, next){
    if(req.isAuthenticated()){
        next()
    } else {
        res.redirect('/login')
    }
}

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login')
});

app.get('/signup', (req, res) => {
    res.render('signup')
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
        console.log('Listening on port: ' + 8000 + '.');
        /* eslint-enable no-console */
    });


// DATABASE

module.exports = app;