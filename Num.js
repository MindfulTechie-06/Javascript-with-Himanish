const score = 100;
console.log(score);
console.log(typeof score); // Output: number

const balance =new Number(1000); // this is stored in heap memory as it is an object, while score is stored in stack memory as it is a primitive value.
console.log(balance);
console.log(typeof balance); // Output: object

console.log(balance.toString()); // converts the number to a string
console.log(typeof balance.toString()); // Output: string

console.log(balance.toFixed(2)); // formats the number to 2 decimal places
console.log(typeof balance.toFixed(2)); // Output: string (toFixed returns a string)

let value =60855.478;
console.log(value.toPrecision(2)); // formats the number to 2 significant digits