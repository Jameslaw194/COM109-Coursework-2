// Modal open/close
$('#openAddTask').click(() => $('#taskModal').removeClass('hidden'));
$('#closeModal').click(() => $('#taskModal').addClass('hidden'));

// Load from LocalStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
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

// Save to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
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
    renderTasks();
  });

  $('.done-checkbox').off().on('change', function () {
    const id = $(this).closest('.task-item').data('id');
    const task = tasks.find(t => t.id === id);
    if (task) task.done = this.checked;
    saveTasks();
    updateProgress();
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

// Progress bar
function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  $('.progress-bar-fill').css('width', percent + '%');
  $('#progress-percent').text(percent + '%');
}