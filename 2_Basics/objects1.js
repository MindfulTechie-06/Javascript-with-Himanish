// objects are collections of properties
// properties are key-value pairs   
// Simple Object Example

// declaring a symbol
const mysym=Symbol("key 1");


const student = {
    name: "Himanish",
    age: 20,
    [mysym]:"This is a symbol",
    marks: 85,
    isPassed: true,
    lastlogindays: ["Monday", "Wednesday", "Friday"],
    
};

// Access properties
console.log("Name:", student.name);
console.log("Age:", student.age);
console.log(typeof(student.isPassed));
// Accessing symbol property
console.log("Symbol Property:", student[mysym]);

// changing the value of a property
student.marks = 90;
Object.freeze(student); // This will prevent any changes to the student object
student.marks = 95; // This will not change the marks property
console.log(student);

