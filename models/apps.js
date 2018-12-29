var Schema = require('jugglingdb').Schema;
var schema = new Schema('mongodb', {
    url: 'mongodb://localhost:27017/apc',
    w:1,
    j:1
});

const Apps = schema.define('Apps', {
    owner:      { type: String, required: true},
    uri:        { type: String, required: true},
    dbType:     { type: String, required: true},
    dbUser:     { type: String, required: true},
    dbPassword: { type: String, required: true},
    dbTable:    { type: String, required: true},
    dbUrl:      { type: String, required: true},
    isActive:   { type: Boolean},
    port:       { type: Number},
    createAt:   { type: Date, default: Date.now}
});

module.exports = ('Apps', Apps);