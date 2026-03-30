import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const lower = "abcdefghijklmnopqrstuvwxyz";
const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

function generatePassword(length, useUpper, useNumbers, useSymbols) {
    let chars = lower;

    if (useUpper) chars += upper;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;

    let password = "";

    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    return password;
}

// User Input Flow
rl.question("Enter password length: ", (length) => {
    rl.question("Include uppercase? (yes/no): ", (u) => {
        rl.question("Include numbers? (yes/no): ", (n) => {
            rl.question("Include symbols? (yes/no): ", (s) => {

                const password = generatePassword(
                    parseInt(length),
                    u.toLowerCase() === "yes",
                    n.toLowerCase() === "yes",
                    s.toLowerCase() === "yes"
                );

                console.log("\n🔐 Generated Password:", password);
                rl.close();
            });
        });
    });
});