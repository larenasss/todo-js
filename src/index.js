import "./scss/index.scss";

const tasks = [
  {
    _id: "5d2ca9e2e03d40b326596aa7",
    completed: true,
    body:
      "Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
    title: "Eu ea incididunt sunt consectetur fugiat non.",
  },
  {
    _id: "5d2ca9e29c8a94095c1288e0",
    completed: false,
    body:
      "Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
    title: "Deserunt laborum id consectetur",
  },
  {
    _id: "5d2ca9e2e03d40b3232496aa7",
    completed: true,
    body:
      "Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
    title: "Eu ea incididunt sunt consectetur fugiat non.",
  },
  {
    _id: "5d2ca9e29c8a94095564788e0",
    completed: false,
    body:
      "illum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
    title:
      "Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum.",
  },
];

(function (arrOfTasks) {
  const objTask = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  // UI
  const containerTask = document.querySelector(".js-container-tasks");
  const formTasks = document.forms["form-tasks"];
  const inputTitleTask = formTasks.elements["title-task"];
  const inputBodyTask = formTasks.elements["body-task"];

  // Handlers
  formTasks.addEventListener("submit", formTaskSubminHandler);

  // app

  function renderAllTasks(taskList) {
    if (!taskList) {
      console.error("Вы не передали список задач");
    }

    Object.values(objTask).forEach((task) => {
      const taskItem = renderTaskTemplate(task);
      containerTask.insertAdjacentHTML("beforeend", taskItem);
    });
  }

  function renderTaskTemplate(task) {
    {
      return `
        <div class="card-task">
          <div class="card-task__content">
            <div class="card-task__top">
              <div class="card-task__title">${task.title}</div>
              <div class="card-task__btn">
                <button class="card-task__сomplete">
                  выполненно
                </button>
                <button class="card-task__remove">
                  удалить
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
    const newTask = createNewTask(inputTitleTask, inputBodyTask);
    if (!newTask) {
      // ? Включить return;
    }
    const taskElement = renderTaskTemplate(newTask);
    containerTask.insertAdjacentHTML("afterbegin", taskElement);
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

  function validateInputs(items) {
    Object.values(arguments).forEach((item) => {
      if (item.value === "") {
        item.classList.add("error");
      }
    });
  }

  renderAllTasks(objTask);
})(tasks);
