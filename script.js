// Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-tasks");
// Event Listeners
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", CheckDeleteItem);
filterOption.addEventListener("click", filterTasks);
// Check if the webpage got loaded, if yes, load saved tasks from the local storage
document.addEventListener("DOMContentLoaded", getSavedTasks);
// Functions

function addTodo(event) {
  // Prevent form from submitting
  event.preventDefault();
  //  checking if todoInput empty
  if (todoInput.value.length != 0) {
    // Create Todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.setAttribute("draggable", "true");
    todoList.appendChild(todoDiv);
    // Create li
    const newTodoLI = document.createElement("li");
    // newTodoLI.innerHTML = todoInput.value;
    newTodoLI.classList.add("todo-item");
    todoDiv.appendChild(newTodoLI);
    // Create input with the input value
    const newLiContent = document.createElement("input");
    newLiContent.setAttribute("type", "text");
    newLiContent.classList.add("change-text");
    newLiContent.value = todoInput.value;
    newTodoLI.appendChild(newLiContent);
    // Save the task input to the local storage
    saveLocalTasks(todoInput.value);
    // Create Checkmark button
    const checkButton = document.createElement("button");
    checkButton.innerHTML = "<i class='fa-solid fa-check'></i>";
    checkButton.classList.add("check-btn");
    todoDiv.appendChild(checkButton);
    // Create Delete button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = "<i class='fa-solid fa-trash-can'></i>";
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    // Clear Todo input text
    todoInput.value = "";
    addDragListenerToNewTask();
  }
}

// Check if the input is empty, if true, don't let create the user the task.

function CheckDeleteItem(event) {
  event.preventDefault();
  const targetItem = event.target;
  // Get Parent of the clicked item to get the whole element
  const parentOfTarget = targetItem.parentElement;
  // Get the text of a task so we can pass it in to the removeLocalTasks function where we get its index, and remove it from a local storage.
  const inputText = parentOfTarget.firstChild.firstChild.value;
  // Delete todoItem once the delete button is clicked
  if (targetItem.classList.contains("trash-btn")) {
    parentOfTarget.classList.add("removed");
    removeLocalTasks(inputText);
    setTimeout(function () {
      const todoOpacity = window
        .getComputedStyle(parentOfTarget)
        .getPropertyValue("opacity");
      // Make sure 0 is rounded everytime we check a task
      if (Math.floor(todoOpacity) == 0) {
        parentOfTarget.remove();
        addDragListenerToNewTask();
      }
    }, 2000);
  }
  // strikethrough a task when the check button is clicked
  if (targetItem.classList.contains("check-btn")) {
    console.log(parentOfTarget);
    parentOfTarget.classList.add("completed");
    const strikeThrough = document.createElement("div");
    strikeThrough.classList.add("strike-through");
    parentOfTarget.prepend(strikeThrough);
    targetItem.classList.add("disabled");
    // Disable editing by converting input to li element
    const inputText = targetItem.previousSibling.firstChild.value;
    // remove the input element
    targetItem.previousSibling.firstChild.remove();
    // add the content to the previous sibling which is 'li'
    targetItem.previousSibling.innerHTML = inputText;
  }
}

function updateNumberOfDraggedItems() {
  return document.querySelectorAll(".todo");
}

function addDragListenerToNewTask() {
  numOfTasks = updateNumberOfDraggedItems();
  // console.log(numOfTasks);
  // Add listeners to new dragged items.
  for (let i = 0; i < numOfTasks.length; i++) {
    numOfTasks[i].addEventListener("dragstart", function (event) {
      event.preventDefault;
      console.log("I am dragged!");
      // Add dragging class
      numOfTasks[i].classList.add("dragging");
    });
    numOfTasks[i].addEventListener("dragend", function (event) {
      event.preventDefault;
      // remove dragging class
      numOfTasks[i].classList.remove("dragging");
    });
  }
  // Add event listener to tasklist container
  todoList.addEventListener("dragover", function (event) {
    event.preventDefault;
    console.log("dragover");
    const afterElement = getDragAfterElement(todoList, event.clientY);
    console.log(afterElement);
    // Get the element that is being dragged and create an object
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      todoList.appendChild(draggable);
    } else {
      todoList.insertBefore(draggable, afterElement);
    }
  });
}

function getDragAfterElement(container, y) {
  // Get number of elements that are not dragged
  const draggableElements = [
    ...container.querySelectorAll(".todo:not(.dragging"),
  ];

  return draggableElements.reduce(
    function (closest, child) {
      const box = child.getBoundingClientRect();
      console.log(box);
      const offset = y - box.top - box.height / 2;
      console.log(offset);
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Filter tasks using the drop-down list
function filterTasks(event) {
  tasks = updateNumberOfDraggedItems();
  for (let i = 0; i < tasks.length; i++) {
    switch (event.target.value) {
      case "all":
        tasks[i].style.display = "flex";
        break;
      case "completed":
        if (tasks[i].classList.contains("completed")) {
          tasks[i].style.display = "flex";
        } else {
          tasks[i].style.display = "none";
        }
        break;
      case "uncompleted":
        if (!tasks[i].classList.contains("completed")) {
          tasks[i].style.display = "flex";
        } else {
          tasks[i].style.display = "none";
        }
        break;
    }
  }
}

function saveLocalTasks(task) {
  let tasks = checkForSavedTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getSavedTasks() {
  let tasks = checkForSavedTasks();
  for (let i = 0; i < tasks.length; i++) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.setAttribute("draggable", "true");
    todoList.appendChild(todoDiv);
    // Create li
    const newTodoLI = document.createElement("li");
    newTodoLI.classList.add("todo-item");
    todoDiv.appendChild(newTodoLI);
    // Create input with the input value
    const newLiContent = document.createElement("input");
    newLiContent.setAttribute("type", "text");
    newLiContent.classList.add("change-text");
    newLiContent.value = tasks[i];
    newTodoLI.appendChild(newLiContent);
    // Create Checkmark button
    const checkButton = document.createElement("button");
    checkButton.innerHTML = "<i class='fa-solid fa-check'></i>";
    checkButton.classList.add("check-btn");
    todoDiv.appendChild(checkButton);
    // Create Delete button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = "<i class='fa-solid fa-trash-can'></i>";
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    addDragListenerToNewTask();
  }
}

function removeLocalTasks(text) {
  let tasks = checkForSavedTasks();
  let indexOfValueToDelete = tasks.indexOf(text);
  // We want to remove a task that has a specific index.
  tasks.splice(indexOfValueToDelete, 1);
  console.log(tasks);
  // Overwrite the existing 'tasks' key on our local sotrage after we removed a task.
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Check if the task is already on local storage
function checkForSavedTasks() {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    console.log(tasks);
  }
  return tasks;
}
