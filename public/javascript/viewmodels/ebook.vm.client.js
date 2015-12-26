define(['jquery', 'knockout', 'models/ebook.model.client', 'models/tag.model.client', 'services/ebook.service.client', 'services/ebook.mappers.client'], 
	function($,ko,Book,Tag,ebookService, ebookMappers) {

	function ebookViewModel() {
		var self = this;
		self.books = ko.observableArray([]);
		
		self.titles = ko.observableArray([]);
		ko.computed(function() {
			self.titles(ko.utils.arrayMap(self.books(), function(book) {
					return book.title();
				})
			);
		});

		self.tags = ko.observableArray([]);
		ko.computed(function() {
			var allTags = ko.utils.arrayMap(self.books(), function(book) { return book.bookTags(); });
			var mappedTags = [];
			allTags.forEach(function(tagCollection) {
				mappedTags = mappedTags.concat(tagCollection);
				
			});
			self.tags(ko.utils.arrayGetDistinctValues(mappedTags.sort()));
		});

		function mapTags(allTagData) {
			var mappedTags = $.map(allTagData, function(tagData) { 
				return new Tag({tagName: tagData._id}); 
			});
			self.availableTags(mappedTags);
			return;
		}

		function mapEbooks(allBookData) {
			var mappedBooks = $.map(allBookData, function(bookData) { 
				return new Book(bookData); 
			});
			self.books(mappedBooks);
			return allBookData;
		}

		function mapTitles(allBookData) {
			// I think titles should be a ko.computed
			var titles = $.map(allBookData, function(bookData) { 
				return bookData.title;
			});
			// Add titles for autocomplete searchfield
			return;
		}

		function loadTags() {
			ebookService.getTagsList()
				.then(mapTags)
				.catch(function(err) {
					console.log(err);
				});
		}

		function loadEbooks() {
			ebookService.getEbookList()
				.then(ebookMappers.mapEbooks)
				.then(self.books)
				.catch(function(err) {
					console.log(err);
				});
		}

		self.init = function() {
			loadEbooks();
			//loadTags();
		};

		self.findBooks = function() {
			// This should be a KO observable
			var key = $("input#searchField").val();
			$.getJSON('/api/ebooks/find/'+key, function(allBookData) {
      	var mappedBooks = $.map(allBookData, function(bookData) { return new Book(bookData) });
        self.books(mappedBooks);
			});
		};

		self.getTaggedBooks = function(tag) {
			$.getJSON('/api/ebooks?tag=' + tag, function(allBookData) {
      	var mappedBooks = $.map(allBookData, function(bookData) { return new Book(bookData) });
        self.books(mappedBooks);
			});
		};

		// Should not be in this VM, or should it? Is related to the ebooks list.
		self.removeBook = function(book) {
			self.books.destroy(book);
		};

		// Should not be in this VM, separated for each book.
		self.save = function() {
			var fileData = new FormData();
			jQuery.each($('input[type=file]'), function(i, file) {
				if(file.files[0]) {
				  fileData.append('file-'+file.id, file.files[0]);
				}
			});

			$.ajax({
				url: '/api/ebooks/files',
      	data: fileData,
      	cache: false,
      	contentType: false, 
      	processData: false,
      	type: "post", 
      	success: function(result) { 
      		for(var i=0; i < result.message.length; i++) {
      			ko.utils.arrayForEach(self.books(), function(aBook) {
      				if(aBook.id() === jQuery.parseJSON(result.message[i]).forBookId) {
      					aBook.url(jQuery.parseJSON(result.message[i]).newUrl);
      				}
      			});
      		}

					var bookData = ko.toJSON({ebooks:self.books});
					console.log(bookData);
					$.ajax({
						url: '/api/ebooks/fields',
						data: bookData,
						type: 'post', 
						success: function(result) { 
							//console.log(result);	
						}
					});
        }
			});
    };

  	self.addTag = function() {
  		self.availableTags.push(new Tag(''));
  	};

  	self.addBook = function() {
  		var createEmptyBookInDb = function() {
  			return $.ajax({
  				url: '/api/ebooks/emptyBook',
  				type: 'post'
  			}).promise();
  		}

  		createEmptyBookInDb().then(function(data){
  			console.log(data._id);
  			self.books.push(new Book({_id: data._id, title:'', url:'', tags: []}));	
  		})

  	};
	}
	
	return ebookViewModel;

});