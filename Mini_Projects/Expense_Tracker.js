import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const FILE = "expenses.json";

// ================= LOAD DATA =================

function loadData() {
  if (!fs.existsSync(FILE)) {
    return { budget: 0, expenses: [] };
  }

  const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));

  if (Array.isArray(data)) {
    return { budget: 0, expenses: data };
  }

  return {
    budget: data.budget || 0,
    expenses: data.expenses || []
  };
}

// ================= SAVE DATA =================

function saveData() {
  fs.writeFileSync(FILE, JSON.stringify(appData, null, 2));
}

let appData = loadData();

// ================= MENU =================

function showMenu() {
  console.log("\n===== SMART EXPENSE TRACKER =====");
  console.log("1. Add Expense");
  console.log("2. View Expenses");
  console.log("3. Show Total Spent");
  console.log("4. Show Category Summary");
  console.log("5. Set Monthly Budget");
  console.log("6. Show Budget Status");
  console.log("7. Edit Expense");
  console.log("8. Delete Expense");
  console.log("9. Search Expense");
  console.log("10. Filter Expenses");
  console.log("11. View Financial Summary");
  console.log("12. Export Report");
  console.log("13. Exit");

  rl.question("Choose an option: ", handleMenu);
}

// ================= HANDLE MENU =================

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
      editExpense();
      break;
    case "8":
      deleteExpense();
      break;
    case "9":
      searchExpense();
      break;
    case "10":
      filterExpenses();
      break;
    case "11":
      viewFinancialSummary();
      break;
    case "12":
      exportReport();
      break;
    case "13":
      console.log("Exiting...");
      rl.close();
      break;
    default:
      console.log("Invalid option");
      showMenu();
  }
}

// ================= ADD EXPENSE =================

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
          id: Date.now(),
          title: title.trim(),
          amount: parsedAmount,
          category: category.trim().toLowerCase(),
          date: new Date().toLocaleString()
        });

        saveData();
        console.log("✅ Expense added");
        checkBudgetAlert();
        showMenu();
      });
    });
  });
}

// ================= VIEW EXPENSES =================

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

// ================= TOTAL SPENT =================

function showTotalSpent() {
  const total = appData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  console.log(`\n💰 Total Spent: ₹${total.toFixed(2)}`);
  showMenu();
}

// ================= CATEGORY SUMMARY =================

function showCategorySummary() {
  if (appData.expenses.length === 0) {
    console.log("\nNo expenses available.");
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

// ================= SET BUDGET =================

function setBudget() {
  rl.question("Enter monthly budget: ", (budget) => {
    const parsedBudget = parseFloat(budget);

    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      console.log("Please enter a valid budget.");
      showMenu();
      return;
    }

    appData.budget = parsedBudget;
    saveData();

    console.log(`✅ Budget set to ₹${parsedBudget.toFixed(2)}`);
    showMenu();
  });
}

// ================= BUDGET STATUS =================

function showBudgetStatus() {
  const totalSpent = appData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = appData.budget - totalSpent;

  console.log("\n===== BUDGET STATUS =====");
  console.log(`Budget: ₹${appData.budget.toFixed(2)}`);
  console.log(`Spent: ₹${totalSpent.toFixed(2)}`);
  console.log(`Remaining: ₹${remaining.toFixed(2)}`);

  if (remaining < 0) {
    console.log("⚠ Budget exceeded!");
  } else if (appData.budget === 0) {
    console.log("No budget set yet.");
  } else {
    console.log("✅ You are within budget.");
  }

  showMenu();
}

// ================= EDIT EXPENSE =================

function editExpense() {
  viewExpensesOnly();

  rl.question("Enter expense number to edit: ", (num) => {
    let index = num - 1;

    if (!appData.expenses[index]) {
      console.log("Invalid expense number");
      showMenu();
      return;
    }

    rl.question("Enter new title: ", (newTitle) => {
      rl.question("Enter new amount: ", (newAmount) => {
        rl.question("Enter new category: ", (newCategory) => {
          const parsedAmount = parseFloat(newAmount);

          if (isNaN(parsedAmount) || parsedAmount <= 0) {
            console.log("Invalid amount");
            showMenu();
            return;
          }

          appData.expenses[index].title = newTitle.trim();
          appData.expenses[index].amount = parsedAmount;
          appData.expenses[index].category = newCategory.trim().toLowerCase();

          saveData();
          console.log("✏ Expense updated");
          showMenu();
        });
      });
    });
  });
}

// ================= DELETE EXPENSE =================

function deleteExpense() {
  viewExpensesOnly();

  rl.question("Enter expense number to delete: ", (num) => {
    let index = num - 1;

    if (!appData.expenses[index]) {
      console.log("Invalid expense number");
      showMenu();
      return;
    }

    console.log(`🗑 Deleted: ${appData.expenses[index].title}`);
    appData.expenses.splice(index, 1);

    saveData();
    showMenu();
  });
}

// ================= SEARCH EXPENSE =================

function searchExpense() {
  rl.question("Enter keyword to search: ", (keyword) => {
    const results = appData.expenses.filter((expense) =>
      expense.title.toLowerCase().includes(keyword.toLowerCase()) ||
      expense.category.toLowerCase().includes(keyword.toLowerCase())
    );

    console.log("\n===== SEARCH RESULTS =====");

    if (results.length === 0) {
      console.log("No matching expenses found.");
    } else {
      results.forEach((expense, index) => {
        console.log(
          `${index + 1}. ${expense.title} - ₹${expense.amount} | ${expense.category} | ${expense.date}`
        );
      });
    }

    showMenu();
  });
}

// ================= FILTER EXPENSES =================

function filterExpenses() {
  rl.question("Filter by category: ", (category) => {
    const filtered = appData.expenses.filter(
      (expense) => expense.category.toLowerCase() === category.trim().toLowerCase()
    );

    console.log("\n===== FILTERED EXPENSES =====");

    if (filtered.length === 0) {
      console.log("No expenses found for this category.");
    } else {
      filtered.forEach((expense, index) => {
        console.log(
          `${index + 1}. ${expense.title} - ₹${expense.amount} | ${expense.category} | ${expense.date}`
        );
      });
    }

    showMenu();
  });
}

// ================= FINANCIAL SUMMARY =================

function viewFinancialSummary() {
  const totalSpent = appData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = appData.budget - totalSpent;
  const highestExpense = appData.expenses.length
    ? Math.max(...appData.expenses.map(expense => expense.amount))
    : 0;

  const categoryTotals = {};

  appData.expenses.forEach((expense) => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });

  let topCategory = "N/A";
  let topCategoryAmount = 0;

  for (const category in categoryTotals) {
    if (categoryTotals[category] > topCategoryAmount) {
      topCategory = category;
      topCategoryAmount = categoryTotals[category];
    }
  }

  console.log("\n===== FINANCIAL SUMMARY =====");
  console.log(`Budget: ₹${appData.budget.toFixed(2)}`);
  console.log(`Total Spent: ₹${totalSpent.toFixed(2)}`);
  console.log(`Remaining: ₹${remaining.toFixed(2)}`);
  console.log(`Highest Expense: ₹${highestExpense.toFixed(2)}`);
  console.log(`Top Spending Category: ${topCategory} (₹${topCategoryAmount.toFixed(2)})`);

  showMenu();
}

// ================= EXPORT REPORT =================

function exportReport() {
  const totalSpent = appData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = appData.budget - totalSpent;
  const highestExpense = appData.expenses.length
    ? Math.max(...appData.expenses.map(expense => expense.amount))
    : 0;

  const categoryTotals = {};

  appData.expenses.forEach((expense) => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });

  let topCategory = "N/A";
  let topCategoryAmount = 0;

  for (const category in categoryTotals) {
    if (categoryTotals[category] > topCategoryAmount) {
      topCategory = category;
      topCategoryAmount = categoryTotals[category];
    }
  }

  const report = `
===== SMART EXPENSE TRACKER REPORT =====

Date: ${new Date().toDateString()}

Budget: ₹${appData.budget.toFixed(2)}
Total Spent: ₹${totalSpent.toFixed(2)}
Remaining: ₹${remaining.toFixed(2)}
Highest Expense: ₹${highestExpense.toFixed(2)}
Top Spending Category: ${topCategory} (₹${topCategoryAmount.toFixed(2)})

Expenses:
${appData.expenses.map(expense =>
`- ${expense.title} | ₹${expense.amount.toFixed(2)} | ${expense.category} | ${expense.date}`
).join("\n")}
`;

  fs.writeFileSync("expense-report.txt", report.trim());
  console.log("📄 Report exported as expense-report.txt");
  showMenu();
}

// ================= VIEW ONLY =================

function viewExpensesOnly() {
  console.log("\n===== EXPENSE LIST =====");

  if (appData.expenses.length === 0) {
    console.log("No expenses added yet.");
    return;
  }

  appData.expenses.forEach((expense, index) => {
    console.log(
      `${index + 1}. ${expense.title} - ₹${expense.amount} | ${expense.category}`
    );
  });
}

// ================= BUDGET ALERT =================

function checkBudgetAlert() {
  const totalSpent = appData.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (appData.budget > 0 && totalSpent > appData.budget) {
    console.log(`⚠ Budget exceeded by ₹${(totalSpent - appData.budget).toFixed(2)}`);
  }
}

// ================= START =================

showMenu();