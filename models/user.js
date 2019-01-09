const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs')

const schema = new Schema({
    login       : {type: String, required: false},
    email       : {type: String, required: false},
    password    : {type: String, required: false},
    security    : {type: Boolean, default: false},
    appsCount   : {type: Number, default: 0}
}, {
    timestamps: true
});

schema.methods.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
schema.methods.comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('User', schema);