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

    const subtasksHTML = Object.entries(task.subtasks || {}).map(([id, subtask]) => {
        const title = (typeof subtask === 'string') ? subtask : (subtask.title || '');
        const isEditing = editSubtasks[id]?.isEditing || false;
    
        if (isEditing) {
            
            return `
                <div class="subTaskEdit" data-subtask-id="${id}">
                    <div class="leftContainerSubTask left_container_overlay">
                        <input type="text" id="edit_input${id}" value="${title}" class="subTaskEditInput subtask_input_overlay">
                    </div>
                    <div class="rightContainerSubTask">
                        <div>
                            <img class="subTaskDeleteButtonInput" onclick="deleteSubTaskOverlay('${id}')" src="../assets/icons/delete.png" alt="Delete">
                        </div>
                        <div class="partingLine"></div>
                        <div>
                            <img class="subTaskSaveButton" onclick="saveSubTask('${id}')" src="../assets/icons/check.png" alt="Save">
                        </div>
                    </div>
                </div>
            `;
        } else {
            
            return `
                <div class="subTask" data-subtask-id="${id}">
                    <div class="leftContainerSubTask">
                        <ul class="subTaskListContainer">
                            <li class="listSubTask"><span>${title}</span></li>
                        </ul>
                    </div>
                    <div class="rightContainerSubTask">
                        <div class="subTaskButtons">
                            <img class="subTaskEditButton" onclick="editSubTask('${id}')" src="../assets/icons/edit.png" alt="Edit">
                            <div class="partingLine"></div>
                            <img class="subTaskDeleteButton" onclick="deleteSubTaskOverlay('${id}')" src="../assets/icons/delete.png" alt="Delete">
                        </div>
                    </div>
                </div>
            `;
        }
    }).join('');
    
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

                ${priorityHTML}

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


                
                
                <section class="subtask_container">
                    <div class="subtask_input_container">
                        <span class="subtasks_headline">Subtasks</span>
                        <div class="subtask_input">
                            <div style="width: 100%;">
                                <input onclick="showEditSubtaskContainerOverlay()"
                                onkeydown="if(event.key == 'Enter') addNewEditSubtaskOverlay()" 
                                id="edit_subtask_input"
                                class="input_subtask" 
                                type="text" 
                                placeholder="Add new subtask">
                            </div>
                            <div id="edit_add_subtask_container" class="add_subtask_container no-hover">
                                <img onclick="showEditSubtaskContainerOverlay()" 
                                id="edit_show_subtask_container"
                                class="add_subtask_img" 
                                src="../assets/icons/Subtasks_add.png">
                                <div id="edit_add_delete_container" class="add_delete_container">
                                    <div class="delete_btn">
                                        <img onclick="deleteEditText()" 
                                        src="../assets/icons/subtask=close.png">
                                    </div>
                                    <div class="divider_line_subtask"></div>
                                        <div class="add_btn">
                                            <img onclick="addNewEditText(event)" 
                                            id="edit_add_new_text_button"
                                            src="../assets/icons/subtask=check.png">
                                    </div>
                                </div>
                            </div>
                        </div>
                <div class="added_text" id="edit_added_text">
                    ${subtasksHTML}
                </div>
            </div>
        </section>

                
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

function editProtection (event) {
    event.stopPropagation();
}







let editSubtasks = {};

function showEditSubtaskContainerOverlay() {
    let edit_show_subtask_container = document.getElementById('edit_show_subtask_container');
    let edit_add_delete_container = document.getElementById('edit_add_delete_container');
    let edit_add_subtask_container = document.querySelector('.add_subtask_container');
    let edit_subtask_input = document.getElementById('edit_subtask_input');
    if (!edit_add_delete_container || !edit_add_subtask_container) return;
    edit_add_delete_container.classList.add('visible');
    edit_show_subtask_container.style.display = 'none';
    edit_add_subtask_container.classList.add('no-hover');
    edit_subtask_input.addEventListener('click', edit_show_subtask_container);
}

function deleteEditText() {
    document.getElementById('edit_subtask_input').value = '';
}

  function addNewEditText(event) {
    const input = document.getElementById('edit_subtask_input');
    const title = input.value.trim();
    if (!title) return;
    const subtaskId = `subtask-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    editSubtasks[subtaskId] = {
        title: title,
        completed: false
    };
    input.value = '';
    renderSubtasksOverlay();
    if (event && event.type === 'click') {
        document.getElementById('edit_add_delete_container').classList.remove('visible');
        document.getElementById('edit_show_subtask_container').style.display = 'block';
        document.querySelector('.add_subtask_container').classList.remove('no-hover');
    }
}

function editSubTask(id) {
    if (editSubtasks[id]) {
        editSubtasks[id].isEditing = true;
        renderSubtasksOverlay();
    }
}
function addNewEditText(event) {
    const input = document.getElementById('edit_subtask_input');
    const title = input.value.trim();
    if (!title) return;
    const subtaskId = `subtask-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    editSubtasks[subtaskId] = {
        title: title,
        completed: false,
        isEditing: false
    };

    // Sync with currentTask
    currentTask.subtasks = { ...editSubtasks };

    input.value = '';
    renderSubtasksOverlay();
    if (event && event.type === 'click') {
        document.getElementById('edit_add_delete_container').classList.remove('visible');
        document.getElementById('edit_show_subtask_container').style.display = 'block';
        document.querySelector('.add_subtask_container').classList.remove('no-hover');
    }
}
/*
function addNewEditText(event) {
    const input = document.getElementById('edit_subtask_input');
    const title = input.value.trim();
    if (!title) return;
    const subtaskId = `subtask-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    editSubtasks[subtaskId] = {
        title: title,
        completed: false,
        isEditing: false
    };
    input.value = '';
    renderSubtasksOverlay();
    if (event && event.type === 'click') {
        document.getElementById('edit_add_delete_container').classList.remove('visible');
        document.getElementById('edit_show_subtask_container').style.display = 'block';
        document.querySelector('.add_subtask_container').classList.remove('no-hover');
    }
}*/

function renderEditMode(id, subtask) {
    return `
        <div class="subTaskEdit" data-subtask-id="${id}">
            <div class="leftContainerSubTask left_container_overlay">
                <input type="text" id="edit_input${id}" value="${subtask.title}" class="subTaskEditInput subtask_input_overlay">
            </div>
            <div class="rightContainerSubTask">
                <div>
                    <img class="subTaskDeleteButtonInput" onclick="deleteSubTaskOverlay('${id}')" src="../assets/icons/delete.png" alt="Delete">
                </div>
                <div class="partingLine"></div>
                <div>
                    <img class="subTaskSaveButton" onclick="saveSubTask('${id}')" src="../assets/icons/check.png" alt="Save">
                </div>
            </div>
        </div>
    `;
}

function renderViewMode(id, subtask) {
    return `
        <div class="subTask" data-subtask-id="${id}">
            <div class="leftContainerSubTask">
                <ul class="subTaskListContainer">
                    <li class="listSubTask"><span>${subtask.title}</span></li>
                </ul>
            </div>
            <div class="rightContainerSubTask">
                <div class="subTaskButtons">
                    <img class="subTaskEditButton" onclick="editSubTask('${id}')" src="../assets/icons/edit.png" alt="Edit">
                    <div class="partingLine"></div>
                    <img class="subTaskDeleteButton" onclick="deleteSubTaskOverlay('${id}')" src="../assets/icons/delete.png" alt="Delete">
                </div>
            </div>
        </div>
    `;
}

function renderSubtasksOverlay() {
    const container = document.getElementById('edit_added_text');
    if (!container) return;
    container.innerHTML = Object.entries(editSubtasks).map(([id, subtask]) => {
        return subtask.isEditing ? renderEditMode(id, subtask) : renderViewMode(id, subtask);
    }).join('');
}
function deleteSubTaskOverlay(subtaskId) {
    const subtaskElement = document.querySelector(`.subTask[data-subtask-id="${subtaskId}"]`);
    if (subtaskElement) {
        subtaskElement.classList.add('deleting');
        setTimeout(() => {
            delete editSubtasks[subtaskId];

            // Sync with currentTask
            currentTask.subtasks = { ...editSubtasks };

            renderSubtasksOverlay();
        }, 300);
    } else {
        console.error(`Subtask with ID ${subtaskId} not found.`);
    }
}


/*function deleteSubTaskOverlay(subtaskId) {
    const subtaskElement = document.querySelector(`.subTask[data-subtask-id="${subtaskId}"]`);
    if (subtaskElement) {
        subtaskElement.classList.add('deleting');
        setTimeout(() => {
            delete editSubtasks[subtaskId];
            renderSubtasksOverlay();
        }, 300);
    } else {
        console.error(`Subtask with ID ${subtaskId} not found.`);
    }
}*/

async function saveEditedTask(taskId) {
    const updatedTask = {
        ...currentTask,
        subtasks: editSubtasks
    };
    await updateData(`tasks/${taskId}`, updatedTask);
    fetchTasks();
}

function loadTaskForEdit(task) {
    editSubtasks = {};
    if (Array.isArray(task.subtasks)) {
        task.subtasks.forEach((subtask, index) => {
            const id = subtask.id || `subtask-${index}-${Date.now()}`;
            editSubtasks[id] = {
                title: subtask.title || subtask.name,
                completed: subtask.completed || false,
                isEditing: false
            };
        });
    } else if (task.subtasks && typeof task.subtasks === 'object') {
        Object.entries(task.subtasks).forEach(([id, subtask]) => {
            editSubtasks[id] = { ...subtask, isEditing: false };
        });
    }
    renderSubtasksOverlay();
}

function saveSubTask(id) {
    const input = document.getElementById(`edit_input${id}`);
    const newTitle = input.value.trim();

    if (newTitle) {
        editSubtasks[id].title = newTitle;
        editSubtasks[id].isEditing = false;

        // Sync with currentTask
        currentTask.subtasks = { ...editSubtasks };
        renderSubtasksOverlay();
    }
}









