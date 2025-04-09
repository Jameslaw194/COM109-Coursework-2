function getCookie(name) {
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	return match ? decodeURIComponent(match[2]) : null;
}

$(document).ready(() => {

	// Close modals when clicking outside of them
	$(window).on("click", function (event) {
		const addModal = $("#taskModal")[0];
		const editModal = $("#editTaskModal")[0];

		if (event.target === addModal) {
			$("#taskModal").addClass("hidden");
		}

		if (event.target === editModal) {
			$("#editTaskModal").addClass("hidden");
		}
	});

	console.log("UniTask Loaded!");

	const email = getCookie("email");
	if (!email || !localStorage.getItem(email)) {
		alert("You must be logged in to access your tasks.");
		window.location.href = "loginSignUp.html";
		return;
	}
	
	let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
	
	renderTasks();
	updateCountdowns();
	updateProgressBar();
	
	// Open Add Modal
	$("#openAddTask").click(() => $("#taskModal").removeClass("hidden"));

	// Close Modal
	$("#closeModal").click(() => $("#taskModal").addClass("hidden"));
	$("#closeEditModal").click(() => $("#editTaskModal").addClass("hidden"));
	
	// Add Task
	$("#addTaskBtn").click(() => {
		const taskTitle = $("#taskTitle").val().trim();
		const taskDescription = $("#taskDescription").val();
		const taskDeadline = $("#taskDeadline").val();
	
		if (!taskTitle || !taskDeadline) {
		alert("Please fill in all fields!");
		return;
		}
	
		const newTask = {
		id: Date.now(),
		title: taskTitle,
		deadline: new Date(taskDeadline).toISOString(),
		description: taskDescription,
		completed: false
		};
	
		tasks.push(newTask);
		saveTasks();
		renderTasks();
		updateCountdowns();
		updateProgressBar();
	
		$("#taskTitle, #taskDescription, #taskDeadline").val("");
		$("#taskModal").addClass("hidden");
	});
	
	// Save edited task
	$("#saveEditBtn").click(() => {
		const taskId = $("#editTaskId").val();
		const newTitle = $("#editTaskTitle").val().trim();
		const newDesc = $("#editTaskDescription").val();
		const newDeadline = $("#editTaskDeadline").val();
	
		if (!newTitle || !newDeadline) {
		alert("Please fill in all fields!");
		return;
		}
	
		if (confirm("Are you sure you want to update this task?")) {
		tasks = tasks.map(t =>
			t.id == taskId
			? { ...t, title: newTitle, description: newDesc, deadline: new Date(newDeadline).toISOString() }
			: t
		);
	
		saveTasks();
		renderTasks();
		updateCountdowns();
		updateProgressBar();
	
		$("#editTaskModal").addClass("hidden");
		}
	});
	
	function renderTasks() {
		const taskList = $(".task-list");
		taskList.empty();
	
		tasks.forEach(task => {
		const timeLeft = calculateTimeLeft(task.deadline);
		const taskItem = $(`
			<li class="task-item" data-id="${task.id}" data-deadline="${task.deadline}">
			<div class="task-info">
				<h3>Task: ${task.title}</h3>
				<p>Description: ${task.description}</p>
				<p>Due in <span class="countdown">${timeLeft}</span></p>
			</div>
			<div class="complete">
				<p>Task complete?</p>
				<input type="checkbox" class="done-checkbox" ${task.completed ? "checked" : ""}/>
			</div>
			<div class="task-actions">
				<button class="edit-btn">Edit</button>
				<button class="remove-btn">Delete</button>
			</div>
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
			if (confirm("Are you sure you want to delete this task?")) {
			tasks = tasks.filter(t => t.id !== id);
			saveTasks();
			renderTasks();
			updateProgressBar();
			}
		});
	
		taskItem.find(".edit-btn").click(function () {
			const id = Number($(this).closest(".task-item").data("id"));
			const task = tasks.find(t => t.id === id);
	
			$("#editTaskId").val(task.id);
			$("#editTaskTitle").val(task.title);
			$("#editTaskDescription").val(task.description);
			$("#editTaskDeadline").val(new Date(task.deadline).toISOString().slice(0, 16));
			$("#editTaskModal").removeClass("hidden");
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
	
		setTimeout(updateCountdowns, 1000);
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
	
	// Dark mode persistence
	if (localStorage.getItem("darkMode") === "true") {
		$("body").addClass("dark");
	}
});
	