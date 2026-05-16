import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const FILE = "expenses.json";

function loadExpenses() {
  if (!fs.existsSync(FILE)) return [];
  const data = fs.readFileSync(FILE, "utf-8");
  return JSON.parse(data);
}

function saveExpenses(expenses) {
  fs.writeFileSync(FILE, JSON.stringify(expenses, null, 2));
}

let expenses = loadExpenses();

function showMenu() {
  console.log("\n===== SMART EXPENSE TRACKER =====");
  console.log("1. Add Expense");
  console.log("2. View Expenses");
  console.log("3. Show Total Spent");
  console.log("4. Show Category Summary");
  console.log("5. Exit");

  rl.question("Choose an option: ", handleMenu);
}

function handleMenu(choice) {
  switch (choice) {
    case "1":
      addExpense();
      break;
    case "2":
      viewExpenses();
      break;
    case "3":
      showTotalSpent();
      break;
    case "4":
      showCategorySummary();
      break;
    case "5":
      console.log("Exiting...");
      rl.close();
      break;
    default:
      console.log("Invalid option");
      showMenu();
  }
}

function addExpense() {
  rl.question("Enter expense title: ", (title) => {
    rl.question("Enter amount: ", (amount) => {
      rl.question("Enter category (food/travel/study/shopping/other): ", (category) => {
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          console.log("Please enter a valid amount.");
          showMenu();
          return;
        }

        expenses.push({
          title: title.trim(),
          amount: parsedAmount,
          category: category.trim().toLowerCase(),
          date: new Date().toLocaleString()
        });

        saveExpenses(expenses);
        console.log("✅ Expense added and saved");
        showMenu();
      });
    });
  });
}

function viewExpenses() {
  console.log("\n===== EXPENSE LIST =====");

  if (expenses.length === 0) {
    console.log("No expenses added yet.");
  } else {
    expenses.forEach((expense, index) => {
      console.log(
        `${index + 1}. ${expense.title} - ₹${expense.amount} | ${expense.category} | ${expense.date}`
      );
    });
  }

  showMenu();
}

function showTotalSpent() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  console.log(`\n💰 Total Spent: ₹${total.toFixed(2)}`);
  showMenu();
}

function showCategorySummary() {
  if (expenses.length === 0) {
    console.log("\nNo expenses to summarize.");
    showMenu();
    return;
  }

  const summary = {};

  expenses.forEach((expense) => {
    if (!summary[expense.category]) {
      summary[expense.category] = 0;
    }
    summary[expense.category] += expense.amount;
  });

  console.log("\n===== CATEGORY SUMMARY =====");
  for (const category in summary) {
    console.log(`${category}: ₹${summary[category].toFixed(2)}`);
  }

  showMenu();
}

showMenu();