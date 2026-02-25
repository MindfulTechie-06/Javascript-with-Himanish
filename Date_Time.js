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

// Timestamps
let mytimestamp = Date.now(); // returns the number of milliseconds since January 1, 1970
console.log(mytimestamp);
console.log(mydate.getTime());// This will return the timestamp for the date represented by mydate, which is December 25, 2023.
console.log(mytimestamp-mydate.getTime());// This will give the difference in milliseconds between the current time and December 25, 2023.

let d1=new Date();
console.log(d1);
console.log(d1.getFullYear());// This will return the current year (e.g., 2024).
console.log(d1.getMonth());// This will return the current month as a zero-indexed value (0 for January, 1 for February, etc.). For example, if it's January, it will return 0.
console.log(d1.getDate());// This will return the current day of the month (1-31). For example, if it's the 15th of the month, it will return 15.

newdate.toLocaleString('default',{weekday:'long'});// This will return the full name of the weekday for the date represented by newdate (January 1, 2024). For example, if January 1, 2024, falls on a Monday, it will return "Monday".