// Library Management System

let library = [
    { title: "JavaScript Basics", author: "John", available: true },
    { title: "Python Guide", author: "Alice", available: false },
    { title: "C Programming", author: "David", available: true }
];

// Display all books
console.log("All Books:");
library.forEach(book => {
    console.log(book.title + " by " + book.author);
});

// Find issued books
let issuedBooks = library.filter(book => book.available === false);

console.log("\nIssued Books:");
issuedBooks.forEach(book => {
    console.log(book.title);
});

// Count available books
let availableCount = library.filter(book => book.available === true).length;

console.log("\nAvailable Books Count:", availableCount);