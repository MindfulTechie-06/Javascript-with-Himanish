console.log("String Operations in JavaScript");
console.log(1+ "2");
console.log("1"+ 2);
console.log("1"+2+2);//This is because of the left to right evaluation of the expression. When the first two operands are numbers, it performs addition. But when it encounters a string, it converts the number to a string and performs concatenation for the rest of the expression.
console.log(1+2+"2");
console.log(1+"2"+2);//This is because of the left to right evaluation of the expression. When the first two operands are numbers, it performs addition. But when it encounters a string, it converts the number to a string and performs concatenation for the rest of the expression.
console.log(typeof true);
console.log(true+1);

