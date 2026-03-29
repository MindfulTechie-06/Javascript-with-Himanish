// Object and Array Manipulation

// Example of an object representing a student
const student = {
    name: "Himanish",
    age: 20,
    marks: 85,
    email: ""
};

// ------------------------------
// Accessing properties
// ------------------------------
console.log("Name:", student.name);
console.log("Age:", student["age"]);

// ------------------------------
// Modifying properties
// ------------------------------
student.marks = 90; // update marks
student.email = "himanish@gmail.com"; // add email

console.log("Updated Student:", student);

// ------------------------------
// Adding new property
// ------------------------------
student.isPassed = true;

console.log("After adding isPassed:", student);

// ------------------------------
// Deleting property
// ------------------------------
delete student.age;

console.log("After deleting age:", student);

// ------------------------------
// Array of objects
// ------------------------------
const students = [
    { name: "Himanish", marks: 90 },
    { name: "Rahul", marks: 75 },
    { name: "Amit", marks: 60 }
];

// ------------------------------
// Loop through array
// ------------------------------
students.forEach((stu) => {
    console.log(stu.name + " scored " + stu.marks);
});

// ------------------------------
// Function to add a student
// ------------------------------
function addStudent(arr, name, marks) {
    arr.push({ name, marks });
}

addStudent(students, "Priya", 88);

console.log("After adding new student:", students);

// ------------------------------
// Function to find topper
// ------------------------------
function getTopper(arr) {
    let topper = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i].marks > topper.marks) {
            topper = arr[i];
        }
    }

    return topper;
}

console.log("Topper:", getTopper(students));

// ------------------------------
// Filter students (marks > 70)
// ------------------------------
const goodStudents = students.filter(stu => stu.marks > 70);

console.log("Students with marks > 70:", goodStudents);

// ------------------------------
// Map (get only names)
// ------------------------------
const names = students.map(stu => stu.name);

console.log("Student Names:", names);