
/**
 * Handles the priority selection for a task.
 * 
 * Sets the task's priority to the specified value and updates the UI to reflect the selection.
 * 
 * @param {Event} event - The event object for the priority selection click event.
 * @param {string} priority - The priority level to set for the task.
 */
function handlePrioritySelection(event, priority) {
    event.stopPropagation();
    currentTask.priority = priority;
    const priorityOptions = document.querySelectorAll('.priority-option');
    priorityOptions.forEach(option => {
        if (option.getAttribute('onclick').includes(priority)) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

/**
 * Sets the priority of the current task and updates the UI.
 * 
 * Adds the 'active' class to the selected priority button and removes it from the others.
 * 
 * @param {string} priority - The priority level to set for the current task.
 */
function setPrio(priority) {
    currentTask.priority = priority;
    const priorityButtons = document.querySelectorAll('.prio_btn_container button');
    priorityButtons.forEach(button => {
        if (button.getAttribute('onclick').includes(priority)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

/**
 * Fetches contacts from the database and returns them as an array.
 * 
 * @returns {Promise<Array>} A promise that resolves to an array of contact objects.
 */
async function fetchContacts() {
    try {
        const response = await fetch(`${BASE_URL}/contacts.json`);
        if (!response.ok) throw new Error("Failed to fetch contacts");
        const data = await response.json();
        contacts = [];
        for (const key in data) {
            contacts.push({ id: key, ...data[key] });
        }
        return contacts;
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return [];
    }
}

/**
 * Fills the dropdown menu with contact options for the task edit overlay. 
 * The dropdown shows a list of contacts with their initials and names.
 * Contacts already assigned to the current task are pre-selected.
 * @async
 * @function populateDropdown
 * @returns {Promise<void>} - A promise that resolves when the contacts have been loaded and the dropdown is populated.
 */
async function populateDropdown() {
    await fetchContacts();
    const dropdownContent = document.getElementById('editDropdownContent');
    if (dropdownContent) dropdownContent.innerHTML = generateDropdownHTML();
}

/**
 * Generates the HTML content for the dropdown menu based on the contacts. 
 * @function generateDropdownHTML
 * @returns {string} - The generated HTML string for the dropdown.
 */
function generateDropdownHTML() {
    return contacts.map(createDropdownItem).join('') || '';
}

/**
 * Creates an individual dropdown item for a contact. 
 * @function createDropdownItem
 * @param {Object} contact - A contact object containing the name, initials, and color.
 * @returns {string} - The HTML string for a dropdown item.
 */
function createDropdownItem(contact) {
    const isSelected = currentTask.assignedContacts?.some(c => c.name === contact.name);
    return `
        <div class="dropdown-item ${isSelected ? 'selected-contact-item' : ''}" 
             onclick="event.stopPropagation(); toggleCheckbox('${contact.name}')">
            ${createContactInfo(contact)}
            <input type="checkbox" id="contact-${contact.name}" class="contact-checkbox"
                ${isSelected ? 'checked' : ''}>
        </div>
    `;
}

/**
 * Creates the HTML code for displaying the contact information. 
 * @function createContactInfo
 * @param {Object} contact - A contact object with initials, name, and color.
 * @returns {string} - The HTML string for the contact information display.
 */
function createContactInfo(contact) {
    return `
        <div class="contact-info">
            <div class="contact-initials-container" style="background-color: ${contact.color}">
                <div class="contact-initials">${contact.initials}</div>
            </div>
            <span class="contact-name">${contact.name}</span>
        </div>
    `;
}

/**
 * Toggles the checkbox of a contact and updates the selection. 
 * If the contact is selected, it is added to the list of assigned contacts and highlighted.
 * If the contact is deselected, it is removed and the highlight is removed.
 * @param {string} contactName - The name of the contact to be selected or deselected.
 */
function toggleCheckbox(contactName) {
    const checkbox = document.getElementById(`contact-${contactName}`);
    if (!checkbox) return;
    checkbox.checked = !checkbox.checked;
    selectEditContact(contactName);
    const contactItem = checkbox.closest('.dropdown-item');
    if (contactItem) {
        contactItem.classList.toggle('selected-contact-item', checkbox.checked);
    }
}

/**
 * Selects a contact for editing, adds it or removes it based on the checkbox state.
 * @function
 * @param {string} contactName - The name of the contact to be edited.
 */
function selectEditContact(contactName) {
    const contact = contacts.find(c => c.name === contactName);
    if (!contact) return;
    const checkbox = document.getElementById(`contact-${contact.name}`);
    if (!checkbox) return;
    checkbox.checked ? addEditContact(contact) : removeEditContact(contact);
    clearEditContactInput();
}

/**
 * Adds a contact to the list of assigned contacts for the current task.
 * @function
 * @param {Object} contact - The contact to be added.
 */
function addEditContact(contact) {
    if (!currentTask.assignedContacts) currentTask.assignedContacts = [];
    currentTask.assignedContacts.push(contact);
    const selectedContactsInitials = document.getElementById('selectedContactsInitials');
    if (selectedContactsInitials) {
        selectedContactsInitials.insertAdjacentHTML('beforeend', createEditContactBadge(contact));
    }
}

/**
 * Removes a contact from the list of assigned contacts for the current task.
 * @function
 * @param {Object} contact - The contact to be removed.
 */
function removeEditContact(contact) {
    currentTask.assignedContacts = currentTask.assignedContacts.filter(c => c.name !== contact.name);
    document.querySelector(`.contact-badge[title="${contact.name}"]`)?.remove();
}

/**
 * Creates the HTML for a contact badge.
 * @function
 * @param {Object} contact - The contact for which the badge will be created.
 * @returns {string} - The HTML string for the badge.
 */
function createEditContactBadge(contact) {
    return `<div class="contact-badge" style="background-color: ${contact.color}" title="${contact.name}">
                ${contact.initials}
            </div>`;
}

/**
 * Clears the input field for contacts.
 * @function
 */
function clearEditContactInput() {
    const contactInput = document.getElementById('editContactInput');
    if (contactInput) contactInput.value = '';
}

/**
 * Toggles the visibility of the dropdown for selecting contacts in the task editing overlay.
 * 
 * Shows or hides the dropdown menu, depending on its current state.
 */
function toggleEditDropdown(event) {
    event.stopPropagation();
    const dropdownContent = document.getElementById('editDropdownContent');
    const iconDown = document.getElementById('editDropdownIcon');
    const iconUp = document.getElementById('editDropdownIconUp');
    if (!dropdownContent || !iconDown || !iconUp) return;
    const isOpen = dropdownContent.style.display === 'block';
    if (isOpen) {
        closeEditDropdown();
    } else {
        dropdownContent.style.display = 'block';
        iconDown.classList.add('d-none');
        iconUp.classList.remove('d-none');
    }
}

/**
 * Closes the dropdown menu for selecting contacts and updates the UI elements. 
 * Performs the following actions:
 * - Hides the dropdown content
 * - Displays the "down-arrow" icon
 * - Hides the "up-arrow" icon 
 * @function closeEditDropdown
 * @returns {void} - Does not return a value
 */
function closeEditDropdown() {
    const dropdownContent = document.getElementById('editDropdownContent');
    const iconDown = document.getElementById('editDropdownIcon');
    const iconUp = document.getElementById('editDropdownIconUp');
    if (!dropdownContent || !iconDown || !iconUp) return;
    dropdownContent.style.display = 'none';
    iconDown.classList.remove('d-none');
    iconUp.classList.add('d-none');
}

/**
 * Saves changes to a task in the edit overlay.
 * Updates the task in the UI and in the database.
 */
async function saveChanges() {
    if (!validateCurrentTask()) return;
    updateCurrentTaskFromInputs();
    updateTodosArray();
    try {
        await saveTaskToBackend();
        if (typeof updateHTML === "function") updateHTML();
        if (typeof editOverlay === "function") editOverlay();
    } catch (error) {
        console.error("❌ Fehler beim Speichern in Firebase:", error);
    }
}

/**
 * Checks if the currentTask is valid.
 * @returns {boolean} - true if valid, otherwise false
 */
function validateCurrentTask() {
    if (!currentTask) return console.error("❌ Fehler: currentTask ist nicht definiert!"), false;
    if (!currentTask.id) return console.error("❌ Fehler: currentTask hat keine ID!"), false;
    return true;
}

/**
 * Retrieves the values from the input fields and updates currentTask.
 */
function updateCurrentTaskFromInputs() {
    currentTask.title = document.getElementById('edit_title')?.value || "";
    currentTask.description = document.getElementById('edit_description')?.value || "";
    currentTask.dueDate = document.getElementById('edit_due_date')?.value || "";
}

/**
 * Updates the todos array with the changes from currentTask.
 */
function updateTodosArray() {
    const taskIndex = todos.findIndex(t => t.id === currentTask.id);
    if (taskIndex !== -1) {
        todos[taskIndex] = { ...currentTask };
    } else {
        console.warn("⚠️ Warnung: Task wurde in todos nicht gefunden!");
    }
}

/**
 * Saves the current task to the backend (Firebase).
 * @returns {Promise<Response>} - The response from fetch
 */
function saveTaskToBackend() {
    return fetch(`${BASE_URL}/tasks/${currentTask.id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTask),
    }).then(response => {
        if (!response.ok) throw new Error("Fehler beim Speichern in Firebase");
        return response;
    });
}

/**
 * Renders the list of tasks and displays them in the task container.
 */
function renderTasks() {
    const taskContainer = document.getElementById('task_main');
    if (!taskContainer) return;
    taskContainer.innerHTML = '';
    todos.forEach(task => {
        const taskElement = createTaskElement(task);
        taskContainer.appendChild(taskElement);
    });
}

/**
 * Creates a DOM element for a single task.
 * 
 * @param {Object} task - The task with title, description, due date, and assigned contacts.
 * @returns {HTMLElement} - The HTML element for the task.
 */
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description || 'No description'}</p>
        <p>Due: ${task.dueDate}</p>
        <div class="assigned-contacts">
            ${renderAssignedContacts(task)}
        </div>
    `;
    return taskElement;
}

/**
 * Renders the assigned contacts as an HTML string.
 * 
 * @param {Object} task - The task with `assignedContacts`.
 * @returns {string} - HTML string of the contact badges.
 */
function renderAssignedContacts(task) {
    return task.assignedContacts?.map(contact => `
        <div class="contact-badge" style="background-color: ${contact.color}" title="${contact.name}">
            ${contact.initials}
        </div>
    `).join('') || '';
}

/**
 * Prevents event propagation to stop event bubbling.
 * 
 * This is typically used to stop the event from triggering higher-level event listeners.
 * 
 * @param {Event} event - The event object that is triggered on the element.
 */
function editProtection(event) {
    event.stopPropagation();
}

