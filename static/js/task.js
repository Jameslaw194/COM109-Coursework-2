$(document).ready(() => {
  console.log("UniTask Loaded!");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  renderTasks();
  updateCountdowns();
  updateProgressBar(); // Update progress on load

  // Open Modal
  $("#openAddTask").click(() => $("#taskModal").removeClass("hidden"));

  // Close Modal
  $("#closeModal").click(() => $("#taskModal").addClass("hidden"));

  // Add Task Functionality
  $("#addTaskBtn").click(() => {
      const taskTitle = $("#taskTitle").val().trim();
      const taskDeadline = $("#taskDeadline").val();

      if (!taskTitle || !taskDeadline) {
          alert("Please fill in all fields!");
          return;
      }

      const newTask = {
          id: Date.now(),
          title: taskTitle,
          deadline: new Date(taskDeadline).toISOString(), // Store in correct format
          completed: false
      };

      tasks.push(newTask);
      saveTasks();
      renderTasks();
      updateCountdowns();
      updateProgressBar();

      $("#taskTitle").val(""); // Clear input fields
      $("#taskDeadline").val("");
      $("#taskModal").addClass("hidden");
  });

  function renderTasks() {
      const taskList = $(".task-list");
      taskList.empty();

      tasks.forEach(task => {
          const timeLeft = calculateTimeLeft(task.deadline);
          const taskItem = $(`
              <li class="task-item" data-id="${task.id}" data-deadline="${task.deadline}">
                  <input type="checkbox" class="done-checkbox" ${task.completed ? "checked" : ""}/>
                  <div class="task-info">
                      <h3>${task.title}</h3>
                      <p>Due in <span class="countdown">${timeLeft}</span></p>
                  </div>
                  <button class="remove-btn">❌</button>
              </li>
          `);

          taskItem.find(".done-checkbox").change(function () {
              const id = Number($(this).closest(".task-item").data("id"));
              tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
              saveTasks();
              updateProgressBar();
          });

          taskItem.find(".remove-btn").click(function () {
              const id = Number($(this).closest(".task-item").data("id"));
              tasks = tasks.filter(t => t.id !== id);
              saveTasks();
              renderTasks();
              updateProgressBar();
          });

          taskList.append(taskItem);
      });
  }

  function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateCountdowns() {
      $(".task-item").each(function () {
          const deadline = $(this).attr("data-deadline");
          const countdownElement = $(this).find(".countdown");
          countdownElement.text(calculateTimeLeft(deadline));
      });

      setTimeout(updateCountdowns, 1000); // Update every second
  }

  function calculateTimeLeft(deadline) {
      if (!deadline) return "No deadline set";

      const now = new Date();
      const taskTime = new Date(deadline);
      const diffMs = taskTime - now;

      if (diffMs <= 0) return "Overdue";

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  function updateProgressBar() {
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.completed).length;
      const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      $(".progress-bar-fill").css("width", `${progressPercent}%`);
      $("#progress-percent").text(`${progressPercent}%`);
  }

  // Dark Mode Persistence
  if (localStorage.getItem("darkMode") === "true") {
      $("body").addClass("dark");
  }
});
