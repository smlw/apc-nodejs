const spdy = require('spdy');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const expressHbs = require("express-handlebars");
const layouts = require('express-handlebars-layouts');
const handlebarsStatic = require('handlebars-static');

const app = express();

// VIEW ENGINE
const staticUrl = '/';
const hbs = expressHbs.create({
    layoutsDir: "views/layouts", 
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
app.use('/stylesheets', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/javascripts', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/javascripts', express.static(__dirname + '/node_modules/bootstrap/js/dist'));
app.use('/javascripts', express.static(__dirname + '/node_modules/jquery-validation/dist'));

app.use(express.static('public'));

// BODYPARSER
app.use(bodyParser.urlencoded({
    extended: true
}));

// ROUTERS
const routes = require('./routes');
app.use('/app/add', routes.addApp);

app.get('/', (req, res) => {
    res.render("index")
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

const AdapterMongoDB = require('./adapters/mongodb');

AdapterMongoDB.schema
.on('connected', function() {
    console.log('Connect to DataBase')
})
.on('log', function(msg, duration) {
    console.log(msg);
})
