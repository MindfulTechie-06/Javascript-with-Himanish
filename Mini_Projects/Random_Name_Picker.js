import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter names separated by commas: ", (input) => {

    const names = input.split(",").map(name => name.trim());

    if (names.length === 0) {
        console.log("No names entered.");
        rl.close();
        return;
    }

    const randomIndex = Math.floor(Math.random() * names.length);
    const winner = names[randomIndex];

    console.log("\n🎉 The selected name is:", winner);

    rl.close();
});