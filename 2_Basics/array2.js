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