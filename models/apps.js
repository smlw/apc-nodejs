const adapterMongoDB = require('../adapters/mongodb');

const Apps = adapterMongoDB.schema.define('Apps', {
    owner:      { type: String, required: true},
    uri:        { type: String, required: true},
    dbType:     { type: String, required: true},
    dbUser:     { type: String, required: true},
    dbPassword: { type: String, required: true},
    dbTable:    { type: String, required: true},
    dbUrl:      { type: String, required: true},
    isActive:   { type: Boolean, default: false},
    port:       { type: Number},
    createAt:   { type: Date, default: Date.now}
});

module.exports = ('Apps', Apps);