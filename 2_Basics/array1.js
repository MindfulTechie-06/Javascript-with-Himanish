// array is a data structure that can hold more than one value at a time. It is a collection of items stored at contiguous memory locations. The idea is to store multiple items of the same type together. This makes it easier to calculate the position of each element by simply adding an offset to a base value, i.e., the memory location of the first element of the array (generally denoted by the name of the array).

// In JavaScript, arrays are dynamic and can hold elements of any type. They are created using square brackets [] and can be accessed using their index, which starts from 0.
let fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

// Accessing elements of the array
console.log(fruits[0]); // Output: Apple
console.log(fruits[1]); // Output: Banana
console.log(fruits[2]); // Output: Cherry

// Array Methods

let arr=[1,2,3,4,5]
// push() - adds an element to the end of the array
arr.push(6);
console.log(arr); // Output: [1, 2, 3, 4, 5, 6]
arr.pop(); // removes the last element of the array
console.log(arr);
// unshift() - adds an element to the beginning of the array
arr.unshift(9);
console.log(arr);
// shift() - removes the first element of the array
arr.shift();
console.log(arr);

// length - returns the number of elements in the array
console.log(arr.length); // Output: 5