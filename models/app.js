const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    owner:              { type: String, required: true },
    domain:             { type: String, required: true },
    dbHost:             { type: String, required: true },
    dbName:             { type: String, required: true },
    dbUser:             { type: String, required: true },
    dbPassword:         { type: String, required: true },
    dbTable:            { type: String, required: true },
    dbPort:             { type: Number },
    dbType:             { type: String, required: true },
    dbFullLink:         { type: String },
    colUserId:          { type: String, required: true },
    colUserPassword:    { type: String, required: true },
    colUserEmail:       { type: String, required: true },
    colUserPhone:       { type: String},
    isActive:           { type: Boolean, default: false},
    createAt:           { type: Date, default: Date.now }
}, {
    timestamps: true
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('App', schema);