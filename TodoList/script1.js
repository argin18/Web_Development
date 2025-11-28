const inp = document.querySelector("input");
const add = document.querySelector(".add");
const output = document.querySelector(".output");

// Load saved list or start empty
let list = JSON.parse(localStorage.getItem("tasks")) || [];

// Render List
const renderList=() =>{
  output.innerHTML = list
    .map(
      (item, index) => `
      <div class="task">
        <input type="checkbox" ${item.done ? "checked" : ""} onclick="toggleDone(${index})">

        <span class="task-text" style="text-decoration:${item.done ? "line-through" : "none"};">
          ${item.text}
        </span>

        <button onclick="editTask(${index})">Edit</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `
    )
    .join("");
}

// Display saved tasks on page load
renderList();

// Add Task
add.addEventListener("click", () => {
  const text = inp.value.trim();
  inp.value = "";

  if (text === "") {
    alert("Please enter some task..!");
    return;
  }

  list.push({ text, done: false });
  save();
  renderList();
});

// Delete Task
function deleteTask(i) {
  list.splice(i, 1);
  save();
  renderList();
}

// Toggle Done
function toggleDone(i) {
  list[i].done = !list[i].done;
  save();
  renderList();
}

// Edit Task Inline
function editTask(i) {
  const taskDiv = output.children[i];
  const span = taskDiv.querySelector(".task-text");

  // Create input for editing
  const input = document.createElement("input");
  input.type = "text";
  input.value = list[i].text;
  input.className = "edit-input";

  // Replace span with input
  span.replaceWith(input);
  input.focus();

  // Change Edit button to Save
  const editBtn = taskDiv.querySelector("button");
  editBtn.textContent = "Save";

  editBtn.onclick = () => {
    const newText = input.value.trim();
    if (newText !== "") {
      list[i].text = newText;
      save();
      renderList();
    }
  };
}

// Save to localStorage
function save() {
  localStorage.setItem("tasks", JSON.stringify(list));
}
