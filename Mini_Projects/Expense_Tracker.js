import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const FILE = "finances.json";

// ================= LOAD & SAVE =================

function loadData() {
  if (!fs.existsSync(FILE)) {
    return { budget: 0, transactions: [], recurring: [] };
  }

  const raw = JSON.parse(fs.readFileSync(FILE, "utf-8"));

  if (Array.isArray(raw)) {
    return {
      budget: 0,
      transactions: raw.map((item) => ({
        id: item.id || Date.now(),
        type: item.type || "expense",
        title: item.title || "Untitled",
        amount: Number(item.amount) || 0,
        category: item.category || "other",
        date: item.date || new Date().toLocaleString()
      })),
      recurring: []
    };
  }

  return {
    budget: raw.budget || 0,
    transactions: (raw.transactions || []).map((item) => ({
      id: item.id || Date.now(),
      type: item.type || "expense",
      title: item.title || "Untitled",
      amount: Number(item.amount) || 0,
      category: item.category || "other",
      date: item.date || new Date().toLocaleString(),
      recurringId: item.recurringId || null
    })),
    recurring: (raw.recurring || []).map((item) => ({
      id: item.id || Date.now(),
      type: item.type || "expense",
      title: item.title || "Untitled",
      amount: Number(item.amount) || 0,
      category: item.category || "other",
      frequency: item.frequency || "monthly",
      lastGenerated: item.lastGenerated || null,
      active: item.active !== false
    }))
  };
}

function saveData() {
  fs.writeFileSync(FILE, JSON.stringify(appData, null, 2));
}

let appData = loadData();

// ================= HELPERS =================

function getExpenseTotal() {
  return appData.transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

function getIncomeTotal() {
  return appData.transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

function getBalance() {
  return getIncomeTotal() - getExpenseTotal();
}

function checkBudgetAlert() {
  const expense = getExpenseTotal();

  if (appData.budget > 0 && expense > appData.budget) {
    console.log(`⚠ Budget exceeded by ₹${(expense - appData.budget).toFixed(2)}`);
  }
}

function viewTransactionsOnly() {
  console.log("\n===== TRANSACTION LIST =====");

  if (appData.transactions.length === 0) {
    console.log("No transactions added yet.");
    return;
  }

  appData.transactions.forEach((transaction, index) => {
    console.log(
      `${index + 1}. [${transaction.type.toUpperCase()}] ${transaction.title} - ₹${transaction.amount} | ${transaction.category} | ${transaction.date}`
    );
  });
}

function getCategorySummaryMap() {
  const summary = {};

  appData.transactions.forEach((transaction) => {
    const key = `${transaction.type}:${transaction.category}`;
    summary[key] = (summary[key] || 0) + transaction.amount;
  });

  return summary;
}

function getTopCategory() {
  const summary = getCategorySummaryMap();
  let topCategory = "N/A";
  let topCategoryAmount = 0;

  for (const key in summary) {
    if (summary[key] > topCategoryAmount) {
      topCategory = key;
      topCategoryAmount = summary[key];
    }
  }

  return { topCategory, topCategoryAmount };
}

function dayDiff(a, b) {
  const d1 = new Date(a);
  const d2 = new Date(b);

  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

function shouldGenerateRecurring(template) {
  if (!template.active) return false;
  if (!template.lastGenerated) return true;

  const diff = dayDiff(template.lastGenerated, new Date());

  if (template.frequency === "daily") return diff >= 1;
  if (template.frequency === "weekly") return diff >= 7;
  if (template.frequency === "monthly") return diff >= 30;

  return false;
}

function generateRecurringTransactions() {
  let changed = false;
  const todayISO = new Date().toISOString();

  appData.recurring.forEach((template) => {
    if (shouldGenerateRecurring(template)) {
      appData.transactions.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        type: template.type,
        title: template.title,
        amount: template.amount,
        category: template.category,
        date: new Date().toLocaleString(),
        recurringId: template.id
      });

      template.lastGenerated = todayISO;
      changed = true;
    }
  });

  if (changed) {
    saveData();
  }
}

// ================= MENU =================

function showMenu() {
  console.log("\n===== SMART FINANCE TRACKER =====");
  console.log("1. Add Expense");
  console.log("2. Add Income");
  console.log("3. View Transactions");
  console.log("4. Show Total Expense");
  console.log("5. Show Total Income");
  console.log("6. Show Balance");
  console.log("7. Show Category Summary");
  console.log("8. Set Monthly Budget");
  console.log("9. Show Budget Status");
  console.log("10. Edit Transaction");
  console.log("11. Delete Transaction");
  console.log("12. Search Transaction");
  console.log("13. Filter Transactions");
  console.log("14. View Financial Summary");
  console.log("15. View Monthly Dashboard");
  console.log("16. Export TXT Report");
  console.log("17. Export CSV Report");
  console.log("18. Backup Data");
  console.log("19. Add Recurring Transaction");
  console.log("20. View Recurring Rules");
  console.log("21. Toggle Recurring Rule");
  console.log("22. Reset All Data");
  console.log("23. Help");
  console.log("24. Exit");

  rl.question("Choose an option: ", handleMenu);
}

function handleMenu(choice) {
  switch (choice) {
    case "1":
      addTransaction("expense");
      break;
    case "2":
      addTransaction("income");
      break;
    case "3":
      viewTransactions();
      break;
    case "4":
      showTotalExpense();
      break;
    case "5":
      showTotalIncome();
      break;
    case "6":
      showBalance();
      break;
    case "7":
      showCategorySummary();
      break;
    case "8":
      setBudget();
      break;
    case "9":
      showBudgetStatus();
      break;
    case "10":
      editTransaction();
      break;
    case "11":
      deleteTransaction();
      break;
    case "12":
      searchTransaction();
      break;
    case "13":
      filterTransactions();
      break;
    case "14":
      viewFinancialSummary();
      break;
    case "15":
      viewMonthlyDashboard();
      break;
    case "16":
      exportTxtReport();
      break;
    case "17":
      exportCsvReport();
      break;
    case "18":
      backupData();
      break;
    case "19":
      addRecurringTransaction();
      break;
    case "20":
      viewRecurringRules();
      break;
    case "21":
      toggleRecurringRule();
      break;
    case "22":
      resetAllData();
      break;
    case "23":
      showHelp();
      break;
    case "24":
      console.log("Exiting...");
      rl.close();
      break;
    default:
      console.log("Invalid option");
      showMenu();
  }
}

// ================= ADD TRANSACTION =================

function addTransaction(type) {
  rl.question(`Enter ${type} title: `, (title) => {
    rl.question("Enter amount: ", (amount) => {
      rl.question(
        "Enter category (food/travel/study/shopping/other/salary/freelance): ",
        (category) => {
          const parsedAmount = parseFloat(amount);

          if (isNaN(parsedAmount) || parsedAmount <= 0) {
            console.log("Please enter a valid amount.");
            showMenu();
            return;
          }

          appData.transactions.push({
            id: Date.now(),
            type,
            title: title.trim(),
            amount: parsedAmount,
            category: category.trim().toLowerCase(),
            date: new Date().toLocaleString()
          });

          saveData();
          console.log(`✅ ${type === "income" ? "Income" : "Expense"} added`);
          checkBudgetAlert();
          showMenu();
        }
      );
    });
  });
}

// ================= VIEW TRANSACTIONS =================

function viewTransactions() {
  console.log("\n===== TRANSACTION LIST =====");

  if (appData.transactions.length === 0) {
    console.log("No transactions added yet.");
  } else {
    appData.transactions.forEach((transaction, index) => {
      console.log(
        `${index + 1}. [${transaction.type.toUpperCase()}] ${transaction.title} - ₹${transaction.amount} | ${transaction.category} | ${transaction.date}`
      );
    });
  }

  showMenu();
}

// ================= TOTALS =================

function showTotalExpense() {
  console.log(`\n💸 Total Expense: ₹${getExpenseTotal().toFixed(2)}`);
  showMenu();
}

function showTotalIncome() {
  console.log(`\n💰 Total Income: ₹${getIncomeTotal().toFixed(2)}`);
  showMenu();
}

function showBalance() {
  console.log(`\n📊 Net Balance: ₹${getBalance().toFixed(2)}`);
  showMenu();
}

// ================= CATEGORY SUMMARY =================

function showCategorySummary() {
  if (appData.transactions.length === 0) {
    console.log("\nNo transactions available.");
    showMenu();
    return;
  }

  const summary = getCategorySummaryMap();

  console.log("\n===== CATEGORY SUMMARY =====");
  Object.keys(summary).forEach((key) => {
    const [type, category] = key.split(":");
    console.log(`${type.toUpperCase()} | ${category}: ₹${summary[key].toFixed(2)}`);
  });

  showMenu();
}

// ================= BUDGET =================

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

function showBudgetStatus() {
  const spent = getExpenseTotal();
  const remaining = appData.budget - spent;

  console.log("\n===== BUDGET STATUS =====");
  console.log(`Budget: ₹${appData.budget.toFixed(2)}`);
  console.log(`Spent: ₹${spent.toFixed(2)}`);
  console.log(`Remaining: ₹${remaining.toFixed(2)}`);

  if (appData.budget === 0) {
    console.log("No budget set yet.");
  } else if (remaining < 0) {
    console.log("⚠ Budget exceeded!");
  } else {
    console.log("✅ You are within budget.");
  }

  showMenu();
}

// ================= EDIT =================

function editTransaction() {
  viewTransactionsOnly();

  rl.question("Enter transaction number to edit: ", (num) => {
    const index = parseInt(num) - 1;

    if (!appData.transactions[index]) {
      console.log("Invalid transaction number");
      showMenu();
      return;
    }

    rl.question("Enter new title: ", (newTitle) => {
      rl.question("Enter new amount: ", (newAmount) => {
        rl.question("Enter new category: ", (newCategory) => {
          rl.question("Enter new type (income/expense): ", (newType) => {
            const parsedAmount = parseFloat(newAmount);
            const type = newType.trim().toLowerCase();

            if (isNaN(parsedAmount) || parsedAmount <= 0) {
              console.log("Invalid amount");
              showMenu();
              return;
            }

            if (type !== "income" && type !== "expense") {
              console.log("Invalid type");
              showMenu();
              return;
            }

            appData.transactions[index].title = newTitle.trim();
            appData.transactions[index].amount = parsedAmount;
            appData.transactions[index].category = newCategory.trim().toLowerCase();
            appData.transactions[index].type = type;

            saveData();
            console.log("✏ Transaction updated");
            showMenu();
          });
        });
      });
    });
  });
}

// ================= DELETE =================

function deleteTransaction() {
  viewTransactionsOnly();

  rl.question("Enter transaction number to delete: ", (num) => {
    const index = parseInt(num) - 1;

    if (!appData.transactions[index]) {
      console.log("Invalid transaction number");
      showMenu();
      return;
    }

    console.log(`🗑 Deleted: ${appData.transactions[index].title}`);
    appData.transactions.splice(index, 1);
    saveData();
    showMenu();
  });
}

// ================= SEARCH =================

function searchTransaction() {
  rl.question("Enter keyword to search: ", (keyword) => {
    const results = appData.transactions.filter((transaction) =>
      transaction.title.toLowerCase().includes(keyword.toLowerCase()) ||
      transaction.category.toLowerCase().includes(keyword.toLowerCase()) ||
      transaction.type.toLowerCase().includes(keyword.toLowerCase())
    );

    console.log("\n===== SEARCH RESULTS =====");

    if (results.length === 0) {
      console.log("No matching transactions found.");
    } else {
      results.forEach((transaction, index) => {
        console.log(
          `${index + 1}. [${transaction.type.toUpperCase()}] ${transaction.title} - ₹${transaction.amount} | ${transaction.category} | ${transaction.date}`
        );
      });
    }

    showMenu();
  });
}

// ================= FILTER =================

function filterTransactions() {
  rl.question("Filter by type (income/expense/all): ", (type) => {
    const cleanType = type.trim().toLowerCase();

    const filtered =
      cleanType === "all"
        ? appData.transactions
        : appData.transactions.filter((transaction) => transaction.type === cleanType);

    console.log("\n===== FILTERED TRANSACTIONS =====");

    if (filtered.length === 0) {
      console.log("No transactions found.");
    } else {
      filtered.forEach((transaction, index) => {
        console.log(
          `${index + 1}. [${transaction.type.toUpperCase()}] ${transaction.title} - ₹${transaction.amount} | ${transaction.category} | ${transaction.date}`
        );
      });
    }

    showMenu();
  });
}

// ================= SUMMARY =================

function viewFinancialSummary() {
  const income = getIncomeTotal();
  const expense = getExpenseTotal();
  const balance = getBalance();
  const highestExpense = appData.transactions
    .filter((t) => t.type === "expense")
    .reduce((max, t) => Math.max(max, t.amount), 0);

  const { topCategory, topCategoryAmount } = getTopCategory();

  console.log("\n===== FINANCIAL SUMMARY =====");
  console.log(`Budget: ₹${appData.budget.toFixed(2)}`);
  console.log(`Total Income: ₹${income.toFixed(2)}`);
  console.log(`Total Expense: ₹${expense.toFixed(2)}`);
  console.log(`Net Balance: ₹${balance.toFixed(2)}`);
  console.log(`Highest Expense: ₹${highestExpense.toFixed(2)}`);
  console.log(`Top Category: ${topCategory} (₹${topCategoryAmount.toFixed(2)})`);

  showMenu();
}

// ================= MONTHLY DASHBOARD =================

function viewMonthlyDashboard() {
  if (appData.transactions.length === 0) {
    console.log("\nNo transactions available.");
    showMenu();
    return;
  }

  const monthMap = {};

  appData.transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getMonth() + 1}-${date.getFullYear()}`;

    if (!monthMap[monthKey]) {
      monthMap[monthKey] = {
        income: 0,
        expense: 0,
        count: 0
      };
    }

    if (transaction.type === "income") {
      monthMap[monthKey].income += transaction.amount;
    } else {
      monthMap[monthKey].expense += transaction.amount;
    }

    monthMap[monthKey].count += 1;
  });

  console.log("\n===== MONTHLY DASHBOARD =====");

  Object.keys(monthMap)
    .sort()
    .forEach((monthKey) => {
      const data = monthMap[monthKey];
      const net = data.income - data.expense;
      console.log(
        `${monthKey} | Income: ₹${data.income.toFixed(2)} | Expense: ₹${data.expense.toFixed(2)} | Net: ₹${net.toFixed(2)} | Transactions: ${data.count}`
      );
    });

  showMenu();
}

// ================= EXPORT =================

function exportTxtReport() {
  const income = getIncomeTotal();
  const expense = getExpenseTotal();
  const balance = getBalance();
  const remaining = appData.budget - expense;

  const report = `
===== SMART FINANCE TRACKER REPORT =====

Date: ${new Date().toDateString()}

Budget: ₹${appData.budget.toFixed(2)}
Total Income: ₹${income.toFixed(2)}
Total Expense: ₹${expense.toFixed(2)}
Net Balance: ₹${balance.toFixed(2)}
Remaining Budget: ₹${remaining.toFixed(2)}

Transactions:
${appData.transactions.map((transaction) =>
`- [${transaction.type.toUpperCase()}] ${transaction.title} | ₹${transaction.amount.toFixed(2)} | ${transaction.category} | ${transaction.date}`
).join("\n")}
`;

  fs.writeFileSync("finance-report.txt", report.trim());
  console.log("📄 Report exported as finance-report.txt");
  showMenu();
}

function exportCsvReport() {
  const header = "Type,Title,Amount,Category,Date\n";
  const rows = appData.transactions.map((transaction) => {
    const safeTitle = `"${String(transaction.title).replaceAll('"', '""')}"`;
    const safeCategory = `"${String(transaction.category).replaceAll('"', '""')}"`;
    const safeDate = `"${String(transaction.date).replaceAll('"', '""')}"`;
    return `${transaction.type},${safeTitle},${transaction.amount.toFixed(2)},${safeCategory},${safeDate}`;
  });

  const csv = header + rows.join("\n");
  fs.writeFileSync("finance-report.csv", csv);
  console.log("📄 Report exported as finance-report.csv");
  showMenu();
}

function backupData() {
  const backupName = `finances-backup-${new Date().toISOString().slice(0, 10)}.json`;
  fs.writeFileSync(backupName, JSON.stringify(appData, null, 2));
  console.log(`💾 Backup created: ${backupName}`);
  showMenu();
}

// ================= RECURRING TRANSACTIONS =================

function addRecurringTransaction() {
  rl.question("Enter type (income/expense): ", (type) => {
    const cleanType = type.trim().toLowerCase();

    if (cleanType !== "income" && cleanType !== "expense") {
      console.log("Invalid type");
      showMenu();
      return;
    }

    rl.question("Enter title: ", (title) => {
      rl.question("Enter amount: ", (amount) => {
        rl.question("Enter category: ", (category) => {
          rl.question("Enter frequency (daily/weekly/monthly): ", (frequency) => {
            const parsedAmount = parseFloat(amount);
            const cleanFrequency = frequency.trim().toLowerCase();

            if (isNaN(parsedAmount) || parsedAmount <= 0) {
              console.log("Invalid amount");
              showMenu();
              return;
            }

            if (!["daily", "weekly", "monthly"].includes(cleanFrequency)) {
              console.log("Invalid frequency");
              showMenu();
              return;
            }

            appData.recurring.push({
              id: Date.now(),
              type: cleanType,
              title: title.trim(),
              amount: parsedAmount,
              category: category.trim().toLowerCase(),
              frequency: cleanFrequency,
              lastGenerated: null,
              active: true
            });

            saveData();
            console.log("✅ Recurring transaction added");
            showMenu();
          });
        });
      });
    });
  });
}

function viewRecurringRules() {
  console.log("\n===== RECURRING RULES =====");

  if (appData.recurring.length === 0) {
    console.log("No recurring rules added yet.");
  } else {
    appData.recurring.forEach((item, index) => {
      console.log(
        `${index + 1}. [${item.type.toUpperCase()}] ${item.title} - ₹${item.amount} | ${item.category} | ${item.frequency} | ${item.active ? "Active" : "Inactive"}`
      );
    });
  }

  showMenu();
}

function toggleRecurringRule() {
  viewRecurringRulesOnly();

  rl.question("Enter recurring rule number to toggle: ", (num) => {
    const index = parseInt(num) - 1;

    if (!appData.recurring[index]) {
      console.log("Invalid rule number");
      showMenu();
      return;
    }

    appData.recurring[index].active = !appData.recurring[index].active;
    saveData();

    console.log(
      `✅ ${appData.recurring[index].title} is now ${appData.recurring[index].active ? "Active" : "Inactive"}`
    );

    showMenu();
  });
}

function viewRecurringRulesOnly() {
  console.log("\n===== RECURRING RULES =====");

  if (appData.recurring.length === 0) {
    console.log("No recurring rules added yet.");
    return;
  }

  appData.recurring.forEach((item, index) => {
    console.log(
      `${index + 1}. [${item.type.toUpperCase()}] ${item.title} - ₹${item.amount} | ${item.category} | ${item.frequency} | ${item.active ? "Active" : "Inactive"}`
    );
  });
}

// ================= RESET + HELP =================

function resetAllData() {
  rl.question("Are you sure you want to reset all data? (yes/no): ", (answer) => {
    if (answer.trim().toLowerCase() === "yes") {
      appData = { budget: 0, transactions: [], recurring: [] };
      saveData();
      console.log("🧹 All data reset successfully.");
    } else {
      console.log("Reset cancelled.");
    }
    showMenu();
  });
}

function showHelp() {
  console.log("\n===== HELP =====");
  console.log("1-2: Add expense or income");
  console.log("3-6: View transactions, totals, and balance");
  console.log("7-9: Budget and category tools");
  console.log("10-13: Edit, delete, search, filter");
  console.log("14-18: Dashboard, reports, backup");
  console.log("19-21: Recurring transaction tools");
  console.log("22: Reset everything");
  console.log("23: Show this help");
  console.log("24: Exit");
  showMenu();
}

// ================= START =================

generateRecurringTransactions();
showMenu();