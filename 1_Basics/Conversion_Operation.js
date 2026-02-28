let score ="33abc"

//console.log(typeof score);
let valueInNumber = Number(score);
console.log(typeof valueInNumber);
console.log(valueInNumber );

// "33" => 33
// "33abc" => NaN
// "abc33" => NaN
// "abc" => NaN
// "" => 0
// true => 1
// false => 0   

let isLoggedIn = 211;
let booleanIsLoggedIn = Boolean(isLoggedIn);
console.log(booleanIsLoggedIn);
console.log(typeof booleanIsLoggedIn);

// 0 => false
// 1 => true    
// "" => false
// " " => true
// "false" => true
// null => false
// undefined => false

// No to String Conversion
let score1 = 33;
let scoreInString = String(score1);
console.log(scoreInString);
console.log(typeof scoreInString);