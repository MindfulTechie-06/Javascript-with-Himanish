console.log("Some Comparison Operators in JavaScript");

//1.Equality
let x=10;
let y="10";
console.log(x==y); //true because it performs type coercion
console.log(x===y); //false because it checks for both value and type

//2.Inequality
console.log(x!=y); //false because it performs type coercion
console.log(x!==y); //true because it checks for both value and type

//3.Greater than
console.log(x>5); //true

//4.Less than
console.log(x<20); //true

//5.Greater than or equal to
console.log(x>=10); //true

//6.Less than or equal to
console.log(x<=10); //true

//console.log( null +2);
console.log(null>=21);


console.log(null<=21);//true because null is converted to 0 in numeric comparison
console.log(null>21);//false because null is converted to 0 in numeric comparison
console.log(null<21);//true because null is converted to 0 in numeric comparison

console.log(undefined>=0);
