define(['knockout'], function(ko) {

	ko.bindingHandlers.typeahead = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var $element = $(element);
			var source = ko.utils.unwrapObservable(valueAccessor());

			var options = {
				source: source,
				items: 4
			};

			// This requires the autocomplete for bootstrap3: https://github.com/bassjobsen/Bootstrap-3-Typeahead
			$element.attr('autocomplete', 'off')
				.typeahead(options);
		}
	}

});