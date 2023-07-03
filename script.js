document.addEventListener("DOMContentLoaded", function() {
    var todoList = document.getElementById("todo-list");
    var inProgressList = document.getElementById("inprogress-list");
    var doneList = document.getElementById("done-list");
    var newTaskInput = document.getElementById("new-task-input");
    var prioritySelect = document.getElementById("priority-select");
    var addTaskBtn = document.getElementById("add-task-btn");
    var goalPlan = document.getElementById("goal-plan");
    var taskModal = document.getElementById("task-modal");
    var taskModalTitle = document.getElementById("task-modal-title");
    var taskModalDescription = document.getElementById("task-modal-description");
    var taskObservationInput = document.getElementById("task-observation");
    var saveObservationBtn = document.getElementById("save-observation-btn");
  
    var currentTask = null;
  
    // Verificar se há dados salvos e carregar as tarefas
    var savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      var tasks = JSON.parse(savedTasks);
      tasks.forEach(function(task) {
        createTaskElement(task);
      });
    }
  
    addTaskBtn.addEventListener("click", function() {
      var taskText = newTaskInput.value;
      var priority = prioritySelect.value;
  
      if (taskText !== "") {
        var task = {
          id: "task-" + Math.random().toString(36).substr(2, 9),
          text: taskText,
          priority: priority,
          status: "todo",
          observation: ""
        };
  
        createTaskElement(task);
        saveTasks();
  
        newTaskInput.value = "";
        prioritySelect.selectedIndex = 0;
      }
    });
  
    saveObservationBtn.addEventListener("click", function() {
      var observationText = taskObservationInput.value;
  
      currentTask.observation = observationText;
      saveTasks();
  
      var currentStatus = currentTask.status;
      switch (currentStatus) {
        case "todo":
          currentTask.status = "inprogress";
          currentTask.priority = prioritySelect.value; // Alterar a prioridade em "Em andamento"
          inProgressList.appendChild(currentTask.element);
          break;
        case "inprogress":
          currentTask.status = "done";
          doneList.appendChild(currentTask.element);
          break;
        default:
          break;
      }
  
      closeTaskModal();
    });
  
    function createTaskElement(task) {
      var listItem = document.createElement("li");
      listItem.classList.add("task");
      listItem.id = task.id;
      listItem.setAttribute("data-status", task.status);
      listItem.setAttribute("data-priority", task.priority);
  
      var taskTitle = document.createElement("span");
      taskTitle.textContent = task.text;
      listItem.appendChild(taskTitle);
  
      var observation = document.createElement("p");
      observation.classList.add("description");
      observation.textContent = "Observação: " + task.observation;
      listItem.appendChild(observation);
  
      var statusBtn = document.createElement("button");
      statusBtn.classList.add("status-btn");
      statusBtn.textContent = "Próximo";
      statusBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        moveToNextStatus(listItem);
      });
      listItem.appendChild(statusBtn);
  
      var finishBtn = document.createElement("button");
      finishBtn.classList.add("finish-btn");
      finishBtn.textContent = "Finalizar";
      finishBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        removeTask(listItem);
      });
      listItem.appendChild(finishBtn);
  
      switch (task.priority) {
        case "1":
          listItem.classList.add("low-priority");
          break;
        case "2":
          listItem.classList.add("medium-priority");
          break;
        case "3":
          listItem.classList.add("high-priority");
          break;
        default:
          break;
      }
  
      listItem.addEventListener("click", function() {
        currentTask = task;
        openTaskModal(task);
      });
  
      task.element = listItem;
  
      switch (task.status) {
        case "todo":
          todoList.appendChild(listItem);
          break;
        case "inprogress":
          inProgressList.appendChild(listItem);
          break;
        case "done":
          doneList.appendChild(listItem);
          break;
        default:
          break;
      }
    }
  
    function moveToNextStatus(listItem) {
      var currentStatus = listItem.getAttribute("data-status");
      var nextStatus = "";
  
      switch (currentStatus) {
        case "todo":
          nextStatus = "inprogress";
          listItem.setAttribute("data-status", nextStatus);
          listItem.classList.remove("low-priority", "medium-priority", "high-priority");
          listItem.setAttribute("data-priority", prioritySelect.value); // Atualizar a prioridade ao mover para "Em andamento"
          inProgressList.appendChild(listItem);
          break;
        case "inprogress":
          nextStatus = "done";
          listItem.setAttribute("data-status", nextStatus);
          listItem.classList.remove("low-priority", "medium-priority", "high-priority");
          doneList.appendChild(listItem);
          break;
        default:
          break;
      }
  
      saveTasks();
    }
  
    function removeTask(listItem) {
      listItem.parentNode.removeChild(listItem);
      saveTasks();
    }
  
    function saveTasks() {
      var tasks = Array.from(document.getElementsByClassName("task")).map(function(listItem) {
        return {
          id: listItem.id,
          text: listItem.firstChild.textContent,
          priority: listItem.getAttribute("data-priority"),
          status: listItem.getAttribute("data-status"),
          observation: listItem.getElementsByTagName("p")[0].textContent.replace("Observação: ", "")
        };
      });
  
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    function openTaskModal(task) {
      taskModalTitle.textContent = task.text;
      taskModalDescription.textContent = "Descrição: " + task.text;
      taskObservationInput.value = task.observation;
  
      taskModal.style.display = "block";
    }
  
    function closeTaskModal() {
      taskModal.style.display = "none";
    }
  });
  