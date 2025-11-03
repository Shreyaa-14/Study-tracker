let habits = JSON.parse(localStorage.getItem("habits")) || [];
const habitList = document.getElementById("habitList");
const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const resetWeekBtn = document.getElementById("resetWeekBtn");

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
  renderChart();
}

function renderHabits() {
  habitList.innerHTML = "";
  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.className = "habit";
    li.innerHTML = `
      <span>${habit.name} 💜 — Streak: ${habit.streak} 🔥</span>
      <div>
        <button onclick="markDone(${index})">Done ✅</button>
        <button class="delete-btn" onclick="deleteHabit(${index})">🗑️</button>
      </div>
    `;
    habitList.appendChild(li);
  });
}

function addHabit() {
  const name = habitInput.value.trim();
  if (name) {
    habits.push({
      name,
      streak: 0,
      weekly: [0, 0, 0, 0, 0, 0, 0]
    });
    habitInput.value = "";
    saveHabits();
  }
}

function markDone(index) {
  habits[index].streak++;
  const today = new Date().getDay();
  habits[index].weekly[today]++;
  saveHabits();

  // cute heart animation 💜
  const heart = document.createElement("div");
  heart.innerText = "💜";
  heart.className = "floating-heart";
  document.body.appendChild(heart);
  heart.style.left = Math.random() * window.innerWidth + "px";
  setTimeout(() => heart.remove(), 2000);
}

function deleteHabit(index) {
  habits.splice(index, 1);
  saveHabits();
}

function renderChart() {
  const chart = document.getElementById("chart");
  chart.innerHTML = "";
  const days = ["S","M","T","W","T","F","S"];
  const weeklyTotals = [0,0,0,0,0,0,0];

  habits.forEach(h => h.weekly.forEach((val, i) => weeklyTotals[i] += val));

  const maxVal = Math.max(...weeklyTotals, 1);

  weeklyTotals.forEach((val, i) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    const height = (val / maxVal) * 120 + 20;
    bar.style.height = `${height}px`;
    bar.title = `${days[i]}: ${val} completions`;
    bar.innerText = days[i];
    chart.appendChild(bar);
  });
}

function resetWeeklyData() {
  habits.forEach(habit => habit.weekly = [0,0,0,0,0,0,0]);
  saveHabits();
}

addHabitBtn.addEventListener("click", addHabit);
habitInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addHabit();
});
resetWeekBtn.addEventListener("click", resetWeeklyData);

renderHabits();
renderChart();
