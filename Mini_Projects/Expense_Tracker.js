import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const FILE = "finances.json";

// ================= LOAD & SAVE =================

function normalizeTransaction(item, defaultType = "expense") {
  return {
    id: item.id || Date.now(),
    type: item.type || defaultType,
    title: item.title || "Untitled",
    amount: Number(item.amount) || 0,
    category: item.category || "other",
    date: item.date || new Date().toLocaleString(),
    recurringId: item.recurringId || null
  };
}

function normalizeRecurringRule(item) {
  return {
    id: item.id || Date.now(),
    type: item.type || "expense",
    title: item.title || "Untitled",
    amount: Number(item.amount) || 0,
    category: item.category || "other",
    frequency: item.frequency || "monthly",
    lastGenerated: item.lastGenerated || null,
    active: item.active !== false
  };
}

function normalizeGoal(item) {
  return {
    id: item.id || Date.now(),
    name: item.name || "Untitled Goal",
    target: Number(item.target) || 0,
    createdAt: item.createdAt || new Date().toLocaleString()
  };
}

function loadData() {
  if (!fs.existsSync(FILE)) {
    return { budget: 0, transactions: [], recurring: [], goals: [] };
  }

  const raw = JSON.parse(fs.readFileSync(FILE, "utf-8"));

  if (Array.isArray(raw)) {
    return {
      budget: 0,
      transactions: raw.map((item) => normalizeTransaction(item)),
      recurring: [],
      goals: []
    };
  }

  return {
    budget: raw.budget || 0,
    transactions: (raw.transactions || []).map((item) => normalizeTransaction(item)),
    recurring: (raw.recurring || []).map((item) => normalizeRecurringRule(item)),
    goals: (raw.goals || []).map((item) => normalizeGoal(item))
  };
}

function saveData() {
  fs.writeFileSync(FILE, JSON.stringify(appData, null, 2));
}

let appData = loadData();

// ================= BASIC HELPERS =================

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

// ================= RECURRING HELPERS =================

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

      template.lastGenerated = new Date().toISOString();
      changed = true;
    }
  });

  if (changed) {
    saveData();
  }
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

function getGoalProgress(goal) {
  const balance = getBalance();
  if (goal.target <= 0) return 0;
  return Math.min((balance / goal.target) * 100, 100);
}

// ================= ANALYTICS HELPERS =================

function getUniqueExpenseDates() {
  return [...new Set(
    appData.transactions
      .filter((t) => t.type === "expense")
      .map((t) => new Date(t.date).toDateString())
  )].sort((a, b) => new Date(a) - new Date(b));
}

function getSpendingStreak() {
  const dates = getUniqueExpenseDates();
  if (dates.length === 0) return 0;

  let streak = 1;
  for (let i = dates.length - 1; i > 0; i--) {
    const current = new Date(dates[i]);
    const previous = new Date(dates[i - 1]);
    const diff = (current - previous) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function getMostExpensiveDay() {
  const dayTotals = {};

  appData.transactions
    .filter((t) => t.type === "expense")
    .forEach((transaction) => {
      const day = new Date(transaction.date).toDateString();
      dayTotals[day] = (dayTotals[day] || 0) + transaction.amount;
    });

  let highestDay = "N/A";
  let highestAmount = 0;

  for (const day in dayTotals) {
    if (dayTotals[day] > highestAmount) {
      highestAmount = dayTotals[day];
      highestDay = day;
    }
  }

  return { highestDay, highestAmount };
}

function getAverageDailySpending() {
  const expenseTransactions = appData.transactions.filter((t) => t.type === "expense");
  if (expenseTransactions.length === 0) return 0;

  const days = new Set();
  expenseTransactions.forEach((transaction) => {
    days.add(new Date(transaction.date).toDateString());
  });

  return getExpenseTotal() / days.size;
}

function getTopThreeCategories() {
  const categories = {};

  appData.transactions
    .filter((t) => t.type === "expense")
    .forEach((transaction) => {
      categories[transaction.category] = (categories[transaction.category] || 0) + transaction.amount;
    });

  return Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
}

function getSavingsRate() {
  const income = getIncomeTotal();
  if (income === 0) return 0;

  const savings = income - getExpenseTotal();
  return (savings / income) * 100;
}

function getFinancialHealthScore() {
  let score = 0;

  const savingsRate = getSavingsRate();
  if (savingsRate >= 30) score += 40;
  else if (savingsRate >= 20) score += 30;
  else if (savingsRate >= 10) score += 20;

  const budgetOk = appData.budget > 0 && getExpenseTotal() <= appData.budget;
  if (budgetOk) score += 30;

  if (appData.goals.length > 0) score += 15;
  if (appData.recurring.length > 0) score += 15;

  return Math.min(score, 100);
}

function getSpendingTrendComparison() {
  const monthMap = {};

  appData.transactions
    .filter((t) => t.type === "expense")
    .forEach((transaction) => {
      const d = new Date(transaction.date);
      const key = `${d.getMonth() + 1}-${d.getFullYear()}`;
      monthMap[key] = (monthMap[key] || 0) + transaction.amount;
    });

  const keys = Object.keys(monthMap).sort();
  if (keys.length < 2) return null;

  const last = monthMap[keys[keys.length - 1]];
  const prev = monthMap[keys[keys.length - 2]];

  return {
    currentMonth: keys[keys.length - 1],
    previousMonth: keys[keys.length - 2],
    currentAmount: last,
    previousAmount: prev,
    difference: last - prev
  };
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
  console.log("22. Add Savings Goal");
  console.log("23. View Savings Goals");
  console.log("24. Edit Recurring Rule");
  console.log("25. Delete Recurring Rule");
  console.log("26. Reset All Data");
  console.log("27. Help");
  console.log("28. Analytics Dashboard");
  console.log("29. Exit");

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
      addSavingsGoal();
      break;
    case "23":
      viewSavingsGoals();
      break;
    case "24":
      editRecurringRule();
      break;
    case "25":
      deleteRecurringRule();
      break;
    case "26":
      resetAllData();
      break;
    case "27":
      showHelp();
      break;
    case "28":
      showAnalyticsDashboard();
      break;
    case "29":
      console.log("Exiting...");
      rl.close();
      break;
    default:
      console.log("Invalid option");
      showMenu();
  }
}

// ================= TRANSACTIONS =================

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

// ================= CATEGORY / BUDGET =================

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

// ================= EDIT / DELETE =================

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

// ================= SEARCH / FILTER =================

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

// ================= SUMMARIES =================

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

// ================= EXPORT / BACKUP =================

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
${appData.transactions
  .map(
    (transaction) =>
      `- [${transaction.type.toUpperCase()}] ${transaction.title} | ₹${transaction.amount.toFixed(2)} | ${transaction.category} | ${transaction.date}`
  )
  .join("\n")}
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
  viewRecurringRulesOnly();
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

function editRecurringRule() {
  viewRecurringRulesOnly();

  rl.question("Enter recurring rule number to edit: ", (num) => {
    const index = parseInt(num) - 1;

    if (!appData.recurring[index]) {
      console.log("Invalid rule");
      showMenu();
      return;
    }

    rl.question("Enter new title: ", (newTitle) => {
      rl.question("Enter new amount: ", (newAmount) => {
        rl.question("Enter new category: ", (newCategory) => {
          rl.question("Enter new frequency (daily/weekly/monthly): ", (newFrequency) => {
            const parsedAmount = parseFloat(newAmount);
            const cleanFrequency = newFrequency.trim().toLowerCase();

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

            appData.recurring[index].title = newTitle.trim();
            appData.recurring[index].amount = parsedAmount;
            appData.recurring[index].category = newCategory.trim().toLowerCase();
            appData.recurring[index].frequency = cleanFrequency;

            saveData();
            console.log("✏ Recurring rule updated");
            showMenu();
          });
        });
      });
    });
  });
}

function deleteRecurringRule() {
  viewRecurringRulesOnly();

  rl.question("Enter recurring rule number to delete: ", (num) => {
    const index = parseInt(num) - 1;

    if (!appData.recurring[index]) {
      console.log("Invalid rule");
      showMenu();
      return;
    }

    console.log(`🗑 Deleted ${appData.recurring[index].title}`);
    appData.recurring.splice(index, 1);
    saveData();
    showMenu();
  });
}

// ================= SAVINGS GOALS =================

function addSavingsGoal() {
  rl.question("Goal name: ", (name) => {
    rl.question("Target amount: ", (amount) => {
      const target = parseFloat(amount);

      if (isNaN(target) || target <= 0) {
        console.log("Invalid amount");
        showMenu();
        return;
      }

      appData.goals.push({
        id: Date.now(),
        name: name.trim(),
        target,
        createdAt: new Date().toLocaleString()
      });

      saveData();
      console.log("🎯 Goal added");
      showMenu();
    });
  });
}

function viewSavingsGoals() {
  console.log("\n===== SAVINGS GOALS =====");

  if (!appData.goals || appData.goals.length === 0) {
    console.log("No goals found.");
    showMenu();
    return;
  }

  const balance = getBalance();

  appData.goals.forEach((goal, index) => {
    const progress = goal.target <= 0 ? 0 : Math.min((balance / goal.target) * 100, 100);

    console.log(`${index + 1}. ${goal.name}`);
    console.log(`Target: ₹${goal.target.toFixed(2)}`);
    console.log(`Current Balance: ₹${balance.toFixed(2)}`);
    console.log(`Progress: ${progress.toFixed(2)}%`);
    console.log(`Created: ${goal.createdAt}`);
    console.log("----------------------");
  });

  showMenu();
}

// ================= RESET / HELP =================

function resetAllData() {
  rl.question("Are you sure you want to reset all data? (yes/no): ", (answer) => {
    if (answer.trim().toLowerCase() === "yes") {
      appData = { budget: 0, transactions: [], recurring: [], goals: [] };
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
  console.log("22-23: Savings goals");
  console.log("24-25: Manage recurring rules");
  console.log("26: Reset everything");
  console.log("27: Show this help");
  console.log("28: Analytics dashboard");
  console.log("29: Exit");
  showMenu();
}

// ================= ANALYTICS DASHBOARD =================

function showAnalyticsDashboard() {
  console.log("\n===== ANALYTICS DASHBOARD =====");

  const streak = getSpendingStreak();
  const expensiveDay = getMostExpensiveDay();
  const avgDaily = getAverageDailySpending();
  const topCategories = getTopThreeCategories();
  const savingsRate = getSavingsRate();
  const healthScore = getFinancialHealthScore();
  const trend = getSpendingTrendComparison();

  console.log(`🔥 Spending Streak: ${streak} days`);
  console.log(`💸 Most Expensive Day: ${expensiveDay.highestDay}`);
  console.log(`Amount: ₹${expensiveDay.highestAmount.toFixed(2)}`);
  console.log(`📊 Average Daily Spending: ₹${avgDaily.toFixed(2)}`);
  console.log(`💰 Savings Rate: ${savingsRate.toFixed(2)}%`);
  console.log(`🏆 Financial Health Score: ${healthScore}/100`);

  console.log("\nTop Categories:");
  if (topCategories.length === 0) {
    console.log("No expense categories found.");
  } else {
    topCategories.forEach(([category, amount], index) => {
      console.log(`${index + 1}. ${category} - ₹${amount.toFixed(2)}`);
    });
  }

  console.log("\nTrend Comparison:");
  if (!trend) {
    console.log("Not enough data for a month-over-month comparison.");
  } else {
    const direction = trend.difference >= 0 ? "higher" : "lower";
    console.log(
      `${trend.currentMonth}: ₹${trend.currentAmount.toFixed(2)} vs ${trend.previousMonth}: ₹${trend.previousAmount.toFixed(2)}`
    );
    console.log(`Current month is ${Math.abs(trend.difference).toFixed(2)} ${direction} than previous month.`);
  }

  showMenu();
}

// ================= START =================

generateRecurringTransactions();
showMenu();