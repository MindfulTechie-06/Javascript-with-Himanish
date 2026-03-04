import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const takenUsernames = [
    "admin",
    "himanish",
    "developer",
    "techguru",
    "javascript",
    "coder123"
];

rl.question("Enter your desired username: ", (username) => {

    username = username.toLowerCase();

    if (takenUsernames.includes(username)) {
        console.log("❌ Username already taken.");

        console.log("\nSuggested usernames:");
        console.log(username + Math.floor(Math.random() * 100));
        console.log(username + "_dev");
        console.log(username + "_official");
    } 
    else {
        console.log("✅ Username available!");
    }

    rl.close();
});