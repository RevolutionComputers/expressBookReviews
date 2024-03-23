const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

const findBookByISBN = (isbn) => {
    for (const key in books) {
        if (books.hasOwnProperty(key)) {
            if (books[key].isbn === isbn) {
                return books[key]; // Found the book, return it
            }
        }
    }
    return null; // Book not found
};

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Body Empty"});
    }
    if(authenticatedUser(username,password))
    {
    let accessToken = jwt.sign({
        username: username
      }, 'access', { expiresIn: 3600 });

      req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
}
else
{
    return res.status(200).send("Not a valid user");
}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
const accessToken = req.session.authorization && req.session.authorization.accessToken;
const isbn = req.params.isbn;
if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
}

let decoded;
try {
    decoded = jwt.verify(accessToken, 'access');
} catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
}

const username = decoded.username;
const review = req.body.review;

if (review !== "" && isbn !== "") {
    const bookToUpdate = findBookByISBN(isbn);
    if (bookToUpdate) {
        if (!Array.isArray(bookToUpdate.reviews)) {
            bookToUpdate.reviews = [];
        }
        bookToUpdate.reviews.push({ username, review });
        return res.status(200).json({ message: 'Review added successfully', book: bookToUpdate });
    } else {
        return res.status(404).json({ message: "Book with ISBN " + isbn + " not found" });
    }
} else {
    return res.status(400).json({ message: 'Missing ISBN or Review' });
}
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const accessToken = req.session.authorization && req.session.authorization.accessToken;
    const isbn = req.params.isbn;
    if (!accessToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    let decoded;
    try {
        decoded = jwt.verify(accessToken, 'access');
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    
    const username = decoded.username;
    bookToUpdate = findBookByISBN(isbn);
    const desiredReview = bookToUpdate.reviews.find(review => review.username === username);
    if (desiredReview)
    {
        const usernameToDelete = username;
        bookToUpdate.reviews = bookToUpdate.reviews.filter(review => review.username !== usernameToDelete);
        return res.status(200).json({ message: 'Review deleted successfully', book: bookToUpdate });
    }
    else
    {
        return res.status(401).json({ message: 'No reviews to delete under username '+ username });
    }

});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
