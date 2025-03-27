$(document).ready(function () {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
      let $taskList = $(".task-list");
      $taskList.empty(); // Clear existing tasks to prevent duplication

      if (tasks.length === 0) {
          $taskList.append("<li>No tasks yet! Add one above. ✅</li>");
      }

      tasks.forEach((task, index) => {
          let deadline = new Date(task.deadline).getTime();
          let timeRemaining = calculateTimeRemaining(deadline);
          let checked = task.completed ? "checked" : "";

          let taskHTML = `
              <li class="task-card" data-index="${index}">
                  <input type="checkbox" class="done-checkbox" ${checked} />
                  <div class="task-info">
                      <h3>${task.title}</h3>
                      <p>Due in <span class="countdown">${timeRemaining}</span></p>
                  </div>
                  <button class="remove-btn">❌</button>
              </li>
          `;

          $taskList.append(taskHTML);
      });

      updateProgress();
  }

  function calculateTimeRemaining(deadline) {
      let now = new Date().getTime();
      let difference = deadline - now;

      if (difference <= 0) return "Expired ⏳";
      
      let hours = Math.floor(difference / (1000 * 60 * 60));
      let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      return `${hours}h ${minutes}m`;
  }

  function updateCountdowns() {
      $(".task-card").each(function () {
          let index = $(this).attr("data-index");
          let deadline = new Date(tasks[index].deadline).getTime();
          $(this).find(".countdown").text(calculateTimeRemaining(deadline));
      });
  }

  function updateProgress() {
      let completedTasks = tasks.filter(task => task.completed).length;
      let totalTasks = tasks.length;
      let progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

      $("#progress-fill").css("width", progress + "%");
      $("#progress-percent").text(progress + "%");
  }

  // Modal Controls
  $("#openAddTask").click(() => $("#taskModal").removeClass("hidden"));
  $("#closeModal").click(() => $("#taskModal").addClass("hidden"));

  // Add Task
  $("#addTaskBtn").click(() => {
      let title = $("#taskTitle").val().trim();
      let deadline = $("#taskDeadline").val();

      if (title === "" || !deadline) {
          alert("Please enter a valid task and deadline!");
          return;
      }

      tasks.push({ title, deadline, completed: false });
      saveTasks();
      renderTasks();
      $("#taskTitle, #taskDeadline").val(""); // Clear input fields
      $("#taskModal").addClass("hidden"); // Close modal
  });

  // Task Completion
  $(document).on("change", ".done-checkbox", function () {
      let index = $(this).closest(".task-card").attr("data-index");
      tasks[index].completed = $(this).prop("checked");
      saveTasks();
      updateProgress();
  });

  // Remove Task
  $(document).on("click", ".remove-btn", function () {
      let index = $(this).closest(".task-card").attr("data-index");
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
  });

  // Initial Load
  renderTasks();
  setInterval(updateCountdowns, 60000); // Update countdown every 60s
});
