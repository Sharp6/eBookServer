var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ebookSchema = new Schema({
 id: String,
 title: String,
 url: String,
 tags: [ String ]
});

module.exports = mongoose.model('ebook', ebookSchema);