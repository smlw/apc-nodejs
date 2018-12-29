var Schema = require('jugglingdb').Schema;
var schema = new Schema('mongodb', {
    url: 'mongodb://localhost:27017/apc'
});

module.exports = {
    Schema,
    schema
}