

/**
 * Öffnet das Overlay und das Popup-Container, indem die Klasse 'd_none' entfernt wird.
 * 
 * @returns {void}
 */
function openOverlay() {
    document.getElementById('overlay').classList.remove('d_none');
    document.getElementById('popupContainer').classList.remove('d_none');
}

/**
 * Lädt den HTML-Inhalt aus addTask.html und fügt ihn in den Popup-Container ein.
 * 
 * @returns {Promise<void>} - Ein Promise, das aufgelöst wird, wenn der Inhalt geladen und eingefügt wurde.
 */
async function loadAddTaskContent() {
    try {
        const response = await fetch('../html/addTask.html');
        if (!response.ok) throw new Error('Failed to load addTask.html');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const addTaskContent = doc.querySelector('.content_container_size');
        if (addTaskContent) {
            document.getElementById('popupContainer').innerHTML = addTaskContent.outerHTML;
        }
    } catch (error) {
        console.error('Error loading addTask.html:', error);
    }
}

/**
 * Öffnet das Overlay und lädt den Aufgabeninhalt in den Popup-Container.
 * 
 * @returns {void}
 */
function addTask() {
    openOverlay();
    loadAddTaskContent();
}


/**
 * Schließt das Overlay und das Popup-Fenster.
 * Fügt die "d_none"-Klassen zu Overlay und Popup-Container hinzu,
 * um sie unsichtbar zu machen, und leert den Inhalt des Popup-Containers.
 *
 * @function
 * @returns {void}
 */
function closeOverlay() {
    document.getElementById('overlay').classList.add('d_none');
    document.getElementById('popupContainer').classList.add('d_none');
    document.getElementById('popupContainer').innerHTML = '';
}

