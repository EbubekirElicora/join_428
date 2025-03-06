
async function overlayBoard(taskId) {
    const overlayRef = document.getElementById('board_overlay');
    if (!taskId) {
        overlayRef.classList.add('d_none');
        document.body.classList.remove('no-scroll');
        return;
    }
    const task = todos.find(t => t.id === taskId);
    if (!task) return;
    overlayRef.classList.remove('d_none');
    overlayRef.innerHTML = getOverlayHtml(task);
    document.body.classList.add('no-scroll');
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
        const title = typeof subtask === 'string' ? subtask : subtask.title || "Untitled";
        const completed = typeof subtask === 'string' ? false : subtask.completed;
    
        return `
            <div class="subtask_item" onclick="toggleSubtask('${task.id}', '${subtaskId}')">
                <img src="../assets/icons/contact_icon_${completed ? 'check' : 'uncheck'}.png" 
                     class="subtask-icon" 
                     alt="${completed ? 'Completed' : 'Uncompleted'}">
                <span class="${completed ? 'completed' : ''}">${title}</span>
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
            
            
        </div>
    `;
}

window.toggleSubtask = async function(taskId, subtaskId) {
    try {
        const task = todos.find(t => t.id === taskId);
        if (!task || !task.subtasks || !task.subtasks[subtaskId]) return;
        task.subtasks[subtaskId].completed = !task.subtasks[subtaskId].completed;
        const icon = document.querySelector(`[onclick*="${subtaskId}"] .subtask-icon`);
        if (icon) {
            icon.src = `../assets/icons/contact_icon_${task.subtasks[subtaskId].completed ? 'check' : 'uncheck'}.png`;
        }
        const progressFill = document.querySelector(`[ondragstart*="${taskId}"] .progress_fill`);
        const counter = document.querySelector(`[ondragstart*="${taskId}"] .subtasks_counter`);
        
        if (progressFill && counter) {
            const total = Object.keys(task.subtasks).length;
            const done = Object.values(task.subtasks).filter(s => s.completed).length;
            progressFill.style.width = `${(done / total) * 100}%`;
            counter.textContent = `${done}/${total} Subtasks`;
        }

        await updateData(`tasks/${taskId}`, task);
    } catch (error) {
        console.error("Error:", error);
    }
};

todos.forEach(task => {
    if (task.subtasks) {
        Object.keys(task.subtasks).forEach(key => {
            if (typeof task.subtasks[key] === 'string') {
                task.subtasks[key] = {
                    title: task.subtasks[key],
                    completed: false
                };
            }
        });
    }
});

function calculateProgress(task) {
    const subtasks = Object.values(task.subtasks || {});
    if (subtasks.length === 0) return 0;
    return (subtasks.filter(s => s.completed).length / subtasks.length) * 100;
}

function getSubtasksCounter(task) {
    const subtasks = Object.values(task.subtasks || {});
    return `${subtasks.filter(s => s.completed).length} of ${subtasks.length} done`;
}

function overlayProtection (event) {
    event.stopPropagation();
}