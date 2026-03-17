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
    email:"him@google.com",
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
student.email = "himanish@chat.com";
//Object.freeze(student); // This will prevent any changes to the student object

console.log(student);
// creating a function
student.greet = function() {
    console.log(`Hello User ` );
};
student.greettwo = function() {
    console.log(`Hello User ,${this.name}` );
};
// calling the function
console.log(student.greet());
console.log(student.greettwo());
