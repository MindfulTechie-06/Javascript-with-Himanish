const fs = require("fs");
const readline = require("readline");

const FILE = "kingdom.json";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let kingdom = null;

// ======================
// SAVE SYSTEM
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
// DAY SYSTEM
// ======================

function nextDay() {

  kingdom.day++;

  const foodConsumed =
    kingdom.population;

  kingdom.food -= foodConsumed;

  const farmProduction =
    kingdom.buildings.farm * 50;

  kingdom.food += farmProduction;

  if (kingdom.food < 0) {

    kingdom.food = 0;

    kingdom.population =
      Math.max(
        10,
        kingdom.population - 5
      );

    addLog(
      "Food shortage! Population decreased."
    );
  }

  else if (
    kingdom.food >
    kingdom.population * 2
  ) {

    kingdom.population += 2;

    addLog(
      "Population increased."
    );
  }

  randomEvent();

  saveKingdom();
}

// ======================
// RANDOM EVENTS
// ======================

function randomEvent() {

  const chance = Math.random();

  if (chance < 0.15) {

    kingdom.gold += 100;

    console.log(
      "🎁 Merchant donated 100 gold!"
    );

    addLog(
      "Merchant donated 100 gold."
    );
  }

  else if (chance < 0.30) {

    kingdom.food += 80;

    console.log(
      "🌾 Good harvest! +80 food"
    );

    addLog(
      "Good harvest +80 food."
    );
  }

  else if (chance < 0.40) {

    kingdom.wood =
      Math.max(
        0,
        kingdom.wood - 50
      );

    console.log(
      "🔥 Fire destroyed 50 wood!"
    );

    addLog(
      "Fire destroyed 50 wood."
    );
  }
}

// ======================
// CREATE KINGDOM
// ======================

function createKingdom() {

  console.log(
    "\n===== CREATE KINGDOM ====="
  );

  rl.question(
    "Kingdom Name: ",
    (kingdomName) => {

      rl.question(
        "Ruler Name: ",
        (rulerName) => {

          kingdom = {

            kingdomName,
            rulerName,

            gold: 1000,
            food: 500,
            wood: 200,
            stone: 150,
            population: 100,

            day: 1,

            logs: [],

            buildings: {
              farm: 0,
              house: 0,
              lumberMill: 0,
              quarry: 0
            }
          };

          saveKingdom();

          console.log(
            "🎉 Kingdom Created!"
          );

          mainMenu();
        }
      );
    }
  );
}

// ======================
// LOAD KINGDOM
// ======================

function loadKingdom() {

  if (fs.existsSync(FILE)) {

    kingdom = JSON.parse(
      fs.readFileSync(
        FILE,
        "utf8"
      )
    );

    if (!kingdom.day)
      kingdom.day = 1;

    if (!kingdom.logs)
      kingdom.logs = [];

    if (!kingdom.buildings) {

      kingdom.buildings = {
        farm: 0,
        house: 0,
        lumberMill: 0,
        quarry: 0
      };
    }

    console.log(
      "👑 Kingdom Loaded!"
    );

    mainMenu();
  }

  else {
    createKingdom();
  }
}