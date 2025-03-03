


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

let isDropdownClosed = false;
let selectedContacts = [];
let subtasks = [];
let newtasks = [];

function initializeDropdown() {
    const dropdownIcon = document.getElementById('dropdownIcon');
    const dropdownIconUp = document.getElementById('dropdownIconUp');
    const dropdownContent = document.getElementById('dropdownContent');

    console.log('Dropdown Icon:', dropdownIcon); 
    console.log('Dropdown Icon Up:', dropdownIconUp); 
    console.log('Dropdown Content:', dropdownContent); 

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
function initializeTaskForm() {
    const createTaskBtn = document.getElementById('createTaskBtn');
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            const taskData = collectTaskData();
            if (validateTaskData(taskData)) {
                const savedTask = await saveTaskToFirebase(taskData);
                if (savedTask) {
                    alert('Task created successfully!');
                    resetForm();
                    if (typeof init === 'function') {
                        init();
                    }
                } else {
                    alert('Failed to create task. Please try again.');
                }
            }
        });
    }
}

// Collect task data from the form
function collectTaskData() {
    return {
        id: Date.now().toString(),
        title: document.getElementById('title')?.value.trim(),
        description: document.getElementById('description')?.value.trim(),
        dueDate: document.getElementById('date')?.value.trim(),
        category: document.getElementById('select_txt')?.textContent.trim(),
        assignedContacts: selectedContacts,
        subtasks: subtasks
    };
}

// Validate task data
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
    selectedContacts = [];
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

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

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

// Delete text from the subtask input
function delete_text() {
    let add_delete_container = document.getElementById('add_delete_container');
    let show_subtask_container = document.getElementById('show_subtask_container');
    let add_subtask_container = document.querySelector('.add_subtask_container');
    let subtask_input = document.getElementById('subtask_input');
    subtask_input.value = '';
    show_subtask_container.style.display = 'block';
    add_delete_container.classList.remove('visible');
    add_subtask_container.classList.remove('no-hover');
    subtask_input.removeEventListener('click', show_subtask_container);
}

function add_new_text(event) {
    let newSubTask = document.getElementById('subtask_input');
    if (newSubTask.value == 0) {
        return false;
    }
    subtasks.push(newSubTask.value);
    newSubTask.value = '';
    renderSubtasks();
    if (event && event.type === 'click') {
        document.getElementById('add_delete_container').classList.remove('visible');
        document.getElementById('show_subtask_container').style.display = 'block';
        document.querySelector('.add_subtask_container').classList.remove('no-hover');
    }
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

function renderSubtasks(editIndex = -1) {
    let subtask_list = document.getElementById('added_text');
    subtask_list.innerHTML = '';
    subtasks.forEach((subtask, index) => {
        if (index === editIndex) {
            subtask_list.innerHTML += subTaskProgressTemplate(index, subtask);
        } else {
            subtask_list.innerHTML += subTaskCreatedTemplate(index, subtask);
        }
    });
}

// Edit a subtask
function editSubTask(index) {
    renderSubtasks(index);
}

// Save a subtask
function saveSubTask(index) {
    let editedText = document.getElementById(`editInput${index}`).value;
    if (editedText.trim() !== '') {
        subtasks[index] = editedText;
    }
    renderSubtasks();
}

// Delete a subtask
function deleteSubTask(index) {
    subtasks.splice(index, 1);
    renderSubtasks();
}

// Hide subtask input container on outside click
function hideInputSubTaksClickContainerOnOutsideClick() {
    document.addEventListener('click', function (event) {
        let add_delete_container = document.getElementById('add_delete_container');
        let show_subtask_container = document.getElementById('show_subtask_container');
        let add_subtask_container = document.querySelector('.add_subtask_container');
        let subtask_input = document.getElementById('subtask_input');

        if (
            add_delete_container && 
            show_subtask_container && 
            add_subtask_container && 
            subtask_input
        ) {
            if (
                !add_delete_container.contains(event.target) &&
                !subtask_input.contains(event.target) &&
                !show_subtask_container.contains(event.target)
            ) {
                add_delete_container.classList.remove('visible');
                show_subtask_container.style.display = 'block';
                add_subtask_container.classList.remove('no-hover');
            }
        }
    });
}