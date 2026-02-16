// Primitive data types in JavaScript include:

// They Are all Call By Value meaning when they are called in a function, a copy of the value is passed to the function, and any changes made to the parameter inside the function do not affect the original variable outside the function.

// 7 primitive data types in JavaScript are:
// String, Number, BigInt, Boolean, Undefined, Null, Symbol, BigInt
// some  examples

const name = "John"; // String
const age = 30;
const isStudent = true; // Boolean
const temperature = undefined; // Undefined
const address = null; // Null
const id = Symbol("id"); // Symbol
const newid = Symbol("id"); // Symbol

console.log(id===newid); // false because Symbol is unique and cannot be equal to another Symbol even if they have the same description

const bigIntNumber = 1234567890123456789012345678901234567890n; // BigInt
console.log(typeof bigIntNumber); // bigint
//  Reference data types in JavaScript include:// They Are all Call By Reference meaning when they are called in a function, a reference to the original variable is passed to the function, and any changes made to the parameter inside the function will affect the original variable outside the function. // 3 reference data types in JavaScript are: // Object, Array, Function


// some non primitive data types in JavaScript are:
const person = { name: "John", age: 30 }; // Object
const numbers = [1, 2, 3, 4, 5]; // Array
const word=function greet() { // Function
    console.log("Hello!");}

    console.log(typeof person); // object
    console.log(typeof numbers); // object
    console.log(typeof word); // function
    word();// Hello!