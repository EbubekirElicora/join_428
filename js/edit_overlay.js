async function editOverlay(taskId) {
    const overlayRef = document.getElementById('edit_overlay');
    if (!taskId) {
        overlayRef.classList.add('edit_none');
        document.body.classList.remove('no-scroll');
        return;
    }
    overlayBoard();
    const task = todos.find(t => t.id === taskId);
    if (!task) return;
    overlayRef.classList.remove('edit_none');
    overlayRef.innerHTML = getOverlayEdit(task);
    document.body.classList.add('no-scroll');
}


function getOverlayEdit(task) {

    const contactsHTML = task.assignedContacts?.slice(0, 5).map(contact => `
        <div class="contact-badge" style="background-color: ${contact.color}" title="${contact.name}">
            ${contact.initials}
        </div>
    `).join('') || '';
    
    const remainingContacts = task.assignedContacts?.length > 5 
        ? `<div class="remaining-contacts">+${task.assignedContacts.length - 5}</div>`
        : '';

    return `
        <div onclick="editProtection(event)" class="inner_content">
            <div class="edit_close">
                <h2>Bearbeiten der Aufgabe</h2>
                <img onclick="editOverlay()" src="/assets/icons/close.png" alt="">
            </div>

            <form id="edit_form">
                <label for="edit_title">Title</label>
               <input id="edit_title" value="${task.title}" type="text" required>
                <label for="edit_description">Description</label>
                <textarea id="edit_description">${task.description || ''}</textarea>
                <label for="edit_due_date">Due Date</label>
                <input value="${task.dueDate}" id="edit_due_date" type="date" required>




                <div class="assigned_container">
                    <div>
                        <label for="contactInput">Assigned to</label>
                    </div>
                    <div class="dropdown">
                        <div class="input-container">
                            <input type="text" id="contactInput" placeholder="Select contacts to assign" readonly>
                            <div class="icons">
                                <img src="../assets/icons/arrow_drop_down_icon.png"
                                     id="dropdownIcon" class="cursorPointer dropdownimg">
                                <img src="../assets/icons/arrow_drop_up_icon.png" id="dropdownIconUp"
                                        class="cursorPointer dropdownimg d-none">
                             </div>
                        </div>
                        <div class="dropdown-content" id="dropdownContent"></div>
                    </div>
                    <div id="selectedContactsInitials" class="selected-contacts-initials">
                         ${task.assignedContacts?.length > 0 ? `
                        <div class="assigned-contacts">
                            ${contactsHTML}
                            ${remainingContacts}
                        </div>
                ` : ''}
                    </div>
                </div>  






            </form>
        </div>
    `;
}

function getOverlayEdit(task) {
    const contactsHTML = task.assignedContacts?.slice(0, 5).map(contact => `
        <div class="contact-badge" style="background-color: ${contact.color}" title="${contact.name}">
            ${contact.initials}
        </div>
    `).join('') || '';
    
    const remainingContacts = task.assignedContacts?.length > 5 
        ? `<div class="remaining-contacts">+${task.assignedContacts.length - 5}</div>`
        : '';

    // Priority icons (reuse the same structure as in addTask HTML)
    const priorityIcons = {
        urgent: '<img src="../assets/icons/prio_urgent_icon.png">',
        medium: '<img src="../assets/icons/prio_medium_icon.png">',
        low: '<img src="../assets/icons/prio_low_icon.png">'
    };

    // Priority options (reuse the same structure as in addTask HTML)
    const priorityHTML = `
        <section class="prio_container">
            <label for="prio">Priority</label>
            <div class="prio_btn_container">
                <button onclick="setPrio('urgent')" type="button" id="prioUrgent" class="prioBtnUrgent ${task.priority === 'urgent' ? 'active' : ''}">
                    <span>Urgent</span>
                    ${priorityIcons['urgent']}
                </button>
                <button onclick="setPrio('medium')" type="button" id="prioMedium" class="prioBtnMedium ${task.priority === 'medium' ? 'active' : ''}">
                    <span>Medium</span>
                    ${priorityIcons['medium']}
                </button>
                <button onclick="setPrio('low')" type="button" id="prioLow" class="prioBtnLow ${task.priority === 'low' ? 'active' : ''}">
                    <span>Low</span>
                    ${priorityIcons['low']}
                </button>
            </div>
        </section>
    `;

    return `
        <div onclick="editProtection(event)" class="inner_content">
            <div class="edit_close">
                <h2>Bearbeiten der Aufgabe</h2>
                <img onclick="editOverlay()" src="/assets/icons/close.png" alt="">
            </div>

            <form id="edit_form">
                <label for="edit_title">Title</label>
                <input id="edit_title" value="${task.title}" type="text" required>

                <label for="edit_description">Description</label>
                <textarea id="edit_description">${task.description || ''}</textarea>

                <label for="edit_due_date">Due Date</label>
                <input value="${task.dueDate}" id="edit_due_date" type="date" required>

                <!-- Priority Section (reuse the same structure as in addTask HTML) -->
                ${priorityHTML}

                <!-- Assigned Contacts Section -->
                <div class="assigned_container">
                    <div class="dropdown">
                        <div class="input-container">
                            <input type="text" id="editContactInput" placeholder="Select contacts..." readonly>
                            <div class="icons">
                                <img onclick="toggleEditDropdown()" 
                                     src="../assets/icons/arrow_drop_down_icon.png"
                                     id="editDropdownIcon" 
                                     class="cursorPointer dropdownimg">
                                <img onclick="toggleEditDropdown()" src="../assets/icons/arrow_drop_up_icon.png" 
                                     id="editDropdownIconUp"
                                     class="cursorPointer dropdownimg d-none">
                            </div>
                        </div>
                        <div class="dropdown-content" id="editDropdownContent">
                            <div class="dropdown-item">
                                <div class="contact-info">
                                    <div class="contact-initials-container">${task.initials}</div>
                                    <span class="contact-name">${task.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="selectedContactsInitials" class="selected-contacts-initials">
                        ${task.assignedContacts?.length > 0 ? `
                            <div class="assigned-contacts">
                                ${contactsHTML}
                                ${remainingContacts}
                            </div>
                        ` : ''}
                    </div>
                </div>  

                <!-- Buttons Section -->
                <div class="edit_buttons">
                    <button type="button" class="ok_button">OK</button>
                </div>
            </form>
        </div>
    `;
}
// ich habe die folgenden fuctionen rein gemacht:
function handlePrioritySelection(event, priority) {
    event.stopPropagation(); // Prevent event bubbling to avoid conflicts
    currentTask.priority = priority;

    // Update the UI to reflect the selected priority
    const priorityOptions = document.querySelectorAll('.priority-option');
    priorityOptions.forEach(option => {
        if (option.getAttribute('onclick').includes(priority)) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}
function setPrio(priority) {
    // Update the currentTask priority
    currentTask.priority = priority;

    // Update the UI to reflect the selected priority
    const priorityButtons = document.querySelectorAll('.prio_btn_container button');
    priorityButtons.forEach(button => {
        if (button.getAttribute('onclick').includes(priority)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}
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

function selectEditContact(contactName) {
    const selectedContactsInitials = document.getElementById('selectedContactsInitials');
    const contactInput = document.getElementById('editContactInput');
    const contact = contacts.find(c => c.name === contactName);

    if (contact && selectedContactsInitials && contactInput) {
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

        const selectedNames = currentTask.assignedContacts.map(c => c.name).join(', ');
        contactInput.value = selectedNames;
    }
}

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

async function editOverlay(taskId) {
    const overlayRef = document.getElementById('edit_overlay');
    if (!taskId) {
        overlayRef.classList.add('edit_none');
        document.body.classList.remove('no-scroll');
        return;
    }

    overlayBoard();
    currentTask = todos.find(t => t.id === taskId);
    if (!currentTask) return;

    overlayRef.classList.remove('edit_none');
    overlayRef.innerHTML = getOverlayEdit(currentTask);
    document.body.classList.add('no-scroll');

    const contactInput = document.getElementById('editContactInput');
    if (contactInput && currentTask.assignedContacts) {
        const selectedNames = currentTask.assignedContacts.map(c => c.name).join(', ');
        contactInput.value = selectedNames;
    }

    await populateDropdown();

    const okButton = overlayRef.querySelector('.ok_button');
    if (okButton) {
        okButton.addEventListener('click', saveChanges);
    }
}
async function saveChanges() {
    // Get the updated values from the edit form
    const title = document.getElementById('edit_title').value;
    const description = document.getElementById('edit_description').value;
    const dueDate = document.getElementById('edit_due_date').value;

    // Update the currentTask object
    currentTask.title = title;
    currentTask.description = description;
    currentTask.dueDate = dueDate;

    // Update the todos array
    const taskIndex = todos.findIndex(t => t.id === currentTask.id);
    if (taskIndex !== -1) {
        todos[taskIndex] = currentTask;
    }

    // Save changes to Firebase
    try {
        const response = await fetch(`${BASE_URL}/tasks/${currentTask.id}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentTask),
        });

        if (!response.ok) throw new Error("Failed to save changes to Firebase");

        // Re-render the UI to reflect the changes
        updateHTML();

        // Close the edit overlay
        editOverlay();
    } catch (error) {
        console.error("Error saving changes to Firebase:", error);
    }
}

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



async function editOverlay(taskId) {
    const overlayRef = document.getElementById('edit_overlay');
    if (!taskId) {
        overlayRef.classList.add('edit_none');
        document.body.classList.remove('no-scroll');
        updateHTML(); // Re-render the UI when the overlay is closed
        return;
    }

    overlayBoard();
    currentTask = todos.find(t => t.id === taskId);
    if (!currentTask) return;

    overlayRef.classList.remove('edit_none');
    overlayRef.innerHTML = getOverlayEdit(currentTask);
    document.body.classList.add('no-scroll');

    const contactInput = document.getElementById('editContactInput');
    if (contactInput && currentTask.assignedContacts) {
        const selectedNames = currentTask.assignedContacts.map(c => c.name).join(', ');
        contactInput.value = selectedNames;
    }

    await populateDropdown();

    const okButton = overlayRef.querySelector('.ok_button');
    if (okButton) {
        okButton.addEventListener('click', saveChanges);
    }
}
// hier,  die Ende


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



function editProtection (event) {
    event.stopPropagation();
}