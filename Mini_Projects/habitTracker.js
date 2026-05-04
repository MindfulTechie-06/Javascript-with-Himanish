import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const FILE = "habits.json";

// Load
function loadHabits() {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE));
}

// Save
function saveHabits(habits) {
    fs.writeFileSync(FILE, JSON.stringify(habits, null, 2));
}

let habits = loadHabits();

// 🟢 RESET
function resetDailyStatus() {
    let today = new Date().toDateString();
    habits.forEach(h => {
        if (h.lastUpdated !== today) {
            h.done = false;
            h.lastUpdated = today;
        }
    });
    saveHabits(habits);
}

// 🟢 PRIORITY SORT
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
    console.log("7. Search Habit");
    console.log("8. Filter Habits");
    console.log("9. Exit");

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
        case "7": searchHabit(); break;
        case "8": filterHabits(); break;
        case "9": rl.close(); break;
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
                id: Date.now(),
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

// 🟢 VIEW
function viewHabits() {
    sortHabitsByPriority();

    console.log("\nYour Habits:");

    habits.forEach((h, i) => {
        console.log(
            `${i + 1}. ${h.name} (${h.priority}) [${h.done ? "✔" : "❌"}] | Streak: ${h.streak}`
        );
    });

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
        }

        showMenu();
    });
}

// 🟢 DELETE
function deleteHabit() {
    rl.question("Enter habit number: ", (num) => {
        let index = num - 1;

        if (habits[index]) {
            habits.splice(index, 1);
            saveHabits(habits);
            console.log("🗑 Deleted");
        }

        showMenu();
    });
}

// 🟢 EDIT
function editHabit() {
    rl.question("Enter habit number: ", (num) => {
        let index = num - 1;

        if (habits[index]) {
            rl.question("New name: ", (name) => {
                rl.question("New priority: ", (priority) => {

                    habits[index].name = name;
                    habits[index].priority = priority.toLowerCase();

                    saveHabits(habits);
                    console.log("✏ Updated");

                    showMenu();
                });
            });
        } else {
            showMenu();
        }
    });
}

// 🟢 STATS
function viewStats() {
    let total = habits.length;
    let done = habits.filter(h => h.done).length;

    let rate = total === 0 ? 0 : ((done / total) * 100).toFixed(2);

    let maxStreak = Math.max(...habits.map(h => h.streak), 0);

    console.log("\n===== STATS =====");
    console.log("Total:", total);
    console.log("Completed:", done);
    console.log("Completion Rate:", rate + "%");
    console.log("Highest Streak:", maxStreak);

    showMenu();
}

// 🟢 SEARCH
function searchHabit() {
    rl.question("Search keyword: ", (keyword) => {
        let results = habits.filter(h =>
            h.name.toLowerCase().includes(keyword.toLowerCase())
        );

        console.log("\nSearch Results:");
        results.forEach(h => {
            console.log(`${h.name} (${h.priority})`);
        });

        showMenu();
    });
}

// 🟢 FILTER
function filterHabits() {
    rl.question("Filter (done/pending): ", (type) => {

        let filtered = habits.filter(h =>
            type === "done" ? h.done : !h.done
        );

        console.log("\nFiltered:");
        filtered.forEach(h => {
            console.log(`${h.name} (${h.priority})`);
        });

        showMenu();
    });
}

// START
resetDailyStatus();
showMenu();