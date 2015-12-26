var ebook = require('../models/ebook.js');

exports.getEbooks = function(req,res) {
	var options = {};
	
	if(req.query.key) {
		options.title = new RegExp('.*'+req.query.key+'.*', 'i');
	}

	if(req.query.tag) {
		options.tags = req.query.tag;
	}
	
	ebook.find(options, function(err, books){
    if(err)
    	res.send(err);
    res.json(books);
  });	
};