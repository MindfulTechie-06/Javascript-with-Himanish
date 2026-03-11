const marverl_heroes = ["Thor", "Iron Man", "Captain America", "Hulk"];
const dc_heroes = ["Superman", "Batman", ];


// Push() - is used to add one or more elements to the end of an array and returns the new length of the array.
marverl_heroes.push(dc_heroes);
console.log(marverl_heroes); // Output

// Concat() - is used to merge two or more arrays. This method does not change the existing arrays, but instead returns a new array.
const all_heroes = marverl_heroes.concat(dc_heroes);
console.log(all_heroes); 

const another_array=[1,2,3[4,5,6],7,8,9,[98,99,100]];
const flat_array = another_array.flat();
console.log(flat_array); // Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 98, 99, 100]

// converting a string to array 
console.log(Array.from("Hello World")); // Output: ['H', 'e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd']

// converting an array to string
const arr = [1, 2, 3, 4, 5];
const str = arr.toString();
console.log(str); // Output: "1,2,3,4,5"

console.log(Array.isArray(marverl_heroes)); // Output: true
let score = 100;
console.log(Array.isArray(score)); // Output: false

let s1=10;
let s2=20;
let s3=30;
let s4=40;
let s5=50;

console.log(Array.of(s1,s2,s3,s4,s5)); // Output: [10, 20, 30, 40, 50]