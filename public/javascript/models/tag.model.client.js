define(['knockout'], function(ko) {
	var tagModel = function(tagData) {
		var self = this;
		
		//self.id = ko.observable(bookData._id);
		self.name = ko.observable(tagData.tagName);
	};

	return tagModel;
});