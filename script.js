const STORAGE_KEY = "taskflow-tasks";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const filterButtons = document.querySelectorAll(".filter-button");
const clearCompletedButton = document.querySelector("#clear-completed");
const editDialog = document.querySelector("#edit-dialog");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");

let tasks = loadTasks();
let currentFilter = "all";
let editingTaskId = null;

// Read saved tasks from localStorage.
function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch (error) {
    return [];
  }
}

// Save the current task list in localStorage.
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Create a unique ID for each task.
function createTaskId() {
  return Date.now().toString() + Math.random().toString(16).slice(2);
}

// Add a new task (Create).
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = taskInput.value.trim();

  if (title === "") return;

  tasks.unshift({
    id: createTaskId(),
    title: title,
    completed: false
  });

  saveTasks();
  renderTasks();
  taskForm.reset();
  taskInput.focus();
});

// Return tasks based on the selected filter.
function getFilteredTasks() {
  if (currentFilter === "active") {
    return tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}

// Display tasks (Read) and update the summary.
function renderTasks() {
  taskList.innerHTML = "";
  const visibleTasks = getFilteredTasks();

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item ${task.completed ? "completed" : ""}`;
    item.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.title} as ${task.completed ? "active" : "completed"}`);

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.title;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "action-button";
    editButton.dataset.action = "edit";
    editButton.textContent = "✎";
    editButton.setAttribute("aria-label", `Edit ${task.title}`);
    editButton.title = "Edit task";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "action-button delete";
    deleteButton.dataset.action = "delete";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
    deleteButton.title = "Delete task";

    actions.append(editButton, deleteButton);
    item.append(checkbox, text, actions);
    taskList.appendChild(item);
  });

  emptyState.classList.toggle("hidden", visibleTasks.length > 0);
  document.querySelector("#visible-count").textContent =
    `${visibleTasks.length} ${visibleTasks.length === 1 ? "task" : "tasks"}`;

  document.querySelector("#total-count").textContent = tasks.length;
  document.querySelector("#active-count").textContent =
    tasks.filter((task) => !task.completed).length;
  document.querySelector("#completed-count").textContent =
    tasks.filter((task) => task.completed).length;
}

// Event delegation: handle checkbox, edit and delete actions.
taskList.addEventListener("click", (event) => {
  const item = event.target.closest(".task-item");
  if (!item) return;

  const taskId = item.dataset.id;
  const actionButton = event.target.closest("button[data-action]");

  if (!actionButton) return;

  if (actionButton.dataset.action === "edit") {
    openEditDialog(taskId);
  }

  if (actionButton.dataset.action === "delete") {
    deleteTask(taskId);
  }
});

// Update completion status.
taskList.addEventListener("change", (event) => {
  if (!event.target.matches(".task-check")) return;

  const item = event.target.closest(".task-item");
  const task = tasks.find((task) => task.id === item.dataset.id);

  if (task) {
    task.completed = event.target.checked;
    saveTasks();
    renderTasks();
  }
});

// Update a task (Update).
function openEditDialog(taskId) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  editingTaskId = taskId;
  editInput.value = task.title;
  editDialog.showModal();
  editInput.focus();
}

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newTitle = editInput.value.trim();

  if (newTitle === "" || !editingTaskId) return;

  const task = tasks.find((item) => item.id === editingTaskId);
  if (task) {
    task.title = newTitle;
    saveTasks();
    renderTasks();
  }

  editDialog.close();
  editingTaskId = null;
});

document.querySelector("#cancel-edit").addEventListener("click", () => {
  editDialog.close();
  editingTaskId = null;
});

// Delete a task (Delete).
function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

// Change between All, Active and Completed filters.
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const selected = filterButton === button;
      filterButton.classList.toggle("selected", selected);
      filterButton.setAttribute("aria-pressed", String(selected));
    });

    renderTasks();
  });
});

// Remove every completed task.
clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

// Show today's date.
document.querySelector("#today-date").textContent =
  new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

// Initial display: load saved data and render it.
renderTasks();
