const fs = require("fs");
const readline = require("readline");

const FILE = "kingdom.json";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let kingdom = null;

// ======================
// LOAD KINGDOM
// ======================

function loadKingdom() {
  if (fs.existsSync(FILE)) {
    kingdom = JSON.parse(
      fs.readFileSync(FILE, "utf8")
    );

    // Upgrade Day 1 Save
    if (!kingdom.wood) kingdom.wood = 200;
    if (!kingdom.stone) kingdom.stone = 150;
    if (!kingdom.logs) kingdom.logs = [];

    console.log("\n👑 Kingdom Loaded!");
    mainMenu();
  } else {
    createKingdom();
  }
}

// ======================
// SAVE
// ======================

function saveKingdom() {
  fs.writeFileSync(
    FILE,
    JSON.stringify(kingdom, null, 2)
  );
}

// ======================
// LOG SYSTEM
// ======================

function addLog(message) {
  kingdom.logs.push({
    time: new Date().toLocaleString(),
    message
  });

  saveKingdom();
}

// ======================
// CREATE KINGDOM
// ======================

function createKingdom() {

  console.log("\n===== CREATE KINGDOM =====");

  rl.question(
    "Enter Kingdom Name: ",
    (kingdomName) => {

      rl.question(
        "Enter Ruler Name: ",
        (rulerName) => {

          kingdom = {
            kingdomName,
            rulerName,

            gold: 1000,
            food: 500,
            wood: 200,
            stone: 150,
            population: 100,

            logs: [],

            createdAt:
              new Date().toLocaleString()
          };

          saveKingdom();

          console.log(
            "\n🎉 Kingdom Created!"
          );

          mainMenu();
        }
      );
    }
  );
}

// ======================
// STATUS
// ======================

function viewKingdomStatus() {

  console.log("\n====================");
  console.log("👑 KINGDOM STATUS");
  console.log("====================");

  console.log(
    `Kingdom : ${kingdom.kingdomName}`
  );

  console.log(
    `Ruler   : ${kingdom.rulerName}`
  );

  console.log(
    `Gold    : ${kingdom.gold}`
  );

  console.log(
    `Food    : ${kingdom.food}`
  );

  console.log(
    `Wood    : ${kingdom.wood}`
  );

  console.log(
    `Stone   : ${kingdom.stone}`
  );

  console.log(
    `Population : ${kingdom.population}`
  );
}

// ======================
// GATHER WOOD
// ======================

function gatherWood() {

  const woodCollected =
    Math.floor(Math.random() * 100) + 50;

  kingdom.wood += woodCollected;

  addLog(
    `Gathered ${woodCollected} wood`
  );

  console.log(
    `🌲 Collected ${woodCollected} wood`
  );

  saveKingdom();

  mainMenu();
}

// ======================
// MINE STONE
// ======================

function mineStone() {

  const stoneCollected =
    Math.floor(Math.random() * 80) + 40;

  kingdom.stone += stoneCollected;

  addLog(
    `Mined ${stoneCollected} stone`
  );

  console.log(
    `⛏ Collected ${stoneCollected} stone`
  );

  saveKingdom();

  mainMenu();
}

// ======================
// HUNT FOOD
// ======================

function huntFood() {

  const foodCollected =
    Math.floor(Math.random() * 120) + 60;

  kingdom.food += foodCollected;

  addLog(
    `Hunted ${foodCollected} food`
  );

  console.log(
    `🍖 Collected ${foodCollected} food`
  );

  saveKingdom();

  mainMenu();
}

// ======================
// RESOURCE DASHBOARD
// ======================

function resourceDashboard() {

  console.log("\n===== RESOURCES =====");

  console.log(
    `💰 Gold : ${kingdom.gold}`
  );

  console.log(
    `🍖 Food : ${kingdom.food}`
  );

  console.log(
    `🌲 Wood : ${kingdom.wood}`
  );

  console.log(
    `🪨 Stone: ${kingdom.stone}`
  );

  console.log(
    `👥 Population: ${kingdom.population}`
  );

  mainMenu();
}

// ======================
// ACTIVITY LOG
// ======================

function viewLogs() {

  console.log(
    "\n===== ACTIVITY LOG ====="
  );

  if (kingdom.logs.length === 0) {

    console.log("No logs available.");

  } else {

    kingdom.logs
      .slice(-10)
      .forEach((log, index) => {

        console.log(
          `${index + 1}. ${log.time}`
        );

        console.log(
          `   ${log.message}`
        );
      });
  }

  mainMenu();
}

// ======================
// MENU
// ======================

function mainMenu() {

  console.log(
    "\n===== CODECRAFT KINGDOM ====="
  );

  console.log("1. View Kingdom");

  console.log("2. Gather Wood");

  console.log("3. Mine Stone");

  console.log("4. Hunt Food");

  console.log("5. Resource Dashboard");

  console.log("6. View Activity Log");

  console.log("7. Save Kingdom");

  console.log("8. Exit");

  rl.question(
    "\nChoose Option: ",
    (choice) => {

      switch (choice) {

        case "1":
          viewKingdomStatus();
          mainMenu();
          break;

        case "2":
          gatherWood();
          break;

        case "3":
          mineStone();
          break;

        case "4":
          huntFood();
          break;

        case "5":
          resourceDashboard();
          break;

        case "6":
          viewLogs();
          break;

        case "7":
          saveKingdom();
          console.log(
            "💾 Kingdom Saved!"
          );
          mainMenu();
          break;

        case "8":
          console.log(
            "\n👋 Farewell, Your Majesty!"
          );
          rl.close();
          break;

        default:
          console.log(
            "❌ Invalid Choice"
          );
          mainMenu();
      }
    }
  );
}

// ======================
// START GAME
// ======================

console.log(
  "\n🏰 Welcome To CodeCraft Kingdom"
);

loadKingdom();