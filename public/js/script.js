const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');

// Function to add task to MongoDB and render it on the page
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        // Create a new task object
        const task = {
            name: taskText
        };

        // Send task to the server using fetch (POST request)
        fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        .then(response => {
            if (response.ok) {
                // If task was added successfully, reload the tasks
                loadTasks();
            } else {
                alert('Error adding task');
            }
        });

        taskInput.value = ''; // Clear the input field
    }
}

// Function to load tasks from the server and render them
function loadTasks() {
    fetch('/')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = ''; // Clear the current task list

            tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = task.name;

                // Create delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.style.backgroundColor = 'red';
                deleteButton.onclick = function() {
                    deleteTask(task._id, li);
                };

                // Create edit button
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.style.backgroundColor = 'green';
                editButton.style.color = 'white';

                // Edit button handler
                editButton.addEventListener('click', function(event) {
                    event.stopPropagation();
                    const input = document.createElement('input');
                    input.value = li.firstChild.textContent;

                    li.textContent = '';
                    li.appendChild(input);

                    // Create save button
                    const saveButton = document.createElement('button');
                    saveButton.textContent = 'Save';
                    saveButton.style.color = 'black';
                    saveButton.style.backgroundColor = 'rgba(0,0,0,0.1)';
                    li.appendChild(saveButton);

                    // Save changes
                    saveButton.addEventListener('click', function() {
                        saveTask(task._id, input.value, li, deleteButton, editButton);
                    });
                });

                // Append buttons
                li.appendChild(editButton);
                li.appendChild(deleteButton);

                // Add the task to the task list
                taskList.appendChild(li);
            });
        });
}

// Function to save edited task
function saveTask(taskId, newName, li, deleteButton, editButton) {
    const updatedTask = {
        name: newName
    };

    fetch(`/update/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
    })
    .then(response => {
        if (response.ok) {
            li.textContent = newName;
            li.appendChild(deleteButton);
            li.appendChild(editButton);
        } else {
            alert('Error saving task');
        }
    });
}

// Function to delete a task
function deleteTask(taskId, li) {
    fetch(`/delete/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            li.remove(); // Remove the task from the list
        } else {
            alert('Error deleting task');
        }
    });
}

// Add button handler
addTaskButton.addEventListener('click', addTask);

// Enter button handler
taskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Load tasks when the page loads
window.onload = loadTasks;
