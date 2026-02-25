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

// Strings are immutable in JavaScript, which means that once a string is created, it cannot be changed. However, you can create a new string by concatenating or manipulating existing strings.
// Some String methods:
let str4 = "Hello World";
console.log(str4.length);
console.log(str4.toUpperCase());
console.log(str4.charAt(3));
console.log(str4.indexOf("o"));


let var_name= "Himanish";

console.log(var_name.substring(0,5));
console.log(var_name.slice(-5,5));

let str5 = "   JavaScript   ";
console.log(str5.trim()); // removes whitespace from both ends of the string

const url = "https://www.example.com";
const domain = url.replace("https://www.", "");
console.log(domain); // Output: example.com

console.log(url.includes("example"));

let new_str = "A quick brown fox jumps over the lazy dog";
console.log(new_str.split(" ")); // splits the string into an array of words
console.log(typeof new_str.split(" ")); // Output: object (because it returns an array  which is an object in JavaScript)