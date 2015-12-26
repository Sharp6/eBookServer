var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ebookSchema = new Schema({
 id: String,
 title: String,
 author: String,
 publisher: String,
 url: String,
 tags: [ String ]
});

module.exports = mongoose.model('ebook', ebookSchema);