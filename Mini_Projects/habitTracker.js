import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const FILE = "habits.json";

// Load habits
function loadHabits() {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE));
}

// Save habits
function saveHabits(habits) {
    fs.writeFileSync(FILE, JSON.stringify(habits, null, 2));
}

let habits = loadHabits();

// 🟢 DAILY RESET SYSTEM
function resetDailyStatus() {
    let today = new Date().toDateString();

    habits.forEach(habit => {
        if (habit.lastUpdated !== today) {
            habit.done = false;
            habit.lastUpdated = today;
        }
    });

    saveHabits(habits);
}

// 🟢 MENU
function showMenu() {
    console.log("\n===== HABIT TRACKER =====");
    console.log("1. Add Habit");
    console.log("2. View Habits");
    console.log("3. Mark Habit as Done");
    console.log("4. Exit");

    rl.question("Choose option: ", handleMenu);
}

// 🟢 HANDLE MENU
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

// 🟢 ADD HABIT
function addHabit() {
    rl.question("Enter habit: ", (habit) => {
        habits.push({
            name: habit,
            done: false,
            streak: 0,
            lastCompleted: null,
            lastUpdated: new Date().toDateString()
        });

        saveHabits(habits);
        console.log("✅ Habit added");
        showMenu();
    });
}

// 🟢 VIEW HABITS
function viewHabits() {
    console.log("\nYour Habits:");

    if (habits.length === 0) {
        console.log("No habits found");
    } else {
        habits.forEach((h, i) => {
            console.log(
                `${i + 1}. ${h.name} [${h.done ? "✔" : "❌"}] | Streak: ${h.streak}`
            );
        });
    }

    showMenu();
}

// 🟢 MARK DONE + STREAK LOGIC
function markDone() {
    rl.question("Enter habit number: ", (num) => {
        let index = num - 1;

        if (habits[index]) {
            let today = new Date().toDateString();

            if (habits[index].lastCompleted === today) {
                console.log("⚠ Already marked today");
            } else {
                let yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (habits[index].lastCompleted === yesterday.toDateString()) {
                    habits[index].streak += 1;
                } else {
                    habits[index].streak = 1;
                }

                habits[index].lastCompleted = today;
                habits[index].done = true;

                saveHabits(habits);

                console.log(`🔥 Streak: ${habits[index].streak}`);
            }
        } else {
            console.log("Invalid number");
        }

        showMenu();
    });
}

// 🟢 START APP
resetDailyStatus();
showMenu();