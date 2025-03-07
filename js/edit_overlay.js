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
            <h1>HALLO</h1>
        </div>
    `;
}




function editProtection (event) {
    event.stopPropagation();
}