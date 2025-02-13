

function addTask() {
    let overlayRef = document.getElementById('overlay');
    if (!overlayRef) {
        return;
    }
    if (!overlayRef.classList.contains('d_none')) {
        overlayRef.classList.add('d_none');
        return;
    }
    overlayRef.innerHTML = getOverlayHtml();
    overlayRef.classList.remove('d_none');
}

function getOverlayHtml() {
    return `
        <div onclick="overlayProtection(event)" class="inner_content">
            <div class="overlay_header">
                <h2>Add Task</h2>
                <img onclick="addTask()" class="close_icon" src="../assets/icons/close.png" alt="">
            </div>
        </div>
    `;
}

function overlayProtection(event) {
    event.stopPropagation();
}
