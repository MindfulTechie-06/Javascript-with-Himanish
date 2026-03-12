import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function wordFrequency(sentence) {

    const words = sentence.toLowerCase().split(" ");
    const frequency = {};

    for (let word of words) {
        if (frequency[word]) {
            frequency[word]++;
        } else {
            frequency[word] = 1;
        }
    }

    console.log("\nWord Frequency:");
    for (let word in frequency) {
        console.log(word + " : " + frequency[word]);
    }
}

rl.question("Enter a sentence: ", (input) => {

    wordFrequency(input);

    rl.close();
});