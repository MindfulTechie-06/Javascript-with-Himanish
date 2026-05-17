import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const FILE = "expenses.json";

// Load data
function loadData() {
  if (!fs.existsSync(FILE)) {
    return { budget: 0, expenses: [] };
  }

  const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));

  // Backward compatibility if file still contains only an expense array
  if (Array.isArray(data)) {
    return { budget: 0, expenses: data };
  }

  return {
    budget: data.budget || 0,
    expenses: data.expenses || []
  };
}

// Save data
function saveData() {
  fs.writeFileSync(FILE, JSON.stringify(appData, null, 2));
}

let appData = loadData();

function showMenu() {
  console.log("\n===== SMART EXPENSE TRACKER =====");
  console.log("1. Add Expense");
  console.log("2. View Expenses");
  console.log("3. Show Total Spent");
  console.log("4. Show Category Summary");
  console.log("5. Set Monthly Budget");
  console.log("6. Show Budget Status");
  console.log("7. Exit");

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
      setBudget();
      break;
    case "6":
      showBudgetStatus();
      break;
    case "7":
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

        appData.expenses.push({
          title: title.trim(),
          amount: parsedAmount,
          category: category.trim().toLowerCase(),
          date: new Date().toLocaleString()
        });

        saveData();
        console.log("✅ Expense added and saved");

        checkBudgetAlert();
        showMenu();
      });
    });
  });
}

function viewExpenses() {
  console.log("\n===== EXPENSE LIST =====");

  if (appData.expenses.length === 0) {
    console.log("No expenses added yet.");
  } else {
    appData.expenses.forEach((expense, index) => {
      console.log(
        `${index + 1}. ${expense.title} - ₹${expense.amount} | ${expense.category} | ${expense.date}`
      );
    });
  }

  showMenu();
}

function showTotalSpent() {
  const total = appData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  console.log(`\n💰 Total Spent: ₹${total.toFixed(2)}`);
  showMenu();
}

function showCategorySummary() {
  if (appData.expenses.length === 0) {
    console.log("\nNo expenses to summarize.");
    showMenu();
    return;
  }

  const summary = {};

  appData.expenses.forEach((expense) => {
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

function setBudget() {
  rl.question("Enter monthly budget: ", (budget) => {
    const parsedBudget = parseFloat(budget);

    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      console.log("Please enter a valid budget amount.");
      showMenu();
      return;
    }

    appData.budget = parsedBudget;
    saveData();

    console.log(`✅ Monthly budget set to ₹${appData.budget.toFixed(2)}`);
    checkBudgetAlert();
    showMenu();
  });
}

function showBudgetStatus() {
  const totalSpent = appData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = appData.budget - totalSpent;

  console.log("\n===== BUDGET STATUS =====");
  console.log(`Budget: ₹${appData.budget.toFixed(2)}`);
  console.log(`Spent: ₹${totalSpent.toFixed(2)}`);
  console.log(`Remaining: ₹${remaining.toFixed(2)}`);

  if (appData.budget === 0) {
    console.log("No budget set yet.");
  } else if (remaining < 0) {
    console.log("⚠ Budget exceeded!");
  } else if (remaining === 0) {
    console.log("✅ Budget fully used.");
  } else {
    console.log("✅ You are within budget.");
  }

  showMenu();
}

function checkBudgetAlert() {
  const totalSpent = appData.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (appData.budget > 0 && totalSpent > appData.budget) {
    console.log(`\n⚠ Warning: Budget exceeded by ₹${(totalSpent - appData.budget).toFixed(2)}`);
  }
}

showMenu();