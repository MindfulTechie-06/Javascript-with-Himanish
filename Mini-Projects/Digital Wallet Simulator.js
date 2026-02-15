// Initial wallet balance
let balance = 1000;

// Ask user for action
let action = prompt(
    "Choose an action:\n1. Check Balance\n2. Add Money\n3. Spend Money"
);

// Check balance
if (action === "1") {
    alert(`Your current balance is ₹${balance}`);
}

// Add money
else if (action === "2") {
    let addAmount = Number(prompt("Enter amount to add:"));

    if (isNaN(addAmount) || addAmount <= 0) {
        alert("Invalid amount entered.");
    } else {
        balance += addAmount;
        alert(`₹${addAmount} added successfully.\nNew Balance: ₹${balance}`);
    }
}

// Spend money
else if (action === "3") {
    let spendAmount = Number(prompt("Enter amount to spend:"));

    if (isNaN(spendAmount) || spendAmount <= 0) {
        alert("Invalid amount entered.");
    } 
    else if (spendAmount > balance) {
        alert("Insufficient balance!");
    } 
    else {
        balance -= spendAmount;
        alert(`₹${spendAmount} spent successfully.\nRemaining Balance: ₹${balance}`);
    }
}

// Invalid choice
else {
    alert("Invalid option selected.");
}
