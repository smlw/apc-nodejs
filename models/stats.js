const adapterMongoDB = require('../adapters/mongodb');

const Stats = adapterMongoDB.schema.define('Stats', {
    appId:              { type: String, required: true},
    percentSecurity:    { type: Number, required: false },
    changePasswordCount:{ type: Number, required: false },
    sendMsgCount:       { type: Number, required: false }
});

module.exports = ('Stats', Stats);