$(document).ready(function() {

	function Tag(tagName) {
		this.tagName = ko.observable(tagName);
	};

	function Book(bookData) {
		var bookSelf = this;
		this.id = ko.observable(bookData._id);
		this.title = ko.observable(bookData.title);
		this.url = ko.observable(bookData.url);
		this.bookTags = ko.observableArray([]);
		for(var i=0; i < bookData.tags.length; i++) {
			this.bookTags.push(new Tag(bookData.tags[i]));
		}

		this.addTag = function() {
			this.bookTags.push(new Tag(''));
		};

		this.removeTag = function(tag) {
			bookSelf.bookTags.remove(tag);
		};
	};

	function ebookViewModel() {
		var self = this;
		self.books = ko.observableArray([]);
		self.availableTags = ko.observableArray([]);

		self.initData = function() {
			$.getJSON("/api/ebooks/tags", function(allTagData) {
				var mappedTags = $.map(allTagData, function(tagData) { return new Tag(tagData._id) });
        self.availableTags(mappedTags);
    	}); 

    	$.getJSON("/api/ebooks", function(allBookData) {
	  	  var mappedBooks = $.map(allBookData, function(bookData) { return new Book(bookData) });
	  	  self.books(mappedBooks);

	  	  var titles = $.map(allBookData, function(bookData) { return bookData.title});
	  	  $( "#searchField" ).autocomplete({
			    source: titles
		  	});

  		}); 
		};

		self.findBooks = function() {
			var key = $("input#searchField").val();
			$.getJSON('/api/ebooks/find/'+key, function(allBookData) {
      	var mappedBooks = $.map(allBookData, function(bookData) { return new Book(bookData) });
        self.books(mappedBooks);
			});
		};

		self.getTaggedBooks = function(tag) {
			$.getJSON('/api/ebooks/tags/'+tag.tagName(), function(allBookData) {
      	var mappedBooks = $.map(allBookData, function(bookData) { return new Book(bookData) });
        self.books(mappedBooks);
			});
		};

		/*
		self.saveNewBook = function() {
			$("#newBookForm").submit();
		};
		*/
		self.removeBook = function(book) {
			self.books.destroy(book);
		};

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

  	self.initData();
	}
	
	var myModel = new ebookViewModel();
	ko.applyBindings(myModel);

});

