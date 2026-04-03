import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let habits = [];

// Menu
function showMenu() {
    console.log("\n===== HABIT TRACKER =====");
    console.log("1. Add Habit");
    console.log("2. View Habits");
    console.log("3. Mark Habit as Done");
    console.log("4. Exit");

    rl.question("Choose option: ", handleMenu);
}

function handleMenu(choice) {
    switch (choice) {
        case "1":
            addHabit();
            break;
        case "2":
            viewHabits();
            break;
        case "3":
            markDone();
            break;
        case "4":
            rl.close();
            break;
        default:
            console.log("Invalid choice");
            showMenu();
    }
}

// Add Habit
function addHabit() {
    rl.question("Enter habit: ", (habit) => {
        habits.push({ name: habit, done: false });
        console.log("✅ Habit added");
        showMenu();
    });
}

// View Habits
function viewHabits() {
    console.log("\nYour Habits:");
    habits.forEach((h, i) => {
        console.log(`${i + 1}. ${h.name} [${h.done ? "✔" : "❌"}]`);
    });
    showMenu();
}

// Mark Done
function markDone() {
    rl.question("Enter habit number: ", (num) => {
        let index = num - 1;
        if (habits[index]) {
            habits[index].done = true;
            console.log("✔ Marked as done");
        } else {
            console.log("Invalid number");
        }
        showMenu();
    });
}

// Start
showMenu();