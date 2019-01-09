const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    login       : {type: String, required: true},
    email       : {type: String, required: true},
    password    : {type: String, required: true},
    security    : {type: Boolean, default: false},
    appsCount   : {type: Number, default: 0}
}, {
    timestamps: true
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('User', schema);