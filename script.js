/**
 * Initializes the necessary components on the "Add Task" page.
 * This function sets up the current date, dropdown menus, task category selector, 
 * and other UI elements. 
 * 1. Sets today's date.
 * 2. Initializes dropdown menus.
 * 3. Initializes the task category selector.
 * 4. Configures the task form.
 * 5. Adds an event handler to hide the subtask input when clicking outside.
 * 6. Loads the contact list.
 * @function initAddTask
 */
function initAddTask() {
    getDateToday();
    initializeDropdown();
    initializeCategorySelector();
    initializeTaskForm();
    hideInputSubTaksClickContainerOnOutsideClick();
    loadContacts();
}

/**
 * Activates the selected priority button and deactivates others. 
 * @param {string} priority - The priority level to set (e.g., "urgent", "medium", "low").
 */
function setPrio(prio) {
    document.querySelectorAll('.prioBtnUrgent, .prioBtnMedium, .prioBtnLow').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.prioBtn${prio.charAt(0).toUpperCase() + prio.slice(1)}`).classList.add('active');
}

/**
 * Sets the minimum selectable date in the date input field to today. 
 * This prevents users from selecting past dates. 
 * @function getDateToday
 */
function getDateToday() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }
}

/**
 * Initializes the dropdown menu and adds event listeners for opening and closing.
 * This is triggered once the DOM content is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    const dropdownContent = document.getElementById('dropdownContent');
    if (!dropdownContent) {
        return;
    }
    initializeDropdown();
});

/**
 * Initializes the dropdown menu by setting up toggle and close event listeners.
 * @function initializeDropdown
 */
function initializeDropdown() {
    const dropdownContent = getDropdownElement();
    if (!dropdownContent) return; 
    setupToggleListeners();
    setupCloseListener(dropdownContent);
}

/**
 * Retrieves the dropdown element from the DOM.
 * @returns {HTMLElement|null} The dropdown content element or null if not found.
 */
function getDropdownElement() {
    return document.getElementById('dropdownContent');
}

/**
 * Sets up event listeners to toggle the dropdown when specific elements are clicked. 
 * @function setupToggleListeners
 */
function setupToggleListeners() {
    const elements = [
        document.getElementById('dropdownIcon'),
        document.getElementById('dropdownIconUp'), 
        document.getElementById('contactInput')
    ];
    elements.forEach(element => {
        if (element) {
            element.addEventListener('click', handleToggleClick);
        }
    });
}

/**
 * Handles click events to open or close the dropdown. 
 * @param {Event} event - The click event.
 */
function handleToggleClick(event) {
    event.stopPropagation();
    toggleDropdown();
}

/**
 * Adds a click listener to the document to close the dropdown 
 * if the user clicks outside the dropdown container. 
 * @param {HTMLElement} dropdownContent - The dropdown container element.
 */
function setupCloseListener(dropdownContent) {
    document.addEventListener('click', (event) => {
        if (!dropdownContent.contains(event.target)) {
            closeDropdown();
        }
    });
}

/**
 * Toggles the visibility of the dropdown menu.
 * Opens it if it's closed, and closes it if it's open.
 * @function toggleDropdown
 */
function toggleDropdown() {
    const dropdownContent = document.getElementById('dropdownContent');
    const dropdownIcon = document.getElementById('dropdownIcon');
    const dropdownIconUp = document.getElementById('dropdownIconUp');
    if (!dropdownContent || !dropdownIcon || !dropdownIconUp) return;
    const isOpen = dropdownContent.style.display === 'block';
    if (isOpen) {
        closeDropdown();
    } else {
        dropdownContent.style.display = 'block';
        dropdownIcon.classList.add('d-none');
        dropdownIconUp.classList.remove('d-none');
    }
}

/**
 * Closes the dropdown menu and resets the dropdown icons.
 * @function closeDropdown
 */
function closeDropdown() {
    const dropdownContent = document.getElementById('dropdownContent');
    const dropdownIcon = document.getElementById('dropdownIcon');
    const dropdownIconUp = document.getElementById('dropdownIconUp');
    if (!dropdownContent || !dropdownIcon || !dropdownIconUp) return;
    dropdownContent.style.display = 'none';
    dropdownIcon.classList.remove('d-none');
    dropdownIconUp.classList.add('d-none');
}

/**
 * Initializes the category selector by adding a click event listener.
 * On click, toggles the category dropdown menu. 
 * @function initializeCategorySelector
 */
function initializeCategorySelector() {
    const categorySelect = document.getElementById('category_select');
    if (categorySelect) {
        categorySelect.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleCategoryDropdown();
        });
    }
}

/**
 * Toggles the visibility of the category dropdown menu.
 * If it's empty, populates it with default category options. 
 * 1. If the dropdown is hidden or empty, show it and fill it with categories.
 * 2. If the dropdown is already visible, hide it. 
 * @function toggleCategoryDropdown
 */
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

/**
 * Selects a category and displays it in the category selection area.
 * Hides the dropdown after selection. 
 * @param {string} category - The selected category to be displayed.
 * @function selectCategory
 */
function selectCategory(category) {
    document.getElementById("select_txt").innerText = category;
    document.getElementById("category_dropdown").style.display = "none";
}

/**
 * Toggles the "visible" class on the category dropdown menu.
 * Used as an alternative visual toggle for the dropdown.
 * Logs an error if the dropdown element is not found.
 * @function to_open_category_dropdown
 */
function to_open_category_dropdown() {
    let dropdown = document.getElementById("category_dropdown");
    if (dropdown) {
        dropdown.classList.toggle("visible");
    } else {
        console.error("Dropdown element with id 'category_dropdown' not found!");
    }
}

/**
 * Initializes the task form once the DOM content is fully loaded. 
 * @function initializeTaskForm
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeTaskForm();
});

/**
 * Initializes the task form by adding a click event to the "Create Task" button.
 * When the button is clicked, the form is validated and the task is saved to Firebase.
 * 1. Prevents the default button behavior (page reload).
 * 2. Collects task data from the form.
 * 3. Validates the collected data.
 * 4. Saves the task to Firebase if data is valid.
 * 5. Redirects the user to the board page upon successful save.
 * 6. Displays an error message if saving the task fails. 
 * @function initializeTaskForm
 */
function initializeTaskForm() {
    const createTaskBtn = document.getElementById('createTaskBtn');
    if (!createTaskBtn) return;
    createTaskBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        const taskData = collectTaskData();
        if (!taskData) return;
        const savedTask = await saveTaskToFirebase(taskData);
        if (savedTask) {
            resetForm();
            window.location.href = "../html/board.html";
        } else {
            alert('Failed to create task. Please try again.');
        }
    });
}

/**
 * Collects task data from the form fields.
 * This function reads the input values and returns a task object. 
 * 1. Gets title, category, due date, priority, assigned contacts, and subtasks.
 * 2. Sets task status to "todo".
 * 3. Returns the task object.
 * @returns {Object} Task object with all collected information.
 * @function collectTaskData
 */
function collectTaskData() {
    const title = document.getElementById('title')?.value?.trim();
    const category = document.getElementById('select_txt')?.textContent?.trim();
    const dueDate = document.getElementById('date')?.value?.trim();
    const priority = getSelectedPriority();
    const assignedContacts = selectedContacts || [];
    const subtasksArray = subtasks || [];
    const stage = 'todo';
    return createTask(title, category, dueDate, priority, assignedContacts, subtasksArray, stage);
}

/**
 * Creates a new task object with default values. 
 * @param {string} title - Task title
 * @param {string} category - Task category
 * @param {string} dueDate - Due date
 * @param {string} priority - Priority level
 * @param {Array} assignedContacts - Assigned contacts
 * @param {Array} subtasksArray - Subtask titles
 * @param {string} [stage='todo'] - Task status (default: 'todo')
 * @returns {Object} New task object
 * @function createTask
 */
function createTask(title, category, dueDate, priority, assignedContacts, subtasksArray, stage = 'todo') {
    return {
        id: generateTaskId(),
        title,
        category,
        dueDate,
        priority,
        stage,
        assignedContacts,
        subtasks: createSubtasksObject(subtasksArray)
    };
}

/**
 * Generates a unique task ID.
 * @returns {string} Timestamp as ID
 * @function generateTaskId
 */
function generateTaskId() {
    return Date.now().toString();
}

/**
 * Creates a subtask object from an array of subtask titles. 
 * @param {Array} subtasksArray - Array of subtask titles
 * @returns {Object} Subtasks as an object
 * @function createSubtasksObject
 */
function createSubtasksObject(subtasksArray) {
    return subtasksArray.reduce((acc, title, index) => {
        acc[index] = createSubtask(title);
        return acc;
    }, {});
}

/**
 * Creates a single subtask object. 
 * @param {string} title - Title of the subtask
 * @returns {Object} Subtask with default values
 * @function createSubtask
 */
function createSubtask(title) {
    return {
        title: title,
        completed: false
    };
}

/**
 * Saves task data to Firebase.
 * @param {Object} taskData - Task data to be saved
 * @returns {Promise<Object|null>} Saved data or null if an error occurred
 * @function saveTaskToFirebase
 */
async function saveTaskToFirebase(taskData) {
    try {
        const response = await postTaskData(taskData);
        return handleSuccessResponse(response);
    } catch (error) {
        return handleFirebaseError(error);
    }
}

/**
 * Sends a POST request to Firebase.
 * @param {Object} taskData - Task data to be saved
 * @returns {Promise<Response>} Server response
 * @function postTaskData
 */
async function postTaskData(taskData) {
    const BASE_URL = 'https://join-428-default-rtdb.europe-west1.firebasedatabase.app/';
    const TASKS_ENDPOINT = 'tasks.json';
    return await fetch(`${BASE_URL}${TASKS_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
    });
}

/**
 * Handles successful server response.
 * @param {Response} response - Server response
 * @returns {Promise<Object>} Parsed JSON data
 * @throws Will throw an error if response is not ok
 * @function handleSuccessResponse
 */
async function handleSuccessResponse(response) {
    if (!response.ok) throw new Error('Failed to save task to Firebase'); 
    const data = await response.json();
    return data;
}

/**
 * Handles Firebase save errors.
 * @param {Error} error - Error object
 * @returns {null} Always returns null
 * @function handleFirebaseError
 */
function handleFirebaseError(error) {
    console.error('Error saving task:', error);
    return null;
}

/**
 * Closes the overlay and popup window.
 * This function hides the overlay and popup by adding the appropriate
 * CSS classes that make the elements invisible. 
 * @function closeOverlay
 */
function closeOverlay() {
    const overlay = document.getElementById('overlay');
    const popupContainer = document.getElementById('popup_container');
    overlay.classList.add('d_none');
    popupContainer.classList.add('d_none');
    resetAll();
}