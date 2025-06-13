const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");
const bgColorPicker = document.getElementById("bgColorPicker");

let tasks = [];

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task ${task.done ? "done" : ""}`;

    const content = document.createElement("div");
    content.innerHTML = `<strong>${task.text}</strong> - ${task.date}`;
    
    const controls = document.createElement("div");
    controls.className = "controls";

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = task.done ? "Pendente" : "Concluir";
    toggleBtn.onclick = () => toggleTask(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Excluir";
    deleteBtn.onclick = () => deleteTask(index);

    controls.appendChild(toggleBtn);
    controls.appendChild(deleteBtn);

    li.appendChild(content);
    li.appendChild(controls);

    taskList.appendChild(li);
  });
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
  saveTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
  saveTasks();
}

function scheduleNotification(task) {
  const now = new Date();
  const taskDate = new Date(task.date + "T09:00:00");

  const delay = taskDate.getTime() - now.getTime();

  if (delay > 0) {
    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("Lembrete de Tarefa", {
          body: task.text,
        });
      }
    }, delay);
  }
}

function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskInput = document.getElementById("taskInput");
  const taskDate = document.getElementById("taskDate");

  const task = {
    text: taskInput.value,
    date: taskDate.value,
    done: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  scheduleNotification(task);

  taskInput.value = "";
  taskDate.value = "";
});

// 🌙 MODO ESCURO
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", themeToggle.checked);
  localStorage.setItem("theme", themeToggle.checked ? "dark" : "light");
});

// 🎨 TROCA DE COR DE FUNDO
bgColorPicker.addEventListener("input", () => {
  document.body.style.backgroundColor = bgColorPicker.value;
  localStorage.setItem("bgColor", bgColorPicker.value);
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    tasks.forEach(scheduleNotification);
  }
}

// Carrega preferências
function loadPreferences() {
  const theme = localStorage.getItem("theme");
  const bgColor = localStorage.getItem("bgColor");

  if (theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.checked = true;
  }

  if (bgColor) {
    document.body.style.backgroundColor = bgColor;
    bgColorPicker.value = bgColor;
  }
}

window.addEventListener("load", () => {
  requestNotificationPermission();
  loadTasks();
  loadPreferences();
  renderTasks();
});
