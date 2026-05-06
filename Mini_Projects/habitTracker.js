import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const FILE = "habits.json";

// ================= LOAD & SAVE =================

function loadHabits() {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE));
}

function saveHabits(habits) {
    fs.writeFileSync(FILE, JSON.stringify(habits, null, 2));
}

let habits = loadHabits();

// ================= DAILY RESET =================

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

// ================= SORT =================

function sortHabitsByPriority() {
    const order = {
        high: 1,
        medium: 2,
        low: 3
    };

    habits.sort((a, b) => {
        return order[a.priority] - order[b.priority];
    });
}

// ================= MENU =================

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
    console.log("9. Export Report");
    console.log("10. Exit");

    rl.question("Choose option: ", handleMenu);
}

// ================= HANDLE MENU =================

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
            deleteHabit();
            break;

        case "5":
            editHabit();
            break;

        case "6":
            viewStats();
            break;

        case "7":
            searchHabit();
            break;

        case "8":
            filterHabits();
            break;

        case "9":
            exportReport();
            break;

        case "10":
            console.log("Exiting...");
            rl.close();
            break;

        default:
            console.log("Invalid option");
            showMenu();
    }
}

// ================= ADD HABIT =================

function addHabit() {

    rl.question("Enter habit name: ", (habit) => {

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

            console.log("✅ Habit Added");

            showMenu();
        });
    });
}

// ================= VIEW HABITS =================

function viewHabits() {

    sortHabitsByPriority();

    console.log("\n===== YOUR HABITS =====");

    if (habits.length === 0) {
        console.log("No habits found");
    }
    else {

        habits.forEach((habit, index) => {

            console.log(
                `${index + 1}. ${habit.name} (${habit.priority}) [${habit.done ? "✔" : "❌"}] | Streak: ${habit.streak}`
            );
        });
    }

    showMenu();
}

// ================= MARK DONE =================

function markDone() {

    rl.question("Enter habit number: ", (num) => {

        let index = num - 1;

        if (habits[index]) {

            let today = new Date().toDateString();

            if (habits[index].lastCompleted === today) {

                console.log("⚠ Already completed today");

            } else {

                let yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (
                    habits[index].lastCompleted ===
                    yesterday.toDateString()
                ) {

                    habits[index].streak += 1;

                } else {

                    habits[index].streak = 1;
                }

                habits[index].done = true;
                habits[index].lastCompleted = today;

                saveHabits(habits);

                console.log(`🔥 Streak: ${habits[index].streak}`);
            }

        } else {

            console.log("Invalid habit number");
        }

        showMenu();
    });
}

// ================= DELETE =================

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

// ================= EDIT =================

function editHabit() {

    rl.question("Enter habit number to edit: ", (num) => {

        let index = num - 1;

        if (habits[index]) {

            rl.question("Enter new habit name: ", (newName) => {

                rl.question(
                    "Enter new priority (high/medium/low): ",
                    (newPriority) => {

                        habits[index].name = newName;
                        habits[index].priority =
                            newPriority.toLowerCase();

                        saveHabits(habits);

                        console.log("✏ Habit Updated");

                        showMenu();
                    }
                );
            });

        } else {

            console.log("Invalid number");

            showMenu();
        }
    });
}

// ================= STATS =================

function viewStats() {

    let total = habits.length;

    let completed =
        habits.filter(habit => habit.done).length;

    let completionRate =
        total === 0
            ? 0
            : ((completed / total) * 100).toFixed(2);

    let highestStreak =
        habits.length > 0
            ? Math.max(...habits.map(h => h.streak))
            : 0;

    console.log("\n===== STATISTICS =====");

    console.log("Total Habits:", total);
    console.log("Completed Today:", completed);
    console.log("Completion Rate:", completionRate + "%");
    console.log("Highest Streak:", highestStreak);

    showMenu();
}

// ================= SEARCH =================

function searchHabit() {

    rl.question("Enter keyword: ", (keyword) => {

        let results = habits.filter(habit =>
            habit.name
                .toLowerCase()
                .includes(keyword.toLowerCase())
        );

        console.log("\n===== SEARCH RESULTS =====");

        if (results.length === 0) {

            console.log("No matching habits found");

        } else {

            results.forEach(habit => {

                console.log(
                    `${habit.name} (${habit.priority})`
                );
            });
        }

        showMenu();
    });
}

// ================= FILTER =================

function filterHabits() {

    rl.question("Filter (done/pending): ", (type) => {

        let filtered = habits.filter(habit =>
            type === "done"
                ? habit.done
                : !habit.done
        );

        console.log("\n===== FILTERED HABITS =====");

        if (filtered.length === 0) {

            console.log("No habits found");

        } else {

            filtered.forEach(habit => {

                console.log(
                    `${habit.name} (${habit.priority})`
                );
            });
        }

        showMenu();
    });
}

// ================= EXPORT REPORT =================

function exportReport() {

    let total = habits.length;

    let completed =
        habits.filter(h => h.done).length;

    let completionRate =
        total === 0
            ? 0
            : ((completed / total) * 100).toFixed(2);

    let highestStreak =
        habits.length > 0
            ? Math.max(...habits.map(h => h.streak))
            : 0;

    let report = `
===== HABIT TRACKER REPORT =====

Date: ${new Date().toDateString()}

Total Habits: ${total}
Completed Today: ${completed}
Completion Rate: ${completionRate}%
Highest Streak: ${highestStreak}

Habit Details:
${habits.map(h =>
`- ${h.name} (${h.priority})
  Status: ${h.done ? "Done" : "Pending"}
  Streak: ${h.streak}
`).join("\n")}
`;

    fs.writeFileSync("report.txt", report);

    console.log("📄 Report exported successfully");

    showMenu();
}

// ================= START APP =================

resetDailyStatus();
showMenu();