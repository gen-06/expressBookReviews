const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try {
    // Pretend it’s an async operation
    const getBooks = () => Promise.resolve(books);
    const result = await getBooks();
    res.send(JSON.stringify(result, null, 4));
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books", error: err });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  try {
    const getBookByISBN = () => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found");
        }
      });
    };

    const book = await getBookByISBN();
    res.send(book);
  } catch (err) {
    res.status(404).json({ message: err });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();

  try {
    const getBooksByAuthor = () => {
      return new Promise((resolve, reject) => {
        let matchingBooks = [];
        for (let key in books) {
          if (books[key].author.toLowerCase() === author) {
            matchingBooks.push(books[key]);
          }
        }
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found for this author");
        }
      });
    };

    const result = await getBooksByAuthor();
    res.send(result);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();

  try {
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        let matchingBooks = [];
        for (let key in books) {
          if (books[key].title.toLowerCase() === title) {
            matchingBooks.push(books[key]);
          }
        }
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found with this title");
        }
      });
    };

    const result = await getBooksByTitle();
    res.send(result);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  try {
    const getBookReviews = () => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn].reviews);
        } else {
          reject("Book not found");
        }
      });
    };

    const reviews = await getBookReviews();
    res.send(reviews);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

module.exports.general = public_users;
