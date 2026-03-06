import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function validateEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(email)) {
        console.log("✅ Valid Email Address");
    } else {
        console.log("❌ Invalid Email Address");
    }
}

rl.question("Enter an email address: ", (email) => {

    validateEmail(email);

    rl.close();
});