
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
            
        </div>
    `;
}

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