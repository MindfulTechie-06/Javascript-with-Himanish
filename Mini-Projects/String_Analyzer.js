// String Analyzer Tool

function analyzeString(text) {
    let characters = text.length;
    let words = text.trim().split(/\s+/).length;

    let vowels = 0;
    let consonants = 0;

    for (let char of text.toLowerCase()) {
        if ("aeiou".includes(char)) {
            vowels++;
        } else if (char >= 'a' && char <= 'z') {
            consonants++;
        }
    }

    let reversed = text.split("").reverse().join("");

    console.log("Original Text:", text);
    console.log("Characters:", characters);
    console.log("Words:", words);
    console.log("Vowels:", vowels);
    console.log("Consonants:", consonants);
    console.log("Reversed:", reversed);
}

// Test the function
analyzeString("JavaScript is powerful");