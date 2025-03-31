

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
 * Populates the dropdown with contact options for the edit task overlay.
 * 
 * The dropdown will display a list of contacts, each with their initials and name.
 * If the current task has assigned contacts, those will be pre-selected.
 */
async function populateDropdown() {
    await fetchContacts();
    const dropdownContent = document.getElementById('editDropdownContent');
    if (dropdownContent) {
        const dropdownContentHTML = contacts.map(contact => `
            <div class="dropdown-item" onclick="selectEditContact('${contact.name}')">
                <div class="contact-info">
                    <div class="contact-initials-container" style="background-color: ${contact.color}">
                        ${contact.initials}
                    </div>
                    <span class="contact-name">${contact.name}</span>
                    <input type="checkbox" id="contact-${contact.name}" class="contact-checkbox" 
                           ${currentTask.assignedContacts?.some(c => c.name === contact.name) ? 'checked' : ''}>
                </div>
            </div>
        `).join('') || '';
        dropdownContent.innerHTML = dropdownContentHTML;
    }
}

/**
 * Handles the selection or deselection of a contact for editing.
 * 
 * If the contact is checked, it will be added to the current task's assigned contacts,
 * and a badge representing the contact will be shown. If unchecked, the contact will 
 * be removed from the assigned contacts, and the badge will be removed from the UI.
 * 
 * @param {string} contactName - The name of the contact being selected or deselected.
 */
function selectEditContact(contactName) {
    const selectedContactsInitials = document.getElementById('selectedContactsInitials');
    const contactInput = document.getElementById('editContactInput');
    const contact = contacts.find(c => c.name === contactName);
    
    if (contact && selectedContactsInitials) {
        const checkbox = document.getElementById(`contact-${contact.name}`);
        
        if (checkbox.checked) {
            if (!currentTask.assignedContacts) currentTask.assignedContacts = [];
            currentTask.assignedContacts.push(contact);
            const contactBadge = `
                <div class="contact-badge" style="background-color: ${contact.color}" title="${contact.name}">
                    ${contact.initials}
                </div>
            `;
            selectedContactsInitials.insertAdjacentHTML('beforeend', contactBadge);
        } else {
            currentTask.assignedContacts = currentTask.assignedContacts.filter(c => c.name !== contact.name);
            const contactBadge = document.querySelector(`.contact-badge[title="${contact.name}"]`);
            if (contactBadge) {
                contactBadge.remove();
            }
        }
        if (contactInput) {
            contactInput.value = ''; 
        }
    }
}


/**
 * Toggles the visibility of the dropdown for selecting contacts in the task editing overlay.
 * 
 * Shows or hides the dropdown menu, depending on its current state.
 */
function toggleEditDropdown() {
    const dropdownContent = document.getElementById('editDropdownContent');
    const iconDown = document.getElementById('editDropdownIcon');
    const iconUp = document.getElementById('editDropdownIconUp');
    if (!dropdownContent || !iconDown || !iconUp) return;
    const isOpen = dropdownContent.style.display === 'block';
    dropdownContent.style.display = isOpen ? 'none' : 'block';
    iconDown.classList.toggle('d-none', isOpen);
    iconUp.classList.toggle('d-none', !isOpen);
}

/**
 * Saves the changes made to the task in the editing overlay.
 * 
 * Updates the task's details (title, description, and due date) in the UI and in the database. 
 * After saving, the UI is updated and the overlay is closed.
 */
async function saveChanges() {
    if (!currentTask) {
        console.error("❌ Fehler: currentTask ist nicht definiert!");
        return;
    }
    if (!currentTask.id) {
        console.error("❌ Fehler: currentTask hat keine ID!");
        return;
    }
    const title = document.getElementById('edit_title')?.value || "";
    const description = document.getElementById('edit_description')?.value || "";
    const dueDate = document.getElementById('edit_due_date')?.value || "";
    currentTask.title = title;
    currentTask.description = description;
    currentTask.dueDate = dueDate;
    const taskIndex = todos.findIndex(t => t.id === currentTask.id);
    if (taskIndex !== -1) {
        todos[taskIndex] = { ...currentTask };
    } else {
        console.warn("⚠️ Warnung: Task wurde in todos nicht gefunden!");
    }
    try {
        const response = await fetch(`${BASE_URL}/tasks/${currentTask.id}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentTask),
        });
        if (!response.ok) throw new Error("Fehler beim Speichern in Firebase");
        if (typeof updateHTML === "function") updateHTML();
        if (typeof editOverlay === "function") editOverlay();
    } catch (error) {
        console.error("❌ Fehler beim Speichern in Firebase:", error);
    }
}

/**
 * Renders the list of tasks and displays them in the task container.
 * 
 * Loops through the `todos` array and creates a task element for each task.
 * Each task includes the title, description, due date, and assigned contacts.
 * 
 * The task container's inner HTML is cleared before appending the new task elements.
 */
function renderTasks() {
    const taskContainer = document.getElementById('task_main');
    if (!taskContainer) return;
    taskContainer.innerHTML = '';
    todos.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description || 'No description'}</p>
            <p>Due: ${task.dueDate}</p>
            <div class="assigned-contacts">
                ${task.assignedContacts?.map(contact => `
                    <div class="contact-badge" style="background-color: ${contact.color}" title="${contact.name}">
                        ${contact.initials}
                    </div>
                `).join('') || ''}
            </div>
        `;
        taskContainer.appendChild(taskElement);
    });
}

/**
 * Opens the task editing overlay and populates it with the data of the task being edited.
 * 
 * If no task ID is provided, it hides the overlay and re-enables scrolling. 
 * Otherwise, it fills the overlay with the current task's details and disables scrolling on the page.
 * 
 * @param {string} taskId - The ID of the task to edit.
 */
async function editOverlay(taskId) {
    try {
        const overlayRef = document.getElementById('edit_overlay');
        if (!overlayRef) {
            console.error('Edit overlay element not found');
            return;
        }
        if (!taskId) {
            closeEditOverlay();
            return;
        }
        closeOverlayBoard();
        const originalTask = todos.find(t => t.id === taskId);
        if (!originalTask) {
            console.warn(`Task with ID ${taskId} not found`);
            return;
        }
        currentTask = JSON.parse(JSON.stringify(originalTask));
        const overlayHTML = getOverlayEdit(currentTask);
        if (!overlayHTML.includes('inner_content')) {
            console.error('HTML template is missing inner_content container');
            return;
        }
        overlayRef.classList.remove('edit_none');
        overlayRef.innerHTML = overlayHTML;
        document.body.classList.add('no-scroll');
        await new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });
        const initElements = () => {
            const overlayContent = overlayRef.querySelector('.inner_content');
            if (!overlayContent) {
                console.error('Overlay content container not found in DOM after render');
                console.debug('Rendered HTML:', overlayHTML);
                return;
            }
            overlayContent.addEventListener('click', editProtection);
            const contactInput = document.getElementById('editContactInput');
            if (contactInput) {
                contactInput.value = '';
            }
            const okButton = overlayRef.querySelector('.ok_button');
            if (okButton) {
                okButton.addEventListener('click', saveChanges);
            }
        };
        await populateDropdown();
        initElements();
        overlayRef.addEventListener('click', (e) => {
            if (e.target === overlayRef) closeEditOverlay();
        });
    } catch (error) {
        console.error('Error in editOverlay:', error);
        closeEditOverlay();
    }
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

/**
 * Closes the edit overlay and cleans up related state
 */
function closeEditOverlay() {
    const overlayRef = document.getElementById('edit_overlay');
    if (!overlayRef) return;
    overlayRef.classList.add('edit_none');
    document.body.classList.remove('no-scroll');
    overlayRef.innerHTML = '';
    if (window.currentTask) {
        delete window.currentTask;
    }
    if (typeof updateHTML === "function") {
        updateHTML();
    }
}