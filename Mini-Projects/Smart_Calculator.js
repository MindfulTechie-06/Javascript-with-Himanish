// Taking input values (simulate user input as strings)
let input1 = "20";
let input2 = "5";

// Convert string inputs to numbers
let num1 = Number(input1);
let num2 = Number(input2);

// Check if conversion was successful
if (isNaN(num1) || isNaN(num2)) {
    console.log("Invalid input! Please enter valid numbers.");
} else {

    // Arithmetic operations
    let addition = num1 + num2;
    let subtraction = num1 - num2;
    let multiplication = num1 * num2;
    let division = num2 !== 0 ? num1 / num2 : "Cannot divide by zero";

    // Comparison operations
    let isGreater = num1 > num2;
    let isEqual = num1 === num2;

    // Display formatted result
    console.log(`First Number: ${num1}`);
    console.log(`Second Number: ${num2}`);
    console.log(`Addition: ${addition}`);
    console.log(`Subtraction: ${subtraction}`);
    console.log(`Multiplication: ${multiplication}`);
    console.log(`Division: ${division}`);
    console.log(`Is First Number Greater? ${isGreater}`);
    console.log(`Are Both Numbers Equal? ${isEqual}`);
}
