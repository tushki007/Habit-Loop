// Habit Loop - Daily Tracking (FIXED)

const habitInput = document.querySelector(".habit-input input");
const addHabitBtn = document.querySelector(".habit-input button");
const habitList = document.querySelector(".habit-list");

// Load on page load
document.addEventListener("DOMContentLoaded", renderAll);

// Add habit
addHabitBtn.addEventListener("click", addHabit);

// Get today's date
function getToday() {
    return new Date().toISOString().split("T")[0];
}

// Storage helpers
function getHabits() {
    return JSON.parse(localStorage.getItem("habits")) || [];
}

function saveHabits(habits) {
    localStorage.setItem("habits", JSON.stringify(habits));
}

// Add habit function
function addHabit() {
    const name = habitInput.value.trim();
    if (!name) {
        alert("Enter a habit");
        return;
    }

    const habits = getHabits();

    habits.push({
        id: Date.now(),
        name: name,
        logs: {}
    });

    saveHabits(habits);
    habitInput.value = "";

    renderAll(); // 🔥 IMPORTANT FIX
}

// Render all habits
function renderAll() {
    habitList.innerHTML = "";

    const habits = getHabits();
    habits.forEach(habit => {
        renderHabit(habit);
    });
}

// Render one habit
function renderHabit(habit) {
    const today = getToday();

    // 🔒 SAFETY: ensure logs always exists
    if (!habit.logs) {
        habit.logs = {};
        const habits = getHabits();
        const index = habits.findIndex(h => h.id === habit.id);
        habits[index] = habit;
        saveHabits(habits);
    }

    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.logs[today] === true;

    checkbox.addEventListener("change", () => {
        toggleHabit(habit.id);
    });

    const span = document.createElement("span");
    span.textContent = habit.name;

    li.appendChild(checkbox);
    li.appendChild(span);
    habitList.appendChild(li);
}
  
// Toggle today log
function toggleHabit(id) {
    const today = getToday();
    const habits = getHabits();

    const habit = habits.find(h => h.id === id);
    habit.logs[today] = !habit.logs[today];

    saveHabits(habits);
}

