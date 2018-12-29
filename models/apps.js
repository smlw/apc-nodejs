var Schema = require('jugglingdb').Schema;

var schema = new Schema('mongodb', {
    owner:      { type: Schema.Types.ObjectId, required: true},
    uri:        { type: String, required: true},
    dbType:     { type: String, required: true},
    dbUser:     { type: String, required: true},
    dbPassword: { type: String, required: true},
    dbTable:    { type: String, required: true},
    dbUrl:      { type: String, required: true},
    isActive:   { type: Boolean},
    port:       { type: Integer},
}, {
    timestamps: true
});

schema.set('toJSON', {virtuals: true});

module.exports('Apps', schema);