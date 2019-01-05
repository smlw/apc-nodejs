const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    owner:      { type: Schema.Types.ObjectId, required: true },
    uri:        { type: String, required: true },
    dbType:     { type: String, required: true },
    dbUser:     { type: String, required: true },
    dbPassword: { type: String, required: true },
    dbTable:    { type: String, required: true },
    dbUrl:      { type: String, required: true },
    isActive:   { type: Boolean, default: false },
    port:       { type: Number },
    dbFullLink: { type: String },
    createAt:   { type: Date, default: Date.now }
}, {
    timestamps: true
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('App', schema);