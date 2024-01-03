
document.addEventListener('DOMContentLoaded', function() {
  const baseURL = 'http://localhost:3000'; // Update with your server URL

  function fetchData() {
      return fetch(`${baseURL}/tasks`)
          .then(response => response.json())
          .catch(error => console.error('Error fetching data:', error));
  }

  function renderTasks(tasks) {
      const tableBody = document.getElementById('todoList');
      tableBody.innerHTML = ''; // Clear existing tasks

      tasks.forEach(task => {
          const newRow = document.createElement('tr');

          const taskCell = document.createElement('td');
          taskCell.textContent = task.task;
          newRow.appendChild(taskCell);

          const doneCell = document.createElement('td');
          const checkDiv = document.createElement('div');
          checkDiv.classList.add('checkmark');
          const doneCheckbox = document.createElement('input');
          doneCheckbox.setAttribute('type', 'checkbox');
          doneCheckbox.checked = task.done;
          doneCheckbox.setAttribute('id', task.id);
          const label = document.createElement('label');
          label.setAttribute('for', task.id);
          label.textContent = task.done ? 'Done' : 'To-do';

          checkDiv.appendChild(doneCheckbox);
          checkDiv.appendChild(label);
          doneCell.appendChild(checkDiv);

          newRow.appendChild(doneCell);

          const removeCell = document.createElement('td');
          const removeButton = document.createElement('button');
          removeButton.textContent = 'Delete';
          removeButton.classList.add('removeBtn');
          removeButton.addEventListener('click', () => deleteTask(task.id));
          removeCell.appendChild(removeButton);
          newRow.appendChild(removeCell);

          tableBody.appendChild(newRow);
      });
  }

  function deleteTask(taskId) {
      fetch(`${baseURL}/tasks/${taskId}`, { method: 'DELETE' })
          .then(() => fetchData())
          .then(renderTasks)
          .catch(error => console.error('Error deleting task:', error));
  }

  function updateTask(taskId, taskData) {
      fetch(`${baseURL}/tasks/${taskId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
      })
          .then(() => fetchData())
          .then(renderTasks)
          .catch(error => console.error('Error updating task:', error));
  }

  function addTask(task) {
      fetch(`${baseURL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task)
      })
          .then(() => fetchData())
          .then(renderTasks)
          .catch(error => console.error('Error adding task:', error));
  }

  // Load tasks on page load
  fetchData().then(renderTasks);

  // Event listener for adding new tasks
  document.getElementById('addItemBtn').addEventListener('click', function() {
      // Get the task input value
      var taskInput = document.getElementById('taskInput');
      var task = taskInput.value.trim();

      if (task !== '') {
          // Create table row and cells for new task
          var tableBody = document.getElementById('todoList');
          var newRow = document.createElement('tr');

          var taskCell = document.createElement('td');
          taskCell.textContent = task;
          newRow.appendChild(taskCell);

          var doneCell = document.createElement('td');
          // Create checkbox and label for 'done' status
          var checkDiv = document.createElement('div');
          checkDiv.classList.add('checkmark');
          var doneCheckbox = document.createElement('input');
          doneCheckbox.setAttribute('type', 'checkbox');
          doneCheckbox.setAttribute('id', task.replace(/\s+/g, '-'));
          var label = document.createElement('label');
          label.setAttribute('for', task.replace(/\s+/g, '-'));
          label.textContent = 'To-do';

          checkDiv.appendChild(doneCheckbox);
          checkDiv.appendChild(label);
          doneCell.appendChild(checkDiv);

          newRow.appendChild(doneCell);

          // Create 'Delete' button and its functionality
          var removeCell = document.createElement('td');
          var removeButton = document.createElement('button');
          removeButton.textContent = 'Delete';
          removeButton.classList.add('removeBtn');
          removeButton.addEventListener('click', function() {
              var rowToRemove = this.parentNode.parentNode;
              tableBody.removeChild(rowToRemove);
          });
          removeCell.appendChild(removeButton);
          newRow.appendChild(removeCell);

          tableBody.appendChild(newRow);

          // Clear the input field after adding the task
          taskInput.value = '';
      } else {
          alert('Please enter a task.');
      }
  });

  // Event listener for toggling between editing tasks and applying changes
  document.getElementById('editToggleBtn').addEventListener('click', function() {
      var tableRows = document.querySelectorAll('#todoList tr');

      // Logic for switching between edit mode and display mode
      tableRows.forEach(function(row) {
          var cells = row.querySelectorAll('td:first-child');

          cells.forEach(function(cell) {
              var text = cell.textContent.trim();
              if (text !== '') {
                  // If editing, switch to input field; otherwise, display text
                  if (cell.querySelector('input[type=text]')) {
                      var input = cell.querySelector('input[type=text]');
                      cell.textContent = input.value;
                  } else {
                      var input = document.createElement('input');
                      input.type = 'text';
                      input.value = text;
                      cell.textContent = '';
                      cell.appendChild(input);
                  }
              }
          });
      });

      // Change button text based on the current action
      var buttonText = this.textContent;
      if (buttonText === 'Edit Tasks') {
          this.textContent = 'Apply Changes';
      } else {
          // Apply changes made in the input fields
          tableRows.forEach(function(row) {
              var cells = row.querySelectorAll('td:first-child');
              cells.forEach(function(cell) {
                  if (cell.querySelector('input[type=text]')) {
                      var input = cell.querySelector('input[type=text]');
                      cell.textContent = input.value;
                  }
              });
          });
          this.textContent = 'Edit Tasks';
      }
  });

  // Event listener for filtering tasks based on completion status
  document.getElementById('filterDropdown').addEventListener('change', function() {
      var selectedOption = this.value;
      var tableRows = document.querySelectorAll('#todoList tr');

      // Filter tasks based on the selected dropdown option
      tableRows.forEach(function(row) {
          var doneCheckbox = row.querySelector('input[type="checkbox"]');
          if (selectedOption === 'undone' && doneCheckbox && !doneCheckbox.checked) {
              row.style.display = 'table-row'; // Display undone tasks
          } else if (selectedOption === 'done' && doneCheckbox && doneCheckbox.checked) {
              row.style.display = 'table-row'; // Display done tasks
          } else if (selectedOption === 'all') {
              row.style.display = 'table-row'; // Display all tasks
          } else {
              row.style.display = 'none'; // Hide other tasks
          }
      });
  });
});