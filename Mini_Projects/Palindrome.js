import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function checkPalindrome(word) {

    const cleanedWord = word.toLowerCase();
    const reversedWord = cleanedWord.split("").reverse().join("");

    if (cleanedWord === reversedWord) {
        console.log("✅ It is a Palindrome!");
    } else {
        console.log("❌ Not a Palindrome.");
    }
}

rl.question("Enter a word: ", (input) => {

    checkPalindrome(input);

    rl.close();
});