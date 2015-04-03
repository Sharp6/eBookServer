var express = require('express');
var router = express.Router();
var ebook = require('../models/ebook.js');

/* GET user pages. */
router.get('/', function(req, res) {
  res.render('ebooks', {title: '2Root Ebook Library'});
});

router.get('/admin', function(req, res) {
  res.render('ebooksAdmin', {title: '2Root Ebook Library'});
});


/* API routes */

/* API GET routes */
router.get('/api/ebooks', function(req, res) {
  ebook.find(function(err, books){
    if(err)
    	res.send(err);
    res.json(books);
  });	
});

router.get('/api/ebooks/find/:key', function(req, res) {
  ebook.find({ title : new RegExp('.*'+req.params.key+'.*', 'i') }, function(err, doc){
  	if(err)
  		res.send(err);
  	res.json(doc);
  });
});

router.get('/api/ebooks/tags', function(req, res){
  ebook.aggregate(
    { $unwind: '$tags' },
    { $project: 
      {
        'tag': { $toLower: '$tags' }
      }
    },
    { $group: 
      {
        '_id': '$tag',
        'sum': { $sum: 1 }
      }
    },
    { $sort:
      { 
        'sum': -1,
        '_id': 1
      }
    }, 
    function(err, result) {
      if(err)
        res.send(err);
      res.send(result);
    });

/*  ebook.distinct("tags", function(err, result){
  	if(err)
  	  res.send(err);
  	res.send(result);
  });
*/
});

router.get('/api/ebooks/tags/:tag', function(req,res) {
  ebook.find(
    {
      tags:
      { 
        $regex : new RegExp(req.params.tag, "i") 
      } 
    }, function(err,result) {
      if(err)
        res.send(err);
      res.send(result);
    });
  }
);

/* API POST */
/*
router.post('/api/ebook', function(req, res) {
 var book = new ebook();
 book.title = req.body.newTitle;
 book.url = req.files.upload.path.substring(6);

 book.save(function(err) {
  if(err)
   res.send(err);

  res.json({message:'eBook saved to database.'});
 });
});
*/

router.post('/api/ebooks/files', function(req, res) {
  var message = [];
  
  // Check if files are included
  if(Object.getOwnPropertyNames(req.files).length != 0) {
    // For every file
    for(var file in req.files) {
      var updatedFile = {
        newUrl: req.files[file].path.substring(6),
        forBookId: req.files[file].fieldname.substring(5)
      };
      var json = JSON.stringify(updatedFile);
      message.push(json);
    }
  }
  res.send({message: message});
});

router.post('/api/ebooks/emptyBook', function(req, res) {
  var book = new ebook();
  book.save(function(err, newBook) {
    if(err) {
      res.send(err);
    } 
    res.json(newBook);
  });
});

router.post('/api/ebooks/fields', function(req, res) {   
  var message = [];

  // Strange behaviour: added whole json string as key.
  for(var bookJson in req.body) {
    var updatedBooks = JSON.parse(bookJson).ebooks;
    updatedBooks.forEach(function(updatedBook){

      if(updatedBook.id) {
        ebook.findById(updatedBook.id, function(err, bookFromDb) {
          if(err) {
            message.push(err);
          } else {
            console.log(updatedBook);

            // got book to update          
            // update fields
            bookFromDb.title = updatedBook.title;
            bookFromDb.url = updatedBook.url;
            bookFromDb.tags = [];
            updatedBook.bookTags.forEach(function(tag){
              bookFromDb.tags.push(tag.tagName);
            });

            bookFromDb.save(function(err) {
              if(err) {
                message.push(err);
              } else {
                message.push({status: 'eBook updated in database.'});
              }
            });
          }
          // delete if necessary
            if(updatedBook._destroy === true) {
              ebook.remove({
                _id: updatedBook.id
              }, function(err,book) {
                if(err) {
                  message.push(err);
                } else {
                  message.push({status: 'eBook removed from library.'});
                }
              });
            }
          });

        } else {
          // make new book
          var book = new ebook();
          book.title = updatedBook.title;
          book.url = updatedBook.url;
          book.tags = [];
          updatedBook.bookTags.forEach(function(tag){
            book.tags.push(tag.tagName);
          });

          book.save(function(err) {
            if(err) {
              message.push(err);
            } else {
              message.push({status: 'new eBook saved to database.'});
            }
          });  
      }
    });
  }

  res.send(message);
});

module.exports = router;
