// we will be studying some maths methods in this file

// Math is a built-in object in JavaScript that provides properties and methods for mathematical constants and functions. It is not a function object, so it cannot be instantiated.

console.log(Math);
let value = Math.PI;
console.log(value.toPrecision(3)); // Output: 3.141592653589793


console.log(Math.abs(-5)); // Output: 5
console.log(Math.ceil(4.2)); // Output: 5
console.log(Math.floor(4.7)); // Output: 4
console.log(Math.round(4.5)); // Output: 5


console.log(Math.max(1, 5, 3)); // Output: 5
console.log(Math.min(1, 5, 3)); // Output: 1

console.log(Math.random()); // Output: A random number between 0 (inclusive) and 1 (exclusive)
console.log(Math.random()* 10); // Output: A random number between 0 (inclusive) and 10 (exclusive)

const min=10;
const max=20;

const randomNum=Math.random()*(max-min)+min;
console.log(Math.floor(randomNum)); // Output: A random number between 10 (inclusive) and 20 (exclusive)