// Dark mode toggle
$('#darkToggle').click(() => {
  $('body').toggleClass('dark');
  localStorage.setItem('UniTask_darkMode', $('body').hasClass('dark') ? 'true' : 'false');
});
if (localStorage.getItem('UniTask_darkMode') === 'true') $('body').addClass('dark');

// Modal open/close
$('#openAddTask').click(() => $('#taskModal').removeClass('hidden'));
$('#closeModal').click(() => $('#taskModal').addClass('hidden'));

// Load tasks from LocalStorage
let tasks = JSON.parse(localStorage.getItem('UniTask_tasks')) || [];
renderTasks();

// Add new task
$('#addTaskBtn').click(() => {
  const title = $('#taskTitle').val().trim();
  const deadline = $('#taskDeadline').val();
  if (!title || !deadline) return alert('Please enter both task title and deadline.');

  const newTask = {
    id: Date.now(),
    title,
    deadline,
    done: false
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  $('#taskModal').addClass('hidden');
  $('#taskTitle').val('');
  $('#taskDeadline').val('');
});

// Save tasks to LocalStorage
function saveTasks() {
  localStorage.setItem('UniTask_tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  $('.task-list').html('');
  tasks.forEach(task => {
    const taskEl = $(`
      <li class="task-item" data-id="${task.id}" data-deadline="${task.deadline}">
        <input type="checkbox" class="done-checkbox" ${task.done ? 'checked' : ''} />
        <div class="task-info">
          <h3>${task.title}</h3>
          <p>Due in <span class="countdown">loading...</span></p>
        </div>
        <button class="remove-btn">❌</button>
      </li>
    `);
    $('.task-list').append(taskEl);
  });

  bindEvents();
  updateCountdowns();
  updateProgress();
}

// Event bindings
function bindEvents() {
  $('.remove-btn').off().on('click', function () {
    const id = $(this).closest('.task-item').data('id');
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks(); // Re-render after removing
  });

  $('.done-checkbox').off().on('change', function () {
    const id = $(this).closest('.task-item').data('id');
    const task = tasks.find(t => t.id === id);
    if (task) task.done = this.checked;
    saveTasks();
    updateProgress();
  });

  // Make sure modals still open/close
  $('#openAddTask').off().on('click', () => $('#taskModal').removeClass('hidden'));
  $('#closeModal').off().on('click', () => $('#taskModal').addClass('hidden'));

  // Ensure "Add Task" button still works
  $('#addTaskBtn').off().on('click', () => {
    const title = $('#taskTitle').val().trim();
    const deadline = $('#taskDeadline').val();
    if (!title || !deadline) return alert('Please enter both task title and deadline.');

    const newTask = {
      id: Date.now(),
      title,
      deadline,
      done: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks(); // Re-render tasks to update UI
    $('#taskModal').addClass('hidden');
    $('#taskTitle').val('');
    $('#taskDeadline').val('');
  });
}

// Countdown updates
function updateCountdowns() {
  $('.task-item').each(function () {
    const deadline = new Date($(this).data('deadline'));
    const now = new Date();
    const diff = deadline - now;

    if (diff <= 0) {
      $(this).find('.countdown').text('Expired');
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    $(this).find('.countdown').text(`${d}d ${h}h ${m}m ${s}s`);
  });
}
setInterval(updateCountdowns, 1000);

// Update progress bar
function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  $('.progress-bar-fill').css('width', percent + '%');
  $('#progress-percent').text(percent + '%');
}

