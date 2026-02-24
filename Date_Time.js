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