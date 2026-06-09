const fs = require("fs");
const readline = require("readline");

const FILE = "kingdom.json";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let kingdom = null;

// =======================
// LOAD KINGDOM
// =======================

function loadKingdom() {
  if (fs.existsSync(FILE)) {
    const data = fs.readFileSync(FILE, "utf8");
    kingdom = JSON.parse(data);

    console.log("\n👑 Kingdom Loaded Successfully!");
    mainMenu();
  } else {
    createKingdom();
  }
}

// =======================
// SAVE KINGDOM
// =======================

function saveKingdom() {
  fs.writeFileSync(FILE, JSON.stringify(kingdom, null, 2));
}

// =======================
// CREATE KINGDOM
// =======================

function createKingdom() {
  console.log("\n===== CREATE YOUR KINGDOM =====");

  rl.question("Enter Kingdom Name: ", (kingdomName) => {

    rl.question("Enter Ruler Name: ", (rulerName) => {

      kingdom = {
        kingdomName,
        rulerName,

        gold: 1000,
        food: 500,
        population: 100,

        createdAt: new Date().toLocaleString()
      };

      saveKingdom();

      console.log("\n🎉 Kingdom Created Successfully!");
      mainMenu();
    });
  });
}

// =======================
// VIEW STATUS
// =======================

function viewKingdomStatus() {

  console.log("\n==========================");
  console.log("👑 KINGDOM STATUS");
  console.log("==========================");

  console.log(`Kingdom Name : ${kingdom.kingdomName}`);
  console.log(`Ruler        : ${kingdom.rulerName}`);

  console.log(`Gold         : ${kingdom.gold}`);
  console.log(`Food         : ${kingdom.food}`);
  console.log(`Population   : ${kingdom.population}`);

  console.log(`Created At   : ${kingdom.createdAt}`);

  console.log("==========================");
}

// =======================
// MAIN MENU
// =======================

function mainMenu() {

  console.log("\n===== CODECRAFT KINGDOM =====");

  console.log("1. View Kingdom Status");
  console.log("2. Save Kingdom");
  console.log("3. Exit");

  rl.question("\nChoose Option: ", (choice) => {

    switch (choice) {

      case "1":
        viewKingdomStatus();
        mainMenu();
        break;

      case "2":
        saveKingdom();
        console.log("💾 Kingdom Saved!");
        mainMenu();
        break;

      case "3":
        console.log("\n👋 Farewell, Your Majesty!");
        rl.close();
        break;

      default:
        console.log("❌ Invalid Choice");
        mainMenu();
    }
  });
}

// =======================
// START GAME
// =======================

console.log("\n🏰 Welcome To CodeCraft Kingdom");

loadKingdom();