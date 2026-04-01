import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const FILE = "notes.json";

// Load existing notes
function loadNotes() {
    if (!fs.existsSync(FILE)) return [];
    const data = fs.readFileSync(FILE);
    return JSON.parse(data);
}

// Save notes
function saveNotes(notes) {
    fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));
}

// Show Menu
function showMenu() {
    console.log("\n===== NOTES APP =====");
    console.log("1. Add Note");
    console.log("2. View Notes");
    console.log("3. Delete Note");
    console.log("4. Exit");

    rl.question("Choose option: ", handleMenu);
}

function handleMenu(choice) {
    switch (choice) {
        case "1":
            addNote();
            break;
        case "2":
            viewNotes();
            break;
        case "3":
            deleteNote();
            break;
        case "4":
            rl.close();
            break;
        default:
            console.log("Invalid choice");
            showMenu();
    }
}

// Add Note
function addNote() {
    rl.question("Enter note: ", (note) => {
        let notes = loadNotes();
        notes.push(note);
        saveNotes(notes);
        console.log("✅ Note saved");
        showMenu();
    });
}

// View Notes
function viewNotes() {
    let notes = loadNotes();
    console.log("\nYour Notes:");
    if (notes.length === 0) {
        console.log("No notes found");
    } else {
        notes.forEach((note, i) => {
            console.log(`${i + 1}. ${note}`);
        });
    }
    showMenu();
}

// Delete Note
function deleteNote() {
    let notes = loadNotes();
    rl.question("Enter note number to delete: ", (num) => {
        let index = num - 1;
        if (notes[index]) {
            notes.splice(index, 1);
            saveNotes(notes);
            console.log("🗑 Note deleted");
        } else {
            console.log("Invalid number");
        }
        showMenu();
    });
}

// Start
showMenu();