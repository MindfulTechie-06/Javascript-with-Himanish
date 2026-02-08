"use Strict";//treat all JS code as newer version and avoid using deprecated features

let stu_name = "Himanish"; // String data type
let age = 25;// Number data type
let isStudent = true; // Boolean data type

console.log("Name: " + stu_name);
console.log("Age: " + age);
console.log("Is Student: " + isStudent);
 /* Types of datatypes in JavaScript:       
 1. Number
 2.BigInt
    3.String
    4.Boolean
    5.Null => Standalone Value that represents the intentional absence of any object value. It is often used to indicate that a variable has no value or to reset a variable to an empty state.
    6.Undefined => A variable that has been declared but has not been assigned a value is of type undefined. It indicates that the variable exists but does not have a value yet.
    7.Symbol => A unique and immutable primitive value that can be used as a key for object properties. Symbols are often used to create private properties or to avoid name collisions in objects.

    */

    console.log("Type of name: " + typeof stu_name);
    console.log("Type of age: " + typeof age);
    console.log("Type of isStudent: " + typeof isStudent);
    console.log("Type of null: " + typeof null); // This will return "object" due to a historical bug in JavaScript, but it is actually a primitive value.
    console.log("Type of undefined: " + typeof undefined);
    console.log("Type of Symbol: " + typeof Symbol("id"));