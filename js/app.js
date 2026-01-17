// Habit Loop - Persistent Version

const habitInput = document.querySelector(".habit-input input");
const addHabitBtn = document.querySelector(".habit-input button");
const habitList = document.querySelector(".habit-list");

// Load habits when page loads
document.addEventListener("DOMContentLoaded", loadHabits);

// Button event
addHabitBtn.addEventListener("click", addHabit);

// Get habits from LocalStorage
function getHabits() {
    return JSON.parse(localStorage.getItem("habits")) || [];
}

// Save habits to LocalStorage
function saveHabits(habits) {
    localStorage.setItem("habits", JSON.stringify(habits));
}

// Add habit
function addHabit() {
    const habitName = habitInput.value.trim();
    if (habitName === "") return alert("Enter a habit");

    const habits = getHabits();

    const habit = {
        id: Date.now(),
        name: habitName,
        completed: false
    };

    habits.push(habit);
    saveHabits(habits);

    renderHabit(habit);
    habitInput.value = "";
}

// Render single habit
function renderHabit(habit) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.completed;

    checkbox.addEventListener("change", () => {
        toggleHabit(habit.id);
    });

    const span = document.createElement("span");
    span.textContent = habit.name;

    li.appendChild(checkbox);
    li.appendChild(span);
    habitList.appendChild(li);
}

// Load habits on refresh
function loadHabits() {
    const habits = getHabits();
    habits.forEach(renderHabit);
}

// Toggle completion
function toggleHabit(id) {
    const habits = getHabits();
    const habit = habits.find(h => h.id === id);
    habit.completed = !habit.completed;
    saveHabits(habits);
}

