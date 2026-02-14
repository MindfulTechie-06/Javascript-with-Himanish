// Student name (string input)
let studentName = "Rahul";

// Marks entered as strings (simulate user input)
let mark1 = "85";
let mark2 = "78";
let mark3 = "92";
let mark4 = "67";
let mark5 = "80";

// Convert marks from string to numbers
let m1 = Number(mark1);
let m2 = Number(mark2);
let m3 = Number(mark3);
let m4 = Number(mark4);
let m5 = Number(mark5);

// Check for invalid inputs
if (isNaN(m1) || isNaN(m2) || isNaN(m3) || isNaN(m4) || isNaN(m5)) {
    console.log("Invalid marks entered!");
} else {

    // Calculate total
    let total = m1 + m2 + m3 + m4 + m5;

    // Calculate average
    let average = total / 5;

    // Determine grade
    let grade;

    if (average >= 90) {
        grade = "A+";
    } else if (average >= 80) {
        grade = "A";
    } else if (average >= 70) {
        grade = "B";
    } else if (average >= 60) {
        grade = "C";
    } else if (average >= 50) {
        grade = "D";
    } else {
        grade = "F";
    }

    // Check pass/fail (must pass all subjects)
    let passedAll = (m1 >= 40 && m2 >= 40 && m3 >= 40 && m4 >= 40 && m5 >= 40);

    // Display result
    console.log(`Student Name: ${studentName}`);
    console.log(`Total Marks: ${total}`);
    console.log(`Average Marks: ${average}`);
    console.log(`Grade: ${grade}`);
    console.log(`Passed All Subjects: ${passedAll ? "Yes" : "No"}`);
}
