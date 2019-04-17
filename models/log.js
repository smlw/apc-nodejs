const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    owner    : { type: Schema.Types.ObjectId, required: true },
    appId    : { type: Schema.Types.ObjectId, required: true },
    category : { type: String, required: true},
    type     : { type: String, required: true},
    recText  : { type: Object, required: true},
    createAt : { type: Date, default: Date.now }
}, {
    timestamps: true
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Log', schema);