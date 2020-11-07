import "./scss/index.scss";
import "autosize";
import autosize from "autosize";

autosize(document.querySelector("textarea"));

const tasks = [
  {
    _id: "5d2ca9e2e03d40b326596aa7",
    completed: true,
    body: "body-1",
    title: "task-1",
  },
  {
    _id: "5d2ca9e29c8a94095c1288e0",
    completed: false,
    body: "body-2",
    title: "task-2",
  },
  {
    _id: "5d2ca9e2e03d40b3232496aa7",
    completed: true,
    body: "body-3",
    title: "task-3",
  },
  {
    _id: "5d2ca9e29c8a94095564788e0",
    completed: false,
    body: "body-4",
    title: "task-4",
  },
];

(function (arrOfTasks = []) {
  const objTask = transformArrayTask(arrOfTasks);

  // UI
  const containerTask = document.querySelector(".js-container-tasks");
  const formTasks = document.forms["form-tasks"];
  const inputTitleTask = formTasks.elements["title-task"];
  const inputBodyTask = formTasks.elements["body-task"];
  const containerFilter = document.querySelector(".tabs__content");
  const btnShowNoCompleted = document.querySelector(".js-show-completed-task");
  let noCompletedTask = [];

  // Handlers
  formTasks.addEventListener("submit", formTaskSubminHandler);
  containerTask.addEventListener("click", onClickTaskHandler);
  containerTask.addEventListener("change", onChangeTaskHandler);
  containerFilter.addEventListener("click", onClickFilterHandler);

  // helpers
  let isShowNoCompleted = JSON.parse(
    btnShowNoCompleted.dataset.showNoCompleted
  ); // Режим просмотра незавершенных задач, по умолчанию false

  function validateInputs(items) {
    Object.values(arguments).forEach((item) => {
      if (item.value === "") {
        item.classList.add("error");
      }
    });
  }

  function clearContainer() {
    containerTask.innerHTML = "";
  }

  function transformArrayTask(array) {
    const objTask = array.reduce((acc, task) => {
      acc[task._id] = task;
      return acc;
    }, {});
    return objTask;
  }

  // app

  function renderAllTasks(taskList) {
    if (!taskList) {
      console.error("Вы не передали список задач");
    }

    const sortTasklist = Object.values(taskList).sort((next, prev) => {
      return next.completed - prev.completed;
    });

    const transformTaskList = transformArrayTask(sortTasklist);

    Object.values(transformTaskList).forEach((task) => {
      const taskItem = renderTaskTemplate(task);
      containerTask.insertAdjacentHTML("beforeend", taskItem);
    });
  }

  function renderTaskTemplate(task) {
    {
      return `
        <div class="card-task" data-task-id=${task._id}>
          <div class="card-task__content">
            <div class="card-task__top">
              <div class="card-task__title">${task.title}</div>
              <div class="card-task__btn">
                <button class="card-task__сomplete">
                  <label>
                    <input type="checkbox"${task.completed ? "checked" : ""}>
                    <i class="icon-complete js-task-сomplete"></i>
                  </label>
                </button>
                <button class="card-task__edit icon-edit js-task-red">
                </button>
                <button class="card-task__remove icon-delete js-task-remove">
                </button>
              </div>
            </div>
            <div class="card-task__body">${task.body}</div>
          </div>
        </div>
      `;
    }
  }

  function formTaskSubminHandler(event) {
    event.preventDefault();
    const mode = this.dataset.formMode;

    if (mode === "task-new") {
      const newTask = createNewTask(inputTitleTask, inputBodyTask);
      if (!newTask) {
        // ? Включить return;
      }
      const taskElement = renderTaskTemplate(newTask);
      containerTask.insertAdjacentHTML("afterbegin", taskElement);
    } else if (mode === "task-edit") {
      const id = this.dataset.editTaskId;
      const editTask = objTask[id];
      const editTaskForHtml = editTaskFunction(
        editTask,
        inputTitleTask.value,
        inputBodyTask.value
      );
      objTask[id] = editTaskForHtml;
      clearContainer();

      if (isShowNoCompleted) {
        noCompletedTask = Object.values(objTask).filter(
          (task) => !task.completed
        );
        renderAllTasks(noCompletedTask);
      } else {
        renderAllTasks(objTask);
      }

      this.dataset.formMode = "task-new";
    }

    formTasks.reset();
  }

  function editTaskFunction(task = {}, editTitle, editBody) {
    const editTask = {
      title: editTitle,
      body: editBody,
      completed: task.completed,
      _id: task._id,
    };
    return editTask;
  }

  function createNewTask(title, body) {
    if (!title.value || !body.value) {
      validateInputs(title, body);
      // ? Включить return;
    }

    let titleValue = title.value;
    let bodyValue = body.value;

    const newTask = {
      title: titleValue,
      body: bodyValue,
      completed: false,
      _id: `task-${Math.random()}`,
    };

    objTask[newTask._id] = newTask;

    return { ...newTask };
  }

  function onClickTaskHandler(event) {
    if (event.target.classList.contains("js-task-remove")) {
      const currentTask = event.target.closest("[data-task-id]");
      const id = currentTask.dataset.taskId;
      removeTaskById(id, objTask);
      removeTaskById(id, noCompletedTask);
      removeTaskFromHtml(currentTask);
    }
    if (event.target.classList.contains("js-task-red")) {
      const currentTask = event.target.closest("[data-task-id]");
      const id = currentTask.dataset.taskId;
      const currentTaskData = objTask[id];
      formTasks.dataset.formMode = "task-edit";
      formTasks.setAttribute("data-edit-task-id", id);
      inputTitleTask.value = currentTaskData.title;
      inputBodyTask.value = currentTaskData.body;
    }
  }

  function onChangeTaskHandler(event) {
    const currentTask = event.target.closest("[data-task-id]");
    const id = currentTask.dataset.taskId;
    if (event.target.checked) {
      objTask[id].completed = true;
      if (isShowNoCompleted) {
        noCompletedTask.forEach((item, i) => {
          if (item._id == id) {
            noCompletedTask.splice(i, 1);
          }
        });
        clearContainer();
        renderAllTasks(noCompletedTask);
      } else {
        clearContainer();
        renderAllTasks(objTask);
      }
    } else {
      objTask[id].completed = false;
      clearContainer();
      renderAllTasks(objTask);
    }
  }

  function removeTaskById(id, tasks) {
    Object.values(tasks).forEach((task) => {
      if (task._id === id) {
        delete tasks[id];
      }
    });
  }

  function removeTaskFromHtml(el) {
    el.classList.add('remove');
    setTimeout(() => el.remove(), 200);
  }

  function onClickFilterHandler(event) {
    if (event.target.classList.contains("js-show-all-task")) {
      isShowNoCompleted = false;
      clearContainer();
      renderAllTasks(objTask);

      containerTask.classList.add("animate");
      setTimeout(() => {
        containerTask.classList.remove("animate");
      }, 200);
    }
    if (event.target.classList.contains("js-show-completed-task")) {
      isShowNoCompleted = true;
      noCompletedTask = Object.values(objTask).filter(
        (task) => !task.completed
      );
      clearContainer();
      renderAllTasks(noCompletedTask);

      containerTask.classList.add("animate");
      setTimeout(() => {
        containerTask.classList.remove("animate");
      }, 200);
    }
  }

  renderAllTasks(objTask);
})(tasks);
