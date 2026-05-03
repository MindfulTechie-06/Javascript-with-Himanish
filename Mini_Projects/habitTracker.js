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

// 🟢 DAILY RESET
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

// 🟢 SORT BY PRIORITY
function sortHabitsByPriority() {
    const order = { high: 1, medium: 2, low: 3 };
    habits.sort((a, b) => order[a.priority] - order[b.priority]);
}

// 🟢 MENU
function showMenu() {
    console.log("\n===== HABIT TRACKER =====");
    console.log("1. Add Habit");
    console.log("2. View Habits");
    console.log("3. Mark Habit as Done");
    console.log("4. Delete Habit");
    console.log("5. Edit Habit");
    console.log("6. View Stats");
    console.log("7. Exit");

    rl.question("Choose option: ", handleMenu);
}

// 🟢 HANDLE MENU
function handleMenu(choice) {
    switch (choice) {
        case "1": addHabit(); break;
        case "2": viewHabits(); break;
        case "3": markDone(); break;
        case "4": deleteHabit(); break;
        case "5": editHabit(); break;
        case "6": viewStats(); break;
        case "7": rl.close(); break;
        default:
            console.log("Invalid choice");
            showMenu();
    }
}

// 🟢 ADD HABIT
function addHabit() {
    rl.question("Enter habit: ", (habit) => {
        rl.question("Enter priority (high/medium/low): ", (priority) => {

            habits.push({
                name: habit,
                priority: priority.toLowerCase(),
                done: false,
                streak: 0,
                lastCompleted: null,
                lastUpdated: new Date().toDateString()
            });

            saveHabits(habits);
            console.log("✅ Habit added");
            showMenu();
        });
    });
}

// 🟢 VIEW HABITS
function viewHabits() {
    sortHabitsByPriority();

    console.log("\nYour Habits:");

    if (habits.length === 0) {
        console.log("No habits found");
    } else {
        habits.forEach((h, i) => {
            console.log(
                `${i + 1}. ${h.name} (${h.priority}) [${h.done ? "✔" : "❌"}] | Streak: ${h.streak}`
            );
        });
    }

    showMenu();
}

// 🟢 MARK DONE
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

// 🟢 DELETE
function deleteHabit() {
    rl.question("Enter habit number to delete: ", (num) => {
        let index = num - 1;

        if (habits[index]) {
            console.log(`🗑 Deleted: ${habits[index].name}`);
            habits.splice(index, 1);
            saveHabits(habits);
        } else {
            console.log("Invalid number");
        }

        showMenu();
    });
}

// 🟢 EDIT
function editHabit() {
    rl.question("Enter habit number to edit: ", (num) => {
        let index = num - 1;

        if (habits[index]) {
            rl.question("Enter new name: ", (newName) => {
                rl.question("Enter new priority (high/medium/low): ", (newPriority) => {

                    habits[index].name = newName;
                    habits[index].priority = newPriority.toLowerCase();

                    saveHabits(habits);
                    console.log("✏ Habit updated");

                    showMenu();
                });
            });
        } else {
            console.log("Invalid number");
            showMenu();
        }
    });
}

// 🟢 STATS DASHBOARD
function viewStats() {
    let total = habits.length;
    let completed = habits.filter(h => h.done).length;

    let completionRate = total === 0 ? 0 : ((completed / total) * 100).toFixed(2);

    let highestStreak = 0;
    habits.forEach(h => {
        if (h.streak > highestStreak) highestStreak = h.streak;
    });

    console.log("\n===== STATISTICS =====");
    console.log("Total Habits:", total);
    console.log("Completed Today:", completed);
    console.log("Completion Rate:", completionRate + "%");
    console.log("Highest Streak:", highestStreak);

    showMenu();
}

// START
resetDailyStatus();
showMenu();