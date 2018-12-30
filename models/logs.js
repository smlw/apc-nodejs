const adapterMongoDB = require('../adapters/mongodb');

const Logs = adapterMongoDB.schema.define('Logs', {
    appId:              { type: String, required: true},
    connectDate:        { type: Date, default: Date.now },
    successChange:      { type: Number }
});

module.exports = ('Logs', Logs);