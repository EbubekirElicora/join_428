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

                


            
        </div>
    `;
}




function editProtection (event) {
    event.stopPropagation();
}