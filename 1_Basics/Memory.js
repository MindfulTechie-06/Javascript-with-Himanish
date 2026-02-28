// There are two types of memory in JavaScript: Stack and Heap.
// Stack memory is used for storing primitive data types and function calls. It is a last-in-first-out (LIFO) data structure, meaning that the last item added to the stack is the first one to be removed. When a function is called, a new stack frame is created for that function, and when the function returns, the stack frame is removed.

// Heap memory is used for storing objects and arrays. It is a more complex data structure that allows for dynamic memory allocation. When an object or array is created, it is stored in the heap, and a reference to that memory location is stored in the stack.

// When a variable is assigned a primitive value, it is stored in the stack. When a variable is assigned an object or array, a reference to that object or array is stored in the stack, and the actual object or array is stored in the heap. This means that when you assign an object or array to another variable, you are copying the reference, not the actual object or array. Therefore, changes made to one variable will affect the other variable since they both reference the same object or array in the heap.

// Example of stack memory:
let name ="Himanish";
let new_name = name;   
    // new_name is a copy of name, both are stored in stack memory
    new_name ="Roop";
    console.log(name); // Himanish
    console.log(new_name); // Roop

// Example of heap memory:
let person = { name: "Himanish", age: 25 };
let new_person = person;

    // new_person is a reference to the same object in heap memory
    new_person.age = 30;
    console.log(person.age); // 30
    console.log(new_person.age); // 30
    