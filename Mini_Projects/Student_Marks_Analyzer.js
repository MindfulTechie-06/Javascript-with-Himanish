// Student Marks Analyzer

let marks = [55, 72, 38, 90, 41, 66, 29];

console.log("Marks:", marks);

// Highest mark
let highest = Math.max(...marks);
console.log("Highest Mark:", highest);

// Lowest mark
let lowest = Math.min(...marks);
console.log("Lowest Mark:", lowest);

// Average marks
let sum = marks.reduce((total, mark) => total + mark, 0);
let average = sum / marks.length;
console.log("Average Marks:", average);

// Students who passed (>=40)
let passedStudents = marks.filter(mark => mark >= 40);
console.log("Number of Students Passed:", passedStudents.length);