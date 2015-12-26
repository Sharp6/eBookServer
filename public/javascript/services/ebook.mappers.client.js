define(['knockout', '../models/ebook.model.client'], function(ko, Ebook) {
	var ebookMappers = {};

	ebookMappers.mapEbooks = function(allBookData) {
		return new Promise(function(resolve,reject) {
			var mappedBooks = allBookData.map(function(bookData) {
				return new Ebook(bookData);
			});
			resolve(mappedBooks);
		});	
	};

	return ebookMappers;
});