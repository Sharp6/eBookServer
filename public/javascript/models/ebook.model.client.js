define(['knockout'], function(ko) {
	var ebookModel = function(bookData) {
		var self = this;
		
		self.id = ko.observable(bookData._id);
		self.title = ko.observable(bookData.title);
		self.url = ko.observable(bookData.url);
		self.bookTags = ko.observableArray([]);

		for(var i=0; i < bookData.tags.length; i++) {
			this.bookTags.push(bookData.tags[i]);
		}

		/*
		self.addTag = function() {
			self.bookTags.push(new Tag({}));
		};

		self.removeTag = function(tag) {
			self.bookTags.remove(tag);
		};
		*/
	};

	return ebookModel;
});