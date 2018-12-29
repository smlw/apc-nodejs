const spdy = require('spdy');
const express = require('express');
const path = require('path');
const fs = require('fs'); 
const bodyParser = require('body-parser');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

const AdapterMongoDB = require('./adapters/mongodb');
AdapterMongoDB.schema
    .on('connected', function() {
        console.log('Connect to DataBase')
    })

// ROUTERS
const routes = require('./routes');
app.use('/app/add', routes.addApp);

app.get('/', (req, res) => {
    res.render('index')
});


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
