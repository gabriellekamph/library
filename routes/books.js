const { log } = require('debug');
var express = require('express');
var router = express.Router();

const fs = require("fs");

// GET Router to show list with all books from books.json

router.get('/', function(req, res, next) {

  fs.readFile("books.json", function(err, data) {
    if (err) {
      console.log(err);
    }

    const books = JSON.parse(data)

    let printBooks = `<div><h2>Complete Book List</h2>`

    for (book in books) {
      if (books[book].rented == true) {
        status = "<font color='red'>On loan</font>";
          
        } else {
          status = "<font color='green'>Available</font>"
        };

      printBooks += `<div><ul><p id="${books[book].id}"><a href="books/bookInfo/:${books[book].id}"><li>${books[book].title}</a><br /> ${status}</li></p></ul></div>`
    }

    printBooks += `<br><div><a href="/books/add"><button id="addBtn">Add new book</button></a></div></div>`

    res.send(printBooks);
    return;
  });

});

// GET Router with form to add new book 

router.get('/add', function(req, res, next) {

let addForm = `<div><h2>Add a new book</h2>
                <form action="/books/add" method="post">
                  <div><input type="text" name="title"> Book title</div>
                  <div><input type="text" name="author"> Author</div>
                  <div><input type="text" name="pages"> Pages</div>
                  <br />
                  <div><button type="submit">Add</button></div>
                </form>
              </div>` 

res.send(addForm);
});

// POST Router to update books.json with new book and then redirect to complete list

router.post("/add", function(req, res) {

    fs.readFile("books.json", function(err, data) {
      if (err) {
        console.log(err);
      }  

    const books = JSON.parse(data);    

    let newId = books.length + 1;

    let newBook = {
      "title": req.body.title,
      "author": req.body.author,
      "pages": req.body.pages,
      "id": newId,
    }      

    books.push(newBook);

      fs.writeFile("books.json", JSON.stringify(books, null, 2), function(err) {
        if (err) {
          console.log(err);
        }
      })

    res.redirect("/books");
    return;

  });
});

// GET Router with info page about selected book

router.get("/bookInfo/:bookId", function(req, res) {

  fs.readFile("books.json", function(err, data) {
    if (err) {
      console.log(err);
    }

    const books = JSON.parse(data);

    let bookInfo;

    let status;
    let button;
    let deleteBook = "Delete book from library";

    for (book in books) {
      if (req.params.bookId == ":" + books[book].id) {
        if (books[book].rented == true) {
          status = "<font color='red'>On loan</font>";
          button = "Return book";
        
          } else {
            status = "<font color='green'>Available</font>";
            button = "Borrow this book";
          };


        bookInfo = `<div><h2>${books[book].title} (${books[book].author})</h2>
                    <b>Title: </b>${books[book].title} <br/>
                    <b>Author: </b>${books[book].author} <br />
                    <b>Pages: </b>${books[book].pages} <br />
                    <b>Status: </b>${status} <br /><br />
                    
                    <a href='/books/borrow/:${books[book].id}'><button>${button}</button></a>
                    <a href='/books/deleteBook/:${books[book].id}'><button>${deleteBook}</button></a><br />
                    </div>`
    
      }
     }

    res.send(bookInfo);

  });
});

// GET Router to borrow or return book

router.get("/borrow/:bookId", function(req, res) {

  fs.readFile("books.json", function(err, data) {
    if (err) {
      console.log(err);
    }

    const books = JSON.parse(data);

    for (book in books) {
      if (req.params.bookId == ":" + books[book].id) {
    
        if (books[book].rented == true) {
          books[book].rented = false
        } else {
          books[book].rented = true;
        }
      }
    }
    
    fs.writeFile("books.json", JSON.stringify(books, null, 2), function(err) {
      if (err) {
        console.log(err);
      }
    });

    res.redirect("/books");  

  });
});





// GET Router to delete book from library

router.get("/deleteBook/:bookId", function(req, res) {

  fs.readFile("books.json", function(err, data) {
    if (err) {
      console.log(err);
    }

    const books = JSON.parse(data);

    for (book in books) {

      if (req.params.bookId == ":" + books[book].id) {
        let id = books[book].id;
    
        for (let i = 0; i < books.length; i++) {
          if (books[i].id == id) {
            books.splice(i, 1);
            break;
          }
        }
      }
    }

    fs.writeFile("books.json", JSON.stringify(books, null, 2), function(err) {
      if (err) {
        console.log(err);
      }
    });

    res.redirect("/books");  

  });
});

module.exports = router;
