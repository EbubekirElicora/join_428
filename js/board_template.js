function normalizeSubtasks(subtasks) {
    if (Array.isArray(subtasks)) {
        return subtasks.reduce((acc, subtask, index) => {
            const id = subtask.id || `subtask-${index}-${Date.now()}`;
            acc[id] = typeof subtask === 'string' 
                ? { title: subtask, completed: false } 
                : subtask;
            return acc;
        }, {});
    }
    return subtasks || {};
  }



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

    return `
        <div draggable="true" onclick="overlayBoard('${task.id}')" ondragstart="startDragging('${task.id}')" class="task">
            <div class="category bg_${task.category}">${task.category}</div>
            <h2>${task.title}</h2>
            <p>${task.description || ''}</p>
            <div class="progress_container">
                <div class="progress_bar">
                    <div class="progress_fill" style="width:${progress}%"></div>
                </div>
                <div class="subtasks_counter">${done}/${total} Subtasks</div>
            </div>
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
    const normalizedSubtasks = normalizeSubtasks(task.subtasks);
    const subtasksHTML = Object.entries(normalizedSubtasks).map(([subtaskId, subtask]) => {
        const title = subtask.title || "Untitled";
        const completed = subtask.completed || false;

        return `
            <div class="subtask_item" data-subtask-id="${subtaskId}" onclick="toggleSubtask('${task.id}', '${subtaskId}')">
                <img src="/assets/icons/contact_icon_${completed ? 'check' : 'uncheck'}.png" 
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
                <img onclick="overlayBoard()" src="../assets/icons/close.png" alt="">
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
                    <img src="/assets/icons/edit.png" alt="">
                    <p>Edit</p>
                </button>
                <div class="shadow_box"></div>
                <button onclick="deleteTask('${task.id}')" class="img_p">
                    <img src="/assets/icons/delete.png" alt="">
                    <p>Delete</p>
                </button>
            </div>
        </div>
    `;
}