

function addTask() {
    document.getElementById('overlay').classList.remove('d_none');
    document.getElementById('popupContainer').classList.remove('d_none');
    fetch('../html/addTask.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const addTaskContent = doc.querySelector('.content_container_size');
            if (addTaskContent) {
                document.getElementById('popupContainer').innerHTML = addTaskContent.outerHTML;
            }
        })
        .catch(error => console.error('Error loading addTask.html:', error));
}

function closeOverlay() {
    document.getElementById('overlay').classList.add('d_none');
    document.getElementById('popupContainer').classList.add('d_none');
    document.getElementById('popupContainer').innerHTML = '';
}

