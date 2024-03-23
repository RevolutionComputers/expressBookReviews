const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function usernameExists(username) {
    return users.map(user => user.username).includes(username);
  }

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username != "" && password != "")
  {
  if (usernameExists(username))
  {
    return res.status(300).json({message: "Username is already added"});
    }
    else
    {
    const user = {
    username: username,
    password: password
    };
    users.push(user);
    return res.status(300).json({message: "User "+ username + " has been added."});
}
  }
  else
  {
    return res.status(300).json({message: "Username or password can not be blank"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).json({Books: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const booksArray = Object.values(books);
    const filteredBooks = booksArray.filter(book => book.isbn === isbn);
    if (filteredBooks!= "")
    {
    return res.status(300).json({Books: filteredBooks});
    }
    else{
        res.status(300).json({Books: "No Matches for " + isbn + " found"});
    }
    });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
const author = req.params.author;
const booksArray = Object.values(books);
const filteredBooks = booksArray.filter(book => book.author === author);
if (filteredBooks!= "")
{
return res.status(300).json({Books: filteredBooks});
}
else{
    res.status(300).json({Books: "No Matches for " + author + " found"});
}
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksArray = Object.values(books);
    const filteredBooks = booksArray.filter(book => book.title === title);
    if (filteredBooks!= "")
    {
    return res.status(300).json({Books: filteredBooks});
    }
    else{
        res.status(300).json({Books: "No Matches for " + title + " found"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const booksArray = Object.values(books);
    const filteredBooks = booksArray.filter(book => book.isbn === isbn);
    if (filteredBooks!= "")
    {
    const reviews = filteredBooks.map(book => book.reviews);
    return res.status(300).json({Books: JSON.stringify(reviews)});
    }
    else{
        res.status(300).json({Books: "No Matches for " + isbn + " found"});
    }
});

module.exports.general = public_users;
