// objects are collections of properties
// properties are key-value pairs   
// Simple Object Example

let student = {
    name: "Himanish",
    age: 20,
    marks: 85,

    displayInfo: function () {
        console.log("Student Name:", this.name);
        console.log("Age:", this.age);
        console.log("Marks:", this.marks);
    }
};

// Access properties
console.log("Name:", student.name);
console.log("Age:", student.age);

// Call object method
student.displayInfo();