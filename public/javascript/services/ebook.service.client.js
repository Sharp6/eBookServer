define(['jquery'], function($){
	var ebookService = {};

	var getEbooksUrl = "/api/ebooks";
	var getTagsUrl = "/api/tags";
	var callRestService = function(url,type,data,successCallback,errorCallback) {
		$.ajax({
			type: type,
			cache: false,
			contentType: 'application/json',
			url: url, 
			data: JSON.stringify(data), 
			dataType: 'json', 
			success: function(result) {
				successCallback(result);
			}, 
			error: function() {
				errorCallback();
			}
		});
	};

	ebookService.getEbookList = function() {
		return new Promise(function(resolve,reject) {
			callRestService(getEbooksUrl,"GET", null, resolve, reject);
		});
	};

	ebookService.getTagsList = function() {
		return new Promise(function(resolve,reject) {
			callRestService(getTagsUrl, "GET", null, resolve, reject);
		});
	};

	return ebookService;
});