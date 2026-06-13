const fs = require("fs");
const readline = require("readline");

const FILE = "city.json";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let city = null;

// ======================
// SAVE CITY
// ======================

function saveCity() {
  fs.writeFileSync(
    FILE,
    JSON.stringify(city, null, 2)
  );
}

// ======================
// LOG SYSTEM
// ======================

function addLog(message) {

  city.logs.push({
    day: city.day,
    message
  });

  saveCity();
}

// ======================
// CREATE CITY
// ======================

function createCity() {

  console.log("\n===== CREATE CITY =====");

  rl.question(
    "Enter City Name: ",
    (name) => {

      city = {
        name,

        population: 1000,

        budget: 50000,

        energy: 100,

        water: 100,

        traffic: 20,

        environment: 80,

        happiness: 75,

        day: 1,

        logs: []
      };

      saveCity();

      console.log(
        "\n🏙 City Created Successfully!"
      );

      mainMenu();
    }
  );
}

// ======================
// LOAD CITY
// ======================

function loadCity() {

  if (fs.existsSync(FILE)) {

    city = JSON.parse(
      fs.readFileSync(FILE, "utf8")
    );

    if (!city.logs)
      city.logs = [];

    console.log(
      "\n🏙 City Loaded Successfully!"
    );

    mainMenu();

  } else {

    createCity();
  }
}

// ======================
// VIEW CITY STATUS
// ======================

function viewCityStatus() {

  console.log(
    "\n========== CITY STATUS =========="
  );

  console.log(
    `City Name   : ${city.name}`
  );

  console.log(
    `Day         : ${city.day}`
  );

  console.log(
    `Population  : ${city.population}`
  );

  console.log(
    `Budget      : ₹${city.budget}`
  );

  console.log(
    `Energy      : ${city.energy}`
  );

  console.log(
    `Water       : ${city.water}`
  );

  console.log(
    `Traffic     : ${city.traffic}`
  );

  console.log(
    `Environment : ${city.environment}`
  );

  console.log(
    `Happiness   : ${city.happiness}`
  );

  console.log(
    "================================="
  );

  mainMenu();
}

// ======================
// ADVANCE DAY
// ======================

function advanceDay() {

  city.day++;

  // Tax Collection
  const taxCollected =
    city.population * 2;

  city.budget += taxCollected;

  // Resource Consumption
  const consumption =
    Math.floor(
      city.population / 100
    );

  city.energy -= consumption;

  city.water -= consumption;

  addLog(
    `Collected ₹${taxCollected} taxes`
  );

  addLog(
    `Consumed ${consumption} energy`
  );

  addLog(
    `Consumed ${consumption} water`
  );

  console.log(
    `\n📅 Day ${city.day}`
  );

  console.log(
    `💰 Tax Collected: ₹${taxCollected}`
  );

  console.log(
    `⚡ Energy Used: ${consumption}`
  );

  console.log(
    `💧 Water Used: ${consumption}`
  );

  saveCity();

  mainMenu();
}

// ======================
// VIEW LOGS
// ======================

function viewLogs() {

  console.log(
    "\n===== CITY ACTIVITY LOG ====="
  );

  if (
    city.logs.length === 0
  ) {

    console.log(
      "No activity recorded."
    );
  }

  else {

    city.logs
      .slice(-10)
      .forEach((log, index) => {

        console.log(
          `${index + 1}. Day ${log.day}`
        );

        console.log(
          `   ${log.message}`
        );
      });
  }

  mainMenu();
}

// ======================
// MAIN MENU
// ======================

function mainMenu() {

  console.log(
    "\n===== SMART CITY SIMULATOR ====="
  );

  console.log(
    "1. View City Status"
  );

  console.log(
    "2. Advance Day"
  );

  console.log(
    "3. View Activity Log"
  );

  console.log(
    "4. Save City"
  );

  console.log(
    "5. Exit"
  );

  rl.question(
    "\nChoose Option: ",
    (choice) => {

      switch (choice) {

        case "1":

          viewCityStatus();
          break;

        case "2":

          advanceDay();
          break;

        case "3":

          viewLogs();
          break;

        case "4":

          saveCity();

          console.log(
            "💾 City Saved!"
          );

          mainMenu();
          break;

        case "5":

          console.log(
            "\n👋 Goodbye Mayor!"
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
  "\n🏙 Welcome To Smart City Simulator"
);

loadCity();