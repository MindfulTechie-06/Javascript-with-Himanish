const acc_Id = 123456789 // const let you declare a variable that cannot be reassigned. It must be initialized at the time of declaration and cannot be redeclared within the same scope.
let acc_Name = "Himanish"  // let allows you to declare a variable that can be reassigned. It can be initialized at the time of declaration or later, and it cannot be redeclared within the same scope.
 var acc_Password = "Himanish@123" // var is function-scoped and can be redeclared and updated. It is hoisted to the top of its scope, which means it can be used before it is declared, but it will be undefined until the declaration is reached. It is generally recommended to use let and const instead of var for better readability and maintainability of code.
let acc_state;
/* Prefer not to use var as it can lead to unexpected behavior due to its function-scoped nature and hoisting. Instead, use let for variables that need to be reassigned and const for variables that should not be reassigned. This helps improve code readability and maintainability. */
console.log("Account Id: " + acc_Id);
console.log("Account Name: " + acc_Name);
console.log("Account Password: " + acc_Password);

console.table({acc_Id, acc_Name, acc_Password, acc_state})// to print in a tabular format