"use strict";

const addBtn = document.querySelectorAll(".btn");
const taskContainers = document.querySelectorAll(".tasks__container");

const Render = function (task, disabled = true) {
  const markup = `
  <li data-id = "${task.id}" class="${
    task.state
  }-el to__do-el" draggable="true">
   <form action="" id="form">
     <input
         value="${task.title}"
         placeholder="Your thoughts"
         type="text"
         class= "${task.state}-input"
         ${disabled ? "disabled" : ""}
        />
     <div class="el__tools">
        <i
         class="fa fa-pencil edit__btn el__tool"
         id = "os"
         aria-hidden="true"
       ></i>
       <i
         class="fa fa-trash remove__btn el__tool"
         aria-hidden="true"
       ></i>
      </div>
    </form>
  </li>
  `;

  taskContainers.forEach((container) => {
    container.classList.contains(`${task.state}-elements`) &&
      container.insertAdjacentHTML("afterbegin", markup);
  });
};

const generateMarkupAndRender = function (target, disabled = false) {
  const markup = `
  <li class="${target.dataset.section}-el to__do-el" draggable="true">
   <form action="" id="form">
     <input
         value=""
         placeholder="your thoughts"
         type="text"
         class= "${target.dataset.section}-input"
         ${disabled ? "disabled" : ""}
         data-id = "${Date.now()}"
        />
     <div class="el__tools">
        <i
         class="fa fa-pencil edit__btn el__tool"
         aria-hidden="true"
       ></i>
       <i
         class="fa fa-trash remove__btn el__tool"
         aria-hidden="true"
       ></i>
      </div>
    </form>
  </li>
  `;

  taskContainers.forEach((container) => {
    container.classList.contains(`${target.dataset.section}-elements`) &&
      container.insertAdjacentHTML("afterbegin", markup);
  });
};

let arrOfTasks = [];

if (localStorage.getItem("tasks")) {
  arrOfTasks = JSON.parse(localStorage.getItem("tasks"));
}

getDataFromLocalStorage();

addBtn.forEach((btn) =>
  btn.addEventListener("click", function (e) {
    const target = e.target.closest(".btn");

    generateMarkupAndRender(target);

    const insertedInput = document.querySelector(
      `.${target.parentElement.firstElementChild.firstElementChild.firstElementChild.classList[0]}`
    );

    insertedInput.focus();

    insertedInput.nextElementSibling.firstElementChild.addEventListener(
      "click",
      (e) => {
        if (e.target.classList.contains("edit__btn")) {
          insertedInput.removeAttribute("disabled");
          insertedInput.focus();
        }
      }
    );

    insertedInput.nextElementSibling.firstElementChild.nextElementSibling.addEventListener(
      "click",
      (e) => {
        if (e.target.classList.contains("remove__btn")) {
          const confirmDelete = confirm(
            `Are you sure you want to delete ${insertedInput.value}?`
          );

          if (confirmDelete) {
            insertedInput.parentElement.remove();
            deleteTaskWith(insertedInput.dataset.id);
          }
        }
      }
    );

    insertedInput.parentElement.addEventListener("submit", (e) => {
      e.preventDefault();
      arrOfTasks.forEach((task) =>
        task.id === insertedInput.dataset.id &&
        task.title !== insertedInput.value
          ? [deleteTaskWith(task.id), addDataToLocalStorageFrom(arrOfTasks)]
          : ""
      );
      insertedInput.value !== ""
        ? [
            insertedInput.setAttribute("disabled", ""),
            addElementToArray(insertedInput, target),
          ]
        : alert("Please Fill Out Your Task . . .");
    });

    const dragStart1 = (e) => {
      e.target.classList.add("hold");
      draggedItem = e.target;
      e.dataTransfer.setData(
        "text/plain",
        draggedItem.firstElementChild.firstElementChild.dataset.id
      );
      e.dataTransfer.effectAlowed = "move";
      setTimeout(() => (e.target.classList = "invisible"), 0);
    };

    const toDoItems = document.querySelectorAll(".to__do-el");
    toDoItems.forEach((item) => {
      item.addEventListener("dragstart", dragStart1);
      item.addEventListener("dragend", dragEnd);
    });

    taskContainers.forEach((container) => {
      container.addEventListener("dragover", dragOver);
      container.addEventListener("dragenter", dragEnter);
      container.addEventListener("dragleave", dragLeave);
      container.addEventListener("drop", dragDrop);
    });
  })
);

function addElementToArray(taskTEXT, target) {
  const task = {
    element: taskTEXT,
    id: taskTEXT.dataset.id,
    title: taskTEXT.value,
    state: target.dataset.section,
  };

  arrOfTasks.push(task);

  addDataToLocalStorageFrom(arrOfTasks);
}

const addDataToLocalStorageFrom = (arrayOfTasks) =>
  window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));

const removeBtn = document.querySelectorAll(".remove__btn");
const editBtn = document.querySelectorAll(".edit__btn");
const forms = document.querySelectorAll("form");

function getDataFromLocalStorage() {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks && tasks.forEach((task) => Render(task));
}

editBtn.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit__btn")) {
      const clickedElInput = e.target.parentElement.previousElementSibling;
      clickedElInput.removeAttribute("disabled");
      clickedElInput.focus();
    }
  })
);

removeBtn.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    const clickedElInput = e.target.parentElement.previousElementSibling;
    if (e.target.classList.contains("remove__btn")) {
      const confirmDelete = confirm(
        `Are you sure you want to delete ${clickedElInput.value}?`
      );

      if (confirmDelete) {
        deleteTaskWith(
          e.target.parentElement.parentElement.parentElement.dataset.id
        );
        clickedElInput.parentElement.remove();
      }
    }
  })
);

forms.forEach((form) =>
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const clickedElInput = e.target.firstElementChild;

    arrOfTasks.forEach((task) =>
      task.id === clickedElInput.closest("li").dataset.id &&
      task.title !== clickedElInput.value
        ? [
            (task.title = clickedElInput.value),
            addDataToLocalStorageFrom(arrOfTasks),
          ]
        : ""
    );

    clickedElInput.value !== ""
      ? [
          clickedElInput.setAttribute("disabled", ""),
          addElementToArray(clickedElInput, e.target),
        ]
      : alert("Please Fill Out Your Task . . .");
  })
);

const deleteTaskWith = (taskId) => {
  arrOfTasks = arrOfTasks.filter((task) => task.id != taskId);
  addDataToLocalStorageFrom(arrOfTasks);
};

let draggedItem = null;

const dragStart = (e) => {
  e.target.classList.add("hold");
  draggedItem = e.target;
  e.dataTransfer.setData("text/plain", draggedItem.dataset.id);
  e.dataTransfer.effectAlowed = "move";
  setTimeout(() => (e.target.classList = "invisible"), 0);
};

const dragEnd = (e) => {
  draggedItem = null;
  e.target.classList = "to__do-el";
};

const dragOver = (e) => {
  if (e.dataTransfer.types[0] === "text/plain") {
    e.preventDefault();
  }
};
const dragEnter = (e) => {
  if (e.dataTransfer.types[0] === "text/plain") {
    e.preventDefault();
    e.target.closest("ul").classList.add("droppable");
  }
};
const dragLeave = (e) => {
  if (!e.relatedTarget.closest("ul"))
    e.target.closest("ul").classList.remove("droppable");
};

const dragDrop = (e) => {
  const droppedItemId = e.dataTransfer.getData("text/plain");
  const targetContainer = e.target.closest("ul");

  const containerTasks = Array.from(targetContainer.children);
  containerTasks.pop();
  if (containerTasks.find((task) => task.dataset.id === droppedItemId)) return;
  e.preventDefault();
  targetContainer.classList.remove("droppable");
  targetContainer.prepend(draggedItem);
  const droppedItem = targetContainer.firstElementChild;
  const itemType = targetContainer.classList[0].substring(
    0,
    targetContainer.classList[0].length - 9
  );
  droppedItem.classList.add(`${itemType}-el`);
  droppedItem.firstElementChild.firstElementChild.classList = `${itemType}-input`;
  arrOfTasks.forEach(
    (task) =>
      task.id === droppedItemId && [
        (task.state = itemType),
        addDataToLocalStorageFrom(arrOfTasks),
      ]
  );
};

const toDoItems = document.querySelectorAll(".to__do-el");
toDoItems.forEach((item) => {
  item.addEventListener("dragstart", dragStart);
  item.addEventListener("dragend", dragEnd);
});

taskContainers.forEach((container) => {
  container.addEventListener("dragover", dragOver);
  container.addEventListener("dragenter", dragEnter);
  container.addEventListener("dragleave", dragLeave);
  container.addEventListener("drop", dragDrop);
});
