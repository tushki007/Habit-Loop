// Habit Loop - Daily Tracking (FIXED)
let barChartInstance = null;
let pieChartInstance = null;

const habitInput = document.querySelector(".habit-input input");
const addHabitBtn = document.querySelector(".habit-input button");
const habitList = document.querySelector(".habit-list");
const reportBtn = document.getElementById("reportBtn");
const reportDiv = document.getElementById("report");
const themeToggle = document.getElementById("themeToggle");

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "🌞";
}

// Toggle theme
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "🌞" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

if (reportBtn) {
    reportBtn.addEventListener("click", generateReport);
}

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

function generateReport() {
    const habits = getHabits();
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    reportDiv.innerHTML = "<h3>Monthly Report</h3>";

    const habitNames = [];
    const habitPercentages = [];

    let totalCompleted = 0;
    let totalPossible = habits.length * daysInMonth;

    habits.forEach(habit => {
        let completedDays = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey =
                `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            if (habit.logs && habit.logs[dateKey]) {
                completedDays++;
            }
        }

        totalCompleted += completedDays;

        const percent = Math.round((completedDays / daysInMonth) * 100);

        habitNames.push(habit.name);
        habitPercentages.push(percent);

        const p = document.createElement("p");
        p.textContent = `${habit.name}: ${completedDays}/${daysInMonth} days (${percent}%)`;
        reportDiv.appendChild(p);
    });

    drawBarChart(habitNames, habitPercentages);
    drawPieChart(totalCompleted, totalPossible - totalCompleted);
}
function drawBarChart(labels, data) {
    const canvas = document.getElementById("barChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (barChartInstance) barChartInstance.destroy();

    barChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Consistency %",
                data: data,
                backgroundColor: "#4f46e5"
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}
function drawPieChart(completed, missed) {
    const canvas = document.getElementById("pieChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (pieChartInstance) pieChartInstance.destroy();

    pieChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Completed", "Missed"],
            datasets: [{
                data: [completed, missed],
                backgroundColor: ["#16a34a", "#dc2626"]
            }]
        }
    });
}
