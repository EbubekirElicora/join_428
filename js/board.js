
/**
 * Öffnet das Popup-Fenster für das Hinzufügen einer Aufgabe.
 * Entfernt die "d_none"-Klassen von Overlay und Popup-Container,
 * um sie sichtbar zu machen. Lädt den Inhalt von 'addTask.html'
 * und fügt den entsprechenden Teil des HTML in den Popup-Container ein.
 *
 * @function
 * @async
 * @returns {void}
 */
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

