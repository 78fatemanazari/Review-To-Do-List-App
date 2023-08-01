let tasksLocal = [];

window.loadTasksToLocalStorage = () => {
  const text = JSON.stringify(tasksLocal);
  localStorage.setItem('tasks', text);
};

const displayTaskElement = (task) => {
  const taskItem = document.createElement('li');
  taskItem.classList.add('task-list');

  const taskIndex = document.createElement('span');
  taskIndex.classList.add('task-index');
  taskIndex.value = task.index;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('checked');
  checkbox.checked = task.completed;

  const taskText = document.createElement('input');
  taskText.classList.add('task-name');
  taskText.value = task.name;
  if (task.completed) {
    taskText.classList.add('completed-task');
  }

  const moreIcon = document.createElement('span');
  moreIcon.classList.add('three-dot');
  moreIcon.innerHTML = '⋮';

  const deleteIcon = document.createElement('span');
  deleteIcon.classList.add('trash-icon');
  deleteIcon.classList.add('hide-icon');
  deleteIcon.innerHTML = '&#128465;';

  taskItem.appendChild(taskIndex);
  taskItem.appendChild(checkbox);
  taskItem.appendChild(taskText);
  taskItem.appendChild(moreIcon);
  taskItem.appendChild(deleteIcon);

  return taskItem;
};

function createTaskElement(taskName, tasksLocal) {
// If tasksLocal is not already an array, initialize it as an empty array
  if (!Array.isArray(tasksLocal)) {
    tasksLocal = [];
  }

  const index = tasksLocal.length + 1;
  const complete = false;
  const taskString = { index, name: taskName, completed: complete };
  tasksLocal.push(taskString);
  localStorage.setItem('tasks', JSON.stringify(tasksLocal));
}

function arrangeIndexes(tasksLocal) {
  for (let i = 0; i < tasksLocal.length; i += 1) {
    tasksLocal[i].index = i + 1;
  }
}

function deleteTaskElement(tasksLocal, taskIndex) {
  tasksLocal = tasksLocal.filter((t) => t.index !== taskIndex);
  arrangeIndexes(tasksLocal); // Reassign correct indexes after deletion
  localStorage.setItem('tasks', JSON.stringify(tasksLocal));
  document.location.reload();
}

function updateTaskText(value, index, tasksLocal) {
// Check if the task index is valid
  if (index < 1 || index > tasksLocal.length) {
    console.error('Invalid task index.');
    return;
  }

  // Update the task text if the task exists
  tasksLocal[index - 1].name = value;
  localStorage.setItem('tasks', JSON.stringify(tasksLocal));
}

function updateTaskStatus(taskIndex, status, tasksLocal) {
  tasksLocal[taskIndex - 1].completed = status;
  localStorage.setItem('tasks', JSON.stringify(tasksLocal));
}

function clearCompletedTasks(tasksLocal) {
  tasksLocal = tasksLocal.filter((task) => !task.completed);

  // Reassign correct indexes after deletion
  tasksLocal.forEach((_task, index) => {
    _task.index = index + 1;
  });

  localStorage.setItem('tasks', JSON.stringify(tasksLocal));
  document.location.reload();
}

function activateDeleteListener(delBtn) {
  delBtn.addEventListener('click', () => {
    const parent = delBtn.parentNode;
    const taskIndex = Number(parent.getElementsByClassName('task-index')[0].value);
    deleteTaskElement(tasksLocal, taskIndex);
    arrangeIndexes(tasksLocal); // Reassign correct indexes after deletion
  });
}

function activateMoreListeners() {
  const moreBtn = document.querySelectorAll('.three-dot');
  moreBtn.forEach((morebutton) => {
    morebutton.addEventListener('click', (e) => {
      const clickedBtn = e.target;
      const parent = clickedBtn.parentNode;
      const delBtn = parent.getElementsByClassName('trash-icon')[0];
      if (delBtn.classList.contains('hide-icon')) {
        delBtn.classList.remove('hide-icon');
        activateDeleteListener(delBtn);
      } else {
        delBtn.classList.add('hide-icon');
      }
    });
  });
}

function activateCheckboxListeners() {
  const checkboxInput = document.querySelectorAll('.checked');
  checkboxInput.forEach((checkBoxInput) => {
    checkBoxInput.addEventListener('change', (e) => {
      const clickedCheck = e.target;
      const parent = clickedCheck.parentNode;
      const taskIndex = parent.getElementsByClassName('task-index')[0].value;
      updateTaskStatus(taskIndex, clickedCheck.checked, tasksLocal);
      const taskInput = parent.getElementsByClassName('task-name')[0];
      if (clickedCheck.checked) {
        taskInput.classList.add('completed-task');
      } else {
        taskInput.classList.remove('completed-task');
      }
    });
  });
}

function activateTaskInputListeners() {
  const taskInput = document.querySelectorAll('.task-name');
  taskInput.forEach((ti) => {
    const parent = ti.parentNode;
    const taskIndex = Number(parent.getElementsByClassName('task-index')[0].value);
    ti.addEventListener('change', () => {
      updateTaskText(ti.value, taskIndex, tasksLocal);
    });
  });
}

const displayTasks = () => {
  const taskList = document.getElementById('lists');
  if (tasksLocal.length > 0) {
    tasksLocal.forEach((task) => {
      const taskElement = displayTaskElement(task);
      taskList.appendChild(taskElement);
    });
    activateMoreListeners();
    activateCheckboxListeners();
    activateTaskInputListeners();
  }
};

document.getElementById('add-btn').addEventListener('click', () => {
  const taskInput = document.getElementById('task-input');
  const taskName = taskInput.value.trim();
  if (taskName !== '') {
    createTaskElement(taskName, tasksLocal);
    tasksLocal = JSON.parse(localStorage.getItem('tasks'));
    document.getElementById('lists').innerHTML = ''; // Clear the existing task list
    displayTasks(); // Redisplay the updated task list
    taskInput.value = '';
  }
});

document.getElementById('remove-btn').addEventListener('click', () => {
  clearCompletedTasks(tasksLocal);
});

const loadTasksFromLocalStorage = () => {
  tasksLocal = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
};

window.onload = () => {
  loadTasksFromLocalStorage();
  displayTasks();
};