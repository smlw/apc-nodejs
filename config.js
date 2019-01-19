const dotenv = require('dotenv');
const path = require('path');

const root = path.join.bind(this, __dirname);
dotenv.config({path: root('.env')});

module.exports = {
    PUBLIC_KEY: process.env.PUBLIC_KEY,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
}