const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const empty = document.getElementById("empty");
const count = document.getElementById("count");
const clearBtn = document.getElementById("clear-btn");
const filterBtns = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, done: false });
  input.value = "";
  save();
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  task.done = !task.done;
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  save();
  render();
}

function render() {
  list.innerHTML = "";

  const visible = tasks.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done
  );

  visible.forEach((task) => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.done;
    check.addEventListener("change", () => toggleTask(task.id));

    const label = document.createElement("span");
    label.textContent = task.text;

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "Delete";
    del.addEventListener("click", () => deleteTask(task.id));

    li.append(check, label, del);
    list.appendChild(li);
  });

  const remaining = tasks.filter((t) => !t.done).length;
  count.textContent = `${remaining} task${remaining === 1 ? "" : "s"} left`;
  empty.hidden = visible.length > 0;
}

addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});
clearBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.done);
  save();
  render();
});
filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    filterBtns.forEach((b) => b.classList.toggle("active", b === btn));
    render();
  })
);

render();
