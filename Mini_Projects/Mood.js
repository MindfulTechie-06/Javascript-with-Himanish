const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const quotes = {
    happy: [
        "Keep smiling, the world reflects your energy.",
        "Happiness is a direction, not a place.",
        "Your positivity is your power."
    ],
    sad: [
        "Tough times never last, tough people do.",
        "Every storm runs out of rain.",
        "This phase is temporary. Stay strong."
    ],
    stressed: [
        "Breathe. You are capable of handling this.",
        "Focus on progress, not perfection.",
        "Small steps still move you forward."
    ],
    motivated: [
        "Success starts with self-discipline.",
        "Consistency beats talent.",
        "Dream big. Work bigger."
    ]
};

rl.question("Enter your mood (happy, sad, stressed, motivated): ", function(mood) {

    mood = mood.toLowerCase();

    if (!quotes[mood]) {
        console.log("Mood not recognized. Try again.");
    } else {
        const randomIndex = Math.floor(Math.random() * quotes[mood].length);
        console.log("\nYour Quote:");
        console.log(quotes[mood][randomIndex]);
    }

    rl.close();
});