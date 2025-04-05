function generateTodoHTML(task) {
    const priorityIcons = {
        urgent: '<img src="../assets/icons/prio_urgent_icon.png" alt="">',
        medium: '<img src="../assets/icons/prio_media.png" alt="">',
        low: '<img src="../assets/icons/prio_low_icon.png" alt="">'
    };
    const contactsHTML = task.assignedContacts?.slice(0, 5).map(contact => `
        <div class="contact-badge" style="background-color: ${contact.color}" title="${contact.name}">
            ${contact.initials}
        </div>
    `).join('') || '';

    const remainingContacts = task.assignedContacts?.length > 5
        ? `<div class="remaining-contacts">+${task.assignedContacts.length - 5}</div>`
        : '';
    const subtasks = task.subtasks || {};
    const subtaskKeys = Object.keys(subtasks);
    const total = subtaskKeys.length;
    const done = subtaskKeys.filter(key => subtasks[key].completed).length;
    const progress = total > 0 ? (done / total) * 100 : 0;
    const progressHTML = total > 0 ? `
        <div id="progress_container" class="progress_container">
            <div class="progress_bar">
                <div class="progress_fill" style="width:${progress}%"></div>
            </div>
            <div class="subtasks_counter">${done}/${total} Subtasks</div>
        </div>
    ` : '';

    return `
        <div draggable="true"
            data-task-id="${task.id}" 
            onclick="overlayBoard('${task.id}')" 
            ondragstart="startDragging('${task.id}')"
            ontouchstart="handleTouchStart(event, '${task.id}')"
            ontouchmove="handleTouchMove(event)"
            ontouchend="handleTouchEnd(event)"
            class="task">
            <div class="category bg_${task.category}">${task.category}</div>
            <h2 class="title_find">${task.title}</h2>
            <p class="description_find">${task.description || ''}</p>
             ${progressHTML}
            <div class="priority_contact">
                ${task.assignedContacts?.length > 0 ? `
                    <div class="assigned-contacts">
                        ${contactsHTML}
                        ${remainingContacts}
                    </div>
                ` : ''}
                <span class="priority">${priorityIcons[task.priority]}</span>   
            </div>
        </div>
    `;
}

function getOverlayHtml(task) {
    const priorityIcons = {
        urgent: '<img src="../assets/icons/prio_urgent_icon.png" class="priority-icon" alt="Urgent">',
        medium: '<img src="../assets/icons/prio_media.png" class="priority-icon" alt="Medium">',
        low: '<img src="../assets/icons/prio_low_icon.png" class="priority-icon" alt="Low">'
    };

    const contactsHTML = task.assignedContacts?.map(contact => `
        <div class="contact_item ">
            <div class="contact-badge" style="background-color: ${contact.color}">
                ${contact.initials}
            </div>
            <p class="contact_name">${contact.name}</p>
        </div>
    `).join('') || '<div class="no-contacts">No contacts assigned</div>';
    const subtasksHTML = Object.entries(task.subtasks || {}).map(([subtaskId, subtask]) => {
        const normalizedSubtask = typeof subtask === 'string'
            ? { title: subtask, completed: false }
            : subtask;
        const title = normalizedSubtask.title || "Untitled";
        const completed = normalizedSubtask.completed;

        return `
            <div class="subtask_item" data-subtask-id="${subtaskId}" onclick="toggleSubtask('${task.id}', '${subtaskId}')">
                <img src="../assets/icons/contact_icon_${completed ? 'check' : 'uncheck'}.png" 
                     class="subtask-icon" 
                     alt="${completed ? 'Completed' : 'Uncompleted'}">
                <span>${title}</span>
            </div>
        `;
    }).join('') || '<div class="no-subtasks">No subtasks</div>';

    return `
        <div onclick="overlayProtection(event)" class="inner_content">
            <div class="header_board_overlay">
                <div class="header_category bg_${task.category}">${task.category}</div>
                <img onclick="closeOverlayBoard()" src="../assets/icons/close.png" alt="">
            </div>
            <h1>${task.title}</h1>
            <p class="board_overlay_description">${task.description || ''}</p>
            <div class="date_olerlay">
                <p>Due Date:</p>
                <p>${task.dueDate}</p>
            </div>
            <div class="priority_overlay">
                <p>Priority:</p>
                <div class="priority_icons">
                    <p>${task.priority}</p>
                    <span> ${priorityIcons[task.priority]}</span>
                </div>
            </div>
            <div class="contact_overlay">
                <p>Assigned To:</p>
                <div class="contacts_list">
                    ${contactsHTML}
                </div>
            </div>

            <div class="subtasks_overlay">
                <p>Subtasks:</p>
                <div class="subtasks_list">
                    ${subtasksHTML}
                </div>
            </div>

            <div class="buttons">
                <button onclick="editOverlay('${task.id}')" class="img_p">
                    <img src="../assets/icons/edit.png" alt="">
                    <p>Edit</p>
                </button>
                <div class="shadow_box"></div>
                <button onclick="deleteTask('${task.id}')" class="img_p">
                    <img src="../assets/icons/delete.png" alt="">
                    <p>Delete</p>
                </button>
            </div>
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

    const priorityIcons = {
        urgent: '<img src="../assets/icons/prio_urgent_icon.png">',
        medium: '<img src="../assets/icons/prio_medium_icon.png">',
        low: '<img src="../assets/icons/prio_low_icon.png">'
    };

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
    if (!window.contacts) window.contacts = [];

    // MODIFIED CONTACT DROPDOWN SECTION
    
// In getOverlayEdit template
const contactsDropdownHTML = contacts.map(contact => {
    const isChecked = task.assignedContacts?.some(c => c.name === contact.name);
    return `
    <div class="edit-contact-item" data-contact="${contact.name}">
        <div class="contact-content">
            <div class="contact-info">
                <div class="contact-initials" style="background-color: ${contact.color}">
                    ${contact.initials}
                </div>
                <span class="contact-name">${contact.name}</span>
            </div>
            <div class="custom-checkbox ${isChecked ? 'checked' : ''}" 
                 style="background-image: url('../assets/icons/${isChecked ? 'checked' : 'unchecked'}.png')">
            </div>
        </div>
    </div>
    `;
}).join('');

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
                            <img class="subTaskSaveButton" onclick="saveSubTaskOverlay('${id}')" src="../assets/icons/check.png" alt="Save">
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
                            <img class="subTaskEditButton" onclick="editSubTaskOverlay('${id}')" src="../assets/icons/edit.png" alt="Edit">
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
                <img onclick="closeEditOverlay()" src="../assets/icons/close.png" alt="">
            </div>

            <form onclick="closeEditDropdown()" id="edit_form">
                <label for="edit_title">Title</label>
                <input id="edit_title" value="${task.title}" type="text" required
                    onblur="if(this.value.trim() === '') this.value='${task.title}';">

                <label for="edit_description">Description</label>
                <textarea id="edit_description">${task.description || ''}</textarea>

                <label for="edit_due_date">Due Date</label>
                <input onclick="getDateTodayEdit()" value="${task.dueDate}" id="edit_due_date" type="date" required>

                ${priorityHTML}

                <div class="assigned_container">
                    <div class="dropdown">
                        <div class="input-container">
                            <input class="pointer" onclick="toggleEditDropdown(event)" type="text" id="editContactInput" placeholder="Select contacts to assign" readonly>
                            <div class="icons">
                                <img onclick="toggleEditDropdown(event)"
                                     src="../assets/icons/arrow_drop_down_icon.png"
                                     id="editDropdownIcon" 
                                     class="cursorPointer dropdownimg">
                                <img src="../assets/icons/arrow_drop_up_icon.png" 
                                     id="editDropdownIconUp"
                                     class="cursorPointer dropdownimg d-none">
                            </div>
                        </div>
                        <div class="dropdown-content" id="editDropdownContent">
                            ${contactsDropdownHTML}
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
                            <div id="edit_add_subtask_container" class="add_subtask_container">
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



function renderEditMode(id, subtask) {
    return `
        <div class="subTaskEdit" data-subtask-id="${id}">
            <div class="leftContainerSubTask left_container_overlay">
                <input type="text" id="edit_input${id}" value="${subtask.title}" class="subTaskEditInput subtask_input_overlay">
            </div>
            <div class="rightContainerSubTask">
                <div>
                    <img class="subTaskDeleteButton" onclick="deleteSubTaskOverlay('${id}')" src="../assets/icons/delete.png" alt="Delete">
                </div>
                <div class="partingLine"></div>
                <div>
                    <img class="subTaskSaveButton" onclick="saveSubTaskOverlay('${id}')" src="../assets/icons/check.png" alt="Save">
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
                    <img class="subTaskEditButton" onclick="editSubTaskOverlay('${id}')" src="../assets/icons/edit.png" alt="Edit">
                    <div class="partingLine"></div>
                    <img class="subTaskDeleteButton" onclick="deleteSubTaskOverlay('${id}')" src="../assets/icons/delete.png" alt="Delete">
                </div>
            </div>
        </div>
    `;
}