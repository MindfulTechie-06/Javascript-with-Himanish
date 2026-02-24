// Dates

const now = new Date();// created a instance of the Date object, which represents the current date and time
// console.log(now);

// console.log(now.toString());
// console.log(now.toDateString());
// console.log(now.toLocaleString());
// console.log(typeof now);// The typeof operator returns "object" for Date instances


let mydate =new Date("2023-12-25");// created a Date object representing December 25, 2023
console.log(mydate);// This will print the date in a standard format, including the time (which defaults to 00:00:00)
console.log(mydate.toDateString());


let newdate= new Date(2024, 0, 1,5,3);  // created a Date object representing January 1, 2024. Note that the month is zero-indexed (0 = January)>
console.log(newdate.toLocaleString());

let date1 = new Date(12-12-2025);
console.log(date1.toLocaleString());// This will not give the expected result because the expression 12-12-2025 is evaluated as a mathematical operation, resulting in -2025. When passed to the Date constructor, it creates a date based on the number of milliseconds since January 1, 1970, which is not the intended date.