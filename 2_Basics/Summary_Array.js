// Array Methods Summary with Examples

let numbers = [1, 2, 3, 4, 5];

console.log("Original Array:", numbers);

// push() – add element to end
numbers.push(6);
console.log("push:", numbers);

// pop() – remove last element
numbers.pop();
console.log("pop:", numbers);

// unshift() – add element to beginning
numbers.unshift(0);
console.log("unshift:", numbers);

// shift() – remove first element
numbers.shift();
console.log("shift:", numbers);

// includes() – check if element exists
console.log("includes 3:", numbers.includes(3));

// indexOf() – find index
console.log("indexOf 4:", numbers.indexOf(4));

// map() – create new array by transforming values
let doubled = numbers.map(n => n * 2);
console.log("map (double):", doubled);

// filter() – filter values based on condition
let evenNumbers = numbers.filter(n => n % 2 === 0);
console.log("filter (even numbers):", evenNumbers);

// reduce() – reduce array to single value
let sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log("reduce (sum):", sum);

// find() – find first matching element
let firstEven = numbers.find(n => n % 2 === 0);
console.log("find (first even):", firstEven);

// some() – check if any element matches condition
console.log("some > 4:", numbers.some(n => n > 4));

// every() – check if all elements match condition
console.log("every > 0:", numbers.every(n => n > 0));

// slice() – extract part of array
let sliced = numbers.slice(1, 4);
console.log("slice:", sliced);

// splice() – remove/replace elements
numbers.splice(2, 1);
console.log("splice (remove index 2):", numbers);

// concat() – merge arrays
let moreNumbers = [7, 8];
let combined = numbers.concat(moreNumbers);
console.log("concat:", combined);

// join() – convert array to string
console.log("join:", numbers.join("-"));

// reverse() – reverse array
console.log("reverse:", [...numbers].reverse());

// sort() – sort elements
let unsorted = [5, 2, 8, 1];
unsorted.sort((a, b) => a - b);
console.log("sort:", unsorted);