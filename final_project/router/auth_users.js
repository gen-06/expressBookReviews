const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let sameusername = users.filter((user) => {
    return user.username == username
});
if(sameusername.length > 0) {
    return true;
} else {
    return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validuser = users.filter((user) => {
    return (user.username === username && user.password === password)
});
if (validuser.length > 0) {
    return true;
} else {
    return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
   const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/review/:isbn", (req, res) => {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username; // Assuming username is stored in the session

    if (!username) {
      return res.status(401).json({ message: "Unauthorized" }); // Handle unauthorized access
    }

    const book = books[isbn];

    if (book) {
      book.reviews[username] = review; // Add or modify review based on username
      res.json({ message: "Review added/modified successfully" });
    } else {
      res.status(404).json({ message: "Book not found" }); // Handle book not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding/modifying review" }); // Handle unexpected errors
  }
});


regd_users.delete("/review/:isbn", (req, res) => {
    try {
      const isbn = req.params.isbn;
      const username = req.session.authorization.username; // Retrieve username from session
  
      if (!username) {
        return res.status(401).json({ message: "Unauthorized" }); // Handle unauthorized access
      }
  
      const book = books[isbn];
  
      if (book) {
        if (book.reviews[username]) { // Check if a review exists for the user
          delete book.reviews[username]; // Delete the user's review
          res.json({ message: "Review deleted successfully" });
        } else {
          res.status(404).json({ message: "Review not found" }); // Handle review not found
        }
      } else {
        res.status(404).json({ message: "Book not found" }); // Handle book not found
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting review" }); // Handle unexpected errors
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
