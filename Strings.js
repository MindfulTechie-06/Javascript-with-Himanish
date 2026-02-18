// Strings declaration
let str1 = "Hello";
let str2 = 'World';
console.log(str1+str2);

// Another way to declare a string is using template literals, which are enclosed in backticks (`) and can contain placeholders for variables or expressions, denoted by ${}.
let name = "Himanish";
let greeting = `Hello, ${name}!`;
console.log(greeting);

// Another way
let str3 = new String("Hello World");// this is stored in heap memory as it is an object, while str1 and str2 are stored in stack memory as they are primitive values.
console.log(str3);
console.log(str3[0]); // here we can access the characters of the string using index, just like an array.  here the letters are stored in key value pairs