
// Initialize the "Add Task" form
function initAddTask() {
    getDateToday();
    initializeDropdown();
    initializeCategorySelector();
    initializeTaskForm();
    hideInputSubTaksClickContainerOnOutsideClick();
    loadContacts();
}

// Set priority for the task
function setPrio(prio) {
    document.querySelectorAll('.prioBtnUrgent, .prioBtnMedium, .prioBtnLow').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.prioBtn${prio.charAt(0).toUpperCase() + prio.slice(1)}`).classList.add('active');
}

// Set today's date as the minimum date for the date input
function getDateToday() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }
}


// Initialize the contacts dropdown
function initializeDropdown() {
    const dropdownIcon = document.getElementById('dropdownIcon');
    const dropdownIconUp = document.getElementById('dropdownIconUp');
    const dropdownContent = document.getElementById('dropdownContent');
    if (dropdownIcon && dropdownIconUp && dropdownContent) {
        dropdownIcon.addEventListener('click', toggleDropdown);
        dropdownIconUp.addEventListener('click', toggleDropdown);

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!dropdownContent.contains(event.target) &&
                !dropdownIcon.contains(event.target) &&
                !dropdownIconUp.contains(event.target)) {
                dropdownContent.style.display = 'none';
                dropdownIcon.classList.remove('d-none');
                dropdownIconUp.classList.add('d-none');
            }
        });
    } else {
        console.error('Dropdown elements not found!');
    }
}

// Toggle the contacts dropdown
function toggleDropdown() {
    const dropdownContent = document.getElementById('dropdownContent');
    const dropdownIcon = document.getElementById('dropdownIcon');
    const dropdownIconUp = document.getElementById('dropdownIconUp');

    if (!dropdownContent || !dropdownIcon || !dropdownIconUp) return;

    if (dropdownContent.style.display === 'block') {
        dropdownContent.style.display = 'none';
        dropdownIcon.classList.remove('d-none');
        dropdownIconUp.classList.add('d-none');
    } else {
        dropdownContent.style.display = 'block';
        dropdownIcon.classList.add('d-none');
        dropdownIconUp.classList.remove('d-none');
    }
}

// Initialize the category selector dropdown
function initializeCategorySelector() {
    const categorySelect = document.getElementById('category_select');
    if (categorySelect) {
        categorySelect.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleCategoryDropdown();
        });
    }
}

// Toggle the category dropdown
function toggleCategoryDropdown() {
    let dropdown = document.getElementById("category_dropdown");
    if (dropdown) {
        if (dropdown.style.display === "none" || dropdown.style.display === "") {
            if (dropdown.innerHTML.trim() === "") {
                dropdown.innerHTML = `
                    <div class="select_category" onclick="selectCategory('Technical Task')">Technical Task</div>
                    <div class="select_category" onclick="selectCategory('User Story')">User Story</div>
                `;
            }
            dropdown.style.display = "block";
        } else {
            dropdown.style.display = "none";
        }
    }
}

// Select a category
function selectCategory(category) {
    document.getElementById("select_txt").innerText = category;
    document.getElementById("category_dropdown").style.display = "none";
}

// Open the category dropdown
function to_open_category_dropdown() {
    let dropdown = document.getElementById("category_dropdown");
    if (dropdown) {
        dropdown.classList.toggle("visible");
    } else {
        console.error("Dropdown element with id 'category_dropdown' not found!");
    }
}

// Initialize the task form
document.addEventListener('DOMContentLoaded', () => {
    initializeTaskForm();
});

function initializeTaskForm() {
    const createTaskBtn = document.getElementById('createTaskBtn');
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            const taskData = collectTaskData();
            if (validateTaskData(taskData)) {
                const savedTask = await saveTaskToFirebase(taskData);
                if (savedTask) {
                    window.location.href = "/html/board.html";
                } else {
                    alert('Failed to create task. Please try again.');
                }
            }
        });
    }
}

function collectTaskData() {
    const title = document.getElementById('title')?.value.trim();
    const category = document.getElementById('select_txt')?.textContent.trim();
    const dueDate = document.getElementById('date')?.value.trim();
    const priority = getSelectedPriority(); // Ensure you have a function to get the selected priority
    const assignedContacts = selectedContacts;
    const subtasksArray = subtasks;
    const stage = 'todo'; // Or get the stage from a dropdown/input if needed

    return createTask(title, category, dueDate, priority, assignedContacts, subtasksArray, stage);
}

function createTask(title, category, dueDate, priority, assignedContacts, subtasksArray, stage = 'todo') {
    const newTask = {
        id: Date.now().toString(),
        title,
        category,
        dueDate,
        priority,
        stage, // Default to 'todo' if not provided
        assignedContacts,
        subtasks: subtasksArray.reduce((acc, title, index) => {
            acc[index] = {
                title: title,
                completed: false
            };
            return acc;
        }, {})
    };
    return newTask;
}// Validate task data


function validateTaskData(taskData) {
    if (!taskData.title) {
        alert('Please fill in the Title');
        return false;
    }
    if (!taskData.dueDate) {
        alert('Please fill in the Due Date');
        return false;
    }
    if (!taskData.category || taskData.category === 'Select task category') {
        alert('Please fill in the Category');
        return false;
    }
    return true;
}

// Reset the form
function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    document.getElementById('select_txt').textContent = 'Select task category';
    document.getElementById('added_text').innerHTML = '';
    
    document.getElementById('contactInput').value = '';
    document.getElementById('selectedContactsInitials').innerHTML = '';
    subtasks = [];
}

// Save task to Firebase
async function saveTaskToFirebase(taskData) {
    const BASE_URL = 'https://join-428-default-rtdb.europe-west1.firebasedatabase.app/';
    const TASKS_ENDPOINT = 'tasks.json';
    try {
        const response = await fetch(`${BASE_URL}${TASKS_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        if (!response.ok) {
            throw new Error('Failed to save task to Firebase');
        }
        const data = await response.json();
        console.log('Task saved successfully:', data);
        return data;
    } catch (error) {
        console.error('Error saving task:', error);
        return null;
    }
}

// Load contacts from Firebase
async function loadContacts() {
    const dropdownContent = document.getElementById('dropdownContent');
    if (!dropdownContent) {
        console.error('Dropdown content element not found!');
        return;
    }
    const contactsData = await loadData('contacts');
    if (contactsData) {
        const contactsArray = Object.values(contactsData);
        dropdownContent.innerHTML = '';

        contactsArray.forEach(contact => {
            const contactDiv = document.createElement('div');
            contactDiv.classList.add('dropdown-item');

            contactDiv.innerHTML = `
                <div class="contact-info">
                    <div class="contact-initials-container" style="background-color: ${getRandomColor()}">
                        <div class="contact-initials">${getInitials(contact.name)}</div>
                    </div>
                    <span class="contact-name">${contact.name}</span>
                </div>
                <input type="checkbox" class="contact-checkbox">
            `;

            const checkbox = contactDiv.querySelector('.contact-checkbox');

            checkbox.addEventListener('change', (event) => {
                if (checkbox.checked) {
                    // Add the selected-contact-item class
                    contactDiv.classList.add('selected-contact-item');
                    if (!selectedContacts.find(c => c.name === contact.name)) {
                        selectedContacts.push(contact);
                    }
                } else {
                    // Remove the selected-contact-item class
                    contactDiv.classList.remove('selected-contact-item');
                    selectedContacts = selectedContacts.filter(c => c.name !== contact.name);
                }

                updateSelectedContacts();
            });

            dropdownContent.appendChild(contactDiv);
        });
    } else {
        dropdownContent.innerHTML = '<div class="dropdown-item">No contacts available</div>';
    }
}
// Select a contact

function selectContact(contact) {
    if (!selectedContacts.find(c => c.name === contact.name)) {
        selectedContacts.push(contact);
        updateSelectedContacts();
        console.log('Contact selected:', contact.name);
    } else {
        console.log('Contact already selected:', contact.name);
    }
   
}

function updateSelectedContacts() {
    const inputField = document.getElementById('contactInput');
    const initialsContainer = document.getElementById('selectedContactsInitials');

    if (!inputField || !initialsContainer) {
        console.error('Input field or initials container not found!');
        return;
    }

    // Update the input field with selected contact names
    const selectedNames = selectedContacts.map(contact => contact.name).join(', ');
    inputField.value = selectedNames;

    // Update the initials container
    initialsContainer.innerHTML = '';
    selectedContacts.forEach(contact => {
        const span = document.createElement('span');
        span.classList.add('contact-initial');

        span.innerHTML = `
            <div class="contact-initials-container" style="background-color: ${getRandomColor()}">
                <div class="contact-initials">${getInitials(contact.name)}</div>
            </div>
        `;

        initialsContainer.appendChild(span);
    });
}

function getInitials(name) {
    if (!name) return ''; // Handle undefined or empty names
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
}
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



// Close the "Add Task" pop-up
function closeOverlay() {
    const overlay = document.getElementById('overlay');
    const popupContainer = document.getElementById('popup_container');

    // Hide the overlay and pop-up
    overlay.classList.add('d_none');
    popupContainer.classList.add('d_none');
}

window.subtasks = window.subtasks || {};

function show_subtask_container() {
    let add_delete_container = document.getElementById('add_delete_container');
    let show_subtask_container = document.getElementById('show_subtask_container');
    let add_subtask_container = document.querySelector('.add_subtask_container');
    let subtask_input = document.getElementById('subtask_input');
    add_delete_container.classList.add('visible');
    show_subtask_container.style.display = 'none';
    add_subtask_container.classList.add('no-hover');
    subtask_input.addEventListener('click', show_subtask_container);
}

function delete_text() {
    let add_delete_container = document.getElementById('add_delete_container');
    let show_subtask_container = document.getElementById('show_subtask_container');
    let add_subtask_container = document.querySelector('.add_subtask_container');
    let subtask_input = document.getElementById('subtask_input');
    subtask_input.value = "";
    show_subtask_container.style.display = 'block';
    add_delete_container.classList.remove('visible');
    add_subtask_container.classList.remove('no-hover');
    subtask_input.removeEventListener('click', show_subtask_container);
}

function add_new_text(event) {
    let newSubTask = document.getElementById('subtask_input');
    if (!newSubTask.value.trim()) return;

    let id = Date.now();
    subtasks[id] = {
        title: newSubTask.value,
        completed: false,
        isEditing: false
    };

    newSubTask.value = '';
    renderSubtasks();
}


function hideInputSubTaksClickContainerOnOutsideClick() {
    document.addEventListener('click', function (event) {
        let add_delete_container = document.getElementById('add_delete_container');
        let show_subtask_container = document.getElementById('show_subtask_container');
        let add_subtask_container = document.querySelector('.add_subtask_container');
        let subtask_input = document.getElementById('subtask_input');
        if (!add_delete_container.contains(event.target) &&
            !subtask_input.contains(event.target) &&
            !show_subtask_container.contains(event.target)) {
            add_delete_container.classList.remove('visible');
            show_subtask_container.style.display = 'block';
            add_subtask_container.classList.remove('no-hover');
        }
    });
}

function renderSubtasks(editIndex = null) {
    let subtask_list = document.getElementById('added_text');
    subtask_list.innerHTML = '';

    Object.keys(subtasks).forEach(id => {
        let subtask = subtasks[id];

        if (typeof subtask === 'string') {
            subtask = { title: subtask, completed: false, isEditing: false };
            subtasks[id] = subtask;
        }

        if (id == editIndex) {
            subtask_list.innerHTML += subTaskProgressTemplate(id, subtask.title);
        } else {
            subtask_list.innerHTML += subTaskCreatedTemplate(id, subtask.title);
        }
    });
}


function editSubTask(id) {
    renderSubtasks(id);
}

function saveSubTask(id) {
    let input = document.getElementById(`editInput${id}`);
    if (!input.value.trim()) return;
    
    subtasksBoard[id] = input.value;
    renderSubtasks();
}

function deleteSubTask(id) {
    delete subtasksBoard[id];
    renderSubtasks();
}
