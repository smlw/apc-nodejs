const adapterMongoDB = require('../adapters/mongodb');

const Users = adapterMongoDB.schema.define('Users', {
    email:      { type: String, required: true},
    password:   { type: String, required: true},
    appsCount:  { type: Number},
    apcIsActive:{ type: Boolean, default: false},
});

module.exports = ('Users', Users);