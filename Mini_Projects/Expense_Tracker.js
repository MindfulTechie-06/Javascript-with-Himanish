import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let expenses = [];

function showMenu() {
  console.log("\n===== SMART EXPENSE TRACKER =====");
  console.log("1. Add Expense");
  console.log("2. View Expenses");
  console.log("3. Show Total Spent");
  console.log("4. Exit");

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
      const parsedAmount = parseFloat(amount);

      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        console.log("Please enter a valid amount.");
        showMenu();
        return;
      }

      expenses.push({
        title: title.trim(),
        amount: parsedAmount
      });

      console.log("✅ Expense added");
      showMenu();
    });
  });
}

function viewExpenses() {
  console.log("\n===== EXPENSE LIST =====");

  if (expenses.length === 0) {
    console.log("No expenses added yet.");
  } else {
    expenses.forEach((expense, index) => {
      console.log(`${index + 1}. ${expense.title} - ₹${expense.amount}`);
    });
  }

  showMenu();
}

function showTotalSpent() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  console.log(`\n💰 Total Spent: ₹${total}`);
  showMenu();
}

showMenu();