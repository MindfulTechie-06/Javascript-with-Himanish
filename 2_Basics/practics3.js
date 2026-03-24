// Array of student objects
const students = [
  { id: 1, name: "Rahul", marks: 85 },
  { id: 2, name: "Anjali", marks: 92 },
  { id: 3, name: "Vikram", marks: 74 }
];

// 1. Add a new student
function addStudent(id, name, marks) {
  students.push({ id, name, marks });
}

// 2. Display all students
function displayStudents() {
  console.log("Student List:");
  students.forEach(student => {
    console.log(`ID: ${student.id}, Name: ${student.name}, Marks: ${student.marks}`);
  });
}

// 3. Find top scorer
function getTopScorer() {
  let topStudent = students[0];

  students.forEach(student => {
    if (student.marks > topStudent.marks) {
      topStudent = student;
    }
  });

  return topStudent;
}

// 4. Filter students above a certain marks
function getHighScorers(minMarks) {
  return students.filter(student => student.marks >= minMarks);
}

// ---- Execution ----
addStudent(4, "Priya", 88);

displayStudents();

const top = getTopScorer();
console.log("\nTop Scorer:", top);

const highScorers = getHighScorers(80);
console.log("\nStudents scoring above 80:");
console.log(highScorers);