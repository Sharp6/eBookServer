require.config({
	shim : {
		"hotkeys" : { "deps" : ['jquery']},
		"bootstrap" : { "deps" :['jquery'] },
		"typeahead" : { "deps" : ['bootstrap']},
		"binding-typeahead" : { "deps": ['bootstrap']}
	},
	paths: {
		jquery: '/javascript/libraries/jquery/dist/jquery.min',
		knockout: '/javascript/libraries/knockout/dist/knockout',
		bootstrap: '/javascript/libraries/bootstrap/dist/js/bootstrap.min',
		typeahead: '/javascript/libraries/bootstrap3-typeahead/bootstrap3-typeahead.min',
		'binding-typeahead': '/javascript/libraries/binding-typeahead',
		hotkeys: '/javascript/libraries/jQuery.Hotkeys/jquery.hotkeys'
	}
});

require(["knockout", "bootstrap", "viewmodels/ebook.vm.client"], function(ko, bootstrap, EbookVM) {
	var ebookVM = new EbookVM();
	ebookVM.init();
	ko.applyBindings(ebookVM);
});