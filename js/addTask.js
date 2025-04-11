// This variable tracks the state of a dropdown menu.
// @type {boolean}
window.isDropdownClosed = false;

// This array stores the list of selected contacts.
// @type {string[]}
window.selectedContacts = [];

/**
 * Saves the task data to Firebase.
 * 
 * @param {Object} taskData - The task data to be saved.
 * @returns {Promise<Object|null>} The saved task data or null in case of an error.
 */
async function saveTaskToFirebase(taskData) {
    const url = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";
    try {
        const response = await postData(url, taskData);
        return await processResponse(response);
    } catch (error) {
        console.error('Error saving task:', error);
        return null;
    }
}

/**
 * Sends a POST request with the provided data to the specified URL.
 * 
 * @param {string} url - The URL to send the data to.
 * @param {Object} data - The data to send in the request body.
 * @returns {Promise<Response>} The response from the fetch request.
 */
async function postData(url, data) {
    return await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

/**
 * Processes the response from a request.
 * 
 * @param {Response} response - The response object from the fetch request.
 * @returns {Promise<Object>} The parsed JSON data from the response.
 * @throws {Error} If the response is not ok.
 */
async function processResponse(response) {
    if (!response.ok) throw new Error('Failed to save task to Firebase');
    return await response.json();
}

/**
 * Collects task data from input fields and returns an object representing the task.
 * 
 * @returns {Object|null} The task data object, or null if validation fails.
 */
function collectTaskData() {
    const title = getValue('title');
    const description = getValue('description');
    const dueDate = getValue('date');
    const priority = getSelectedPriority();
    const category = document.getElementById('select_txt').textContent;
    if (!validateTaskForm(title, dueDate, category)) return null;
    const assignedContacts = buildAssignedContacts();
    return { title, description, dueDate, priority, category, assignedContacts, subtasks };
}

/**
 * Retrieves the value of an input field by its ID.
 * 
 * @param {string} id - The ID of the input element.
 * @returns {string} The value of the input field.
 */
function getValue(id) {
    return document.getElementById(id).value;
}

/**
 * Gets the currently selected task priority.
 * 
 * @returns {string} The selected priority ('urgent', 'medium', or 'low').
 */
function getSelectedPriority() {
    return document.querySelector('.prioBtnUrgent.active') ? 'urgent' :
        document.querySelector('.prioBtnMedium.active') ? 'medium' : 'low';
}

/**
 * Builds the list of assigned contacts from the selected contacts.
 * 
 * @returns {Object[]} An array of objects representing the assigned contacts, 
 *                     each containing name, color, and initials.
 */
function buildAssignedContacts() {
    return selectedContacts.map(contact => {
        const name = typeof contact === 'string' ? contact : contact.name;
        return { name, color: getRandomColor(), initials: getInitials(name) };
    });
}

/**
 * Generates initials from a full name.
 * 
 * @param {string} name - The full name from which to extract initials.
 * @returns {string} The initials in uppercase.
 */
function getInitials(name) {
    if (typeof name !== 'string') {
        console.error("Invalid name:", name);
        return '';
    }
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
}

document.addEventListener('DOMContentLoaded', function () {
    const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";
    const CONTACTS_ENDPOINT = "contacts.json";
    const contactInput = document.getElementById('contactInput');
    const dropdownContent = document.getElementById('dropdownContent');
    const dropdownIcon = document.getElementById('dropdownIcon');
    const dropdownIconUp = document.getElementById('dropdownIconUp');
    function getInitials(name) {
        const names = name.split(' ');
        const initials = names.map(n => n[0]).join('');
        return initials.toUpperCase();
    }

    /**
    * Fetches contacts from the Firebase database.
    * 
    * @returns {Promise<Object|null>} A promise that resolves to the contacts data from Firebase, or null if an error occurred.
    */
    async function fetchContacts() {
        try {
            const response = await fetch(`${BASE_URL}${CONTACTS_ENDPOINT}`);
            if (!response.ok) {
                throw new Error('Failed to fetch contacts');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching contacts:', error);
            return null;
        }
    }

 /**
   * Populates the dropdown menu with contact items by fetching contact data and appending new elements.
   * 
   * @returns {void}
   */
    async function populateDropdown() {
        const contacts = await fetchContacts();
        if (!contacts) return console.error('No contacts found or failed to fetch.');
        const dropdownContent = document.getElementById('dropdownContent');
        dropdownContent.innerHTML = '';
        Object.entries(contacts).forEach(([key, contact]) => {
            const contactItem = createContactItem(key, contact);
            dropdownContent.appendChild(contactItem);
        });
    }

/**
 * Creates a contact item element for the dropdown menu.
 * 
 * @param {string} key - The contact's key used for creating the item.
 * @param {Object} contact - The contact data object.
 * @returns {HTMLElement} The created contact item element.
 */
    function createContactItem(key, contact) {
        const item = document.createElement('div');
        item.className = 'contact-item';
        const checkbox = createCheckbox(key, contact.email);
        const info = createContactInfo(contact.name);
        item.appendChild(info);
        item.appendChild(checkbox);
        item.addEventListener('click', event => handleContactClick(event, item, checkbox, contact));
        return item;
    }

    /**
     * Handles click events on contact items in the dropdown.
     * 
     * @param {MouseEvent} event - The click event.
     * @param {HTMLElement} item - The contact item element.
     * @param {HTMLElement} checkbox - The checkbox element.
     * @param {Object} contact - The contact data object.
     */
    function handleContactClick(event, item, checkbox, contact) {
        if (event.target !== checkbox) checkbox.checked = !checkbox.checked;
        item.classList.toggle('selected-dropdown-item');
        checkbox.checked ? addContact(contact.name) : removeContact(contact.name);
        updateInputField();
    }

    /**
     * Adds a contact to the list of selected contacts.
     * 
     * @param {string} name - The name of the contact to add.
     */
    function addContact(name) {
        if (!selectedContacts.includes(name)) selectedContacts.push(name);
    }

    /**
     * Removes a contact from the list of selected contacts.
     * 
     * @param {string} name - The name of the contact to remove.
     */
    function removeContact(name) {
        selectedContacts = selectedContacts.filter(n => n !== name);
    }

    /**
     * Creates a checkbox input element for a contact item.
     * 
     * @param {string} key - The contact's key.
     * @param {string} email - The contact's email.
     * @returns {HTMLInputElement} The created checkbox element.
     */
    function createCheckbox(key, email) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox_class';
        checkbox.value = email;
        checkbox.id = `contact-${key}`;
        return checkbox;
    }

    /**
     * Creates the contact information section including initials and name.
     * 
     * @param {string} name - The contact's name.
     * @returns {HTMLElement} The created contact information element.
     */
    function createContactInfo(name) {
        const info = document.createElement('div');
        info.className = 'contact-info';
        const initialsContainer = document.createElement('div');
        initialsContainer.className = 'initials-container';
        initialsContainer.style.backgroundColor = getRandomColor();
        const initials = document.createElement('div');
        initials.className = 'initials';
        initials.textContent = getInitials(name);
        initialsContainer.appendChild(initials);
        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;
        info.appendChild(initialsContainer);
        info.appendChild(nameSpan);
        return info;
    }

    /**
     * Updates the input field with selected contact initials.
     * 
     * @returns {void}
     */
    function updateInputField() {
        const container = document.getElementById('selectedContactsInitials');
        if (!container) return;
        container.innerHTML = '';
        const maxInitials = 4;
        selectedContacts.slice(0, maxInitials).forEach(name => {
            container.appendChild(createInitialsBubble(name));
        });
        if (selectedContacts.length > maxInitials) {
            container.appendChild(createRemainingBubble(selectedContacts.length - maxInitials));
        }
    }

    /**
     * Creates a bubble element displaying the initials of a contact.
     * 
     * @param {string} name - The contact's name.
     * @returns {HTMLElement} The created initials bubble.
     */
    function createInitialsBubble(name) {
        const container = document.createElement('div');
        container.className = 'initials-container';
        container.style.backgroundColor = getRandomColor();
        const initialsDiv = document.createElement('div');
        initialsDiv.className = 'initials';
        initialsDiv.textContent = getInitials(name);
        container.appendChild(initialsDiv);
        return container;
    }

    /**
     * Creates a bubble element displaying the count of remaining contacts.
     * 
     * @param {number} count - The number of remaining contacts.
     * @returns {HTMLElement} The created remaining contacts bubble.
     */
    function createRemainingBubble(count) {
        const div = document.createElement('div');
        div.className = 'remaining_contacts_addTask';
        div.textContent = `+${count}`;
        return div;
    }

    /**
     * Toggles the visibility of the dropdown menu.
     * 
     * This function shows or hides the dropdown depending on its current state.
     */
    function toggleDropdown() {
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

    /**
     * Adds event listeners to handle dropdown toggle interactions.
     * 
     * - `dropdownIcon`: Toggles the dropdown menu when clicked.
     * - `dropdownIconUp`: Toggles the dropdown menu when clicked (when the dropdown is open).
     * - `contactInput`: Toggles the dropdown menu when clicked (e.g., when interacting with an input field).
     * - `document`: Closes the dropdown if a click occurs outside the dropdown, dropdown icon, or input field.
     */
    dropdownIcon.addEventListener('click', toggleDropdown);
    dropdownIconUp.addEventListener('click', toggleDropdown);
    contactInput.addEventListener('click', toggleDropdown);
    document.addEventListener('click', function (event) {
        if (
            !dropdownIcon.contains(event.target) &&
            !dropdownIconUp.contains(event.target) &&
            !dropdownContent.contains(event.target) &&
            !contactInput.contains(event.target)
        ) {
            dropdownContent.style.display = 'none';
            dropdownIcon.classList.remove('d-none');
            dropdownIconUp.classList.add('d-none');
        }
    });
    /**
     * Populates the dropdown menu with contact items.
     * This function fetches the contacts and appends the contact elements to the dropdown content.
     */
    populateDropdown();

    /**
     * Adds an event listener to the "Create Task" button that triggers task creation when clicked.
     */
    document.getElementById('createTaskBtn').addEventListener('click', handleCreateTask);

    /**
     * Handles the task creation process when the "Create Task" button is clicked.
     * 
     * This function collects task data, attempts to save the task to Firebase, and handles the result.
     * 
     * @param {Event} event - The event object representing the click on the "Create Task" button.
     */
    async function handleCreateTask(event) {
        event.preventDefault();
        const taskData = collectTaskData();
        if (!taskData) return;
        const savedTask = await saveTaskToFirebase(taskData);
        handleTaskSaveResult(savedTask);
    }

    /**
     * Handles the result after attempting to save the task.
     * 
     * If the task was successfully saved, it shows a success message, resets the form, and redirects to the board.
     * If the task creation failed, it shows an error alert.
     * 
     * @param {Object|null} savedTask - The saved task object or `null` if the task creation failed.
     */
    function handleTaskSaveResult(savedTask) {
        if (savedTask) {
            showToast('Task created successfully!');
            resetForm();
            redirectToBoard();
        } else {
            alert('Failed to create task. Please try again.');
        }
    }

    /**
     * Redirects the user to the board page after a task has been created.
     * 
     * A delay is used before redirecting to give the user time to see the success message.
     */
    function redirectToBoard() {
        setTimeout(() => {
            window.location.href = '../html/board.html';
        }, 2000);
    }
});

/**
 * Resets the task creation form by calling several helper functions to clear form fields,
 * reset contacts, and reset priority and contact selections.
 */
function resetForm() {
    resetBasicFields();
    clearContactsAndSubtasks();
    resetPriority();
    resetContactSelections();
}

/**
 * Resets the basic fields of the task creation form.
 * Clears the title, description, due date, category, and added text.
 */
function resetBasicFields() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    document.getElementById('select_txt').textContent = 'Select task category';
    document.getElementById('added_text').innerHTML = '';
}

/**
 * Clears the selected contacts and subtasks from the form.
 * Resets the contact input field and clears the contact initials displayed.
 */
function clearContactsAndSubtasks() {
    selectedContacts = [];
    subtasks = [];
    document.getElementById('contactInput').value = '';
    document.getElementById('selectedContactsInitials').innerHTML = '';
}

/**
 * Resets the task priority to the default value ('medium').
 */
function resetPriority() {
    setPrio('medium');
}

/**
 * Resets the contact selections by removing the selection from each contact item
 * and unchecking any checkboxes.
 */
function resetContactSelections() {
    document.querySelectorAll('.contact-item').forEach(item => {
        item.classList.remove('selected-dropdown-item');
        let checkbox = item.querySelector('.checkbox_class');
        if (checkbox) checkbox.checked = false;
    });
}

/**
 * Resets all relevant values.
 * 
 * - Calls the `resetForm()` function to reset the form.
 * - Sets the priority to 'medium' by calling the `setPrio('medium')` function.
 */
function resetAll() {
    resetForm();
    setPrio('medium');
}

/**
 * Generates a random color in hexadecimal format.
 * 
 * @returns {string} A randomly generated color in the format "#RRGGBB".
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
