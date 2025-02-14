
/**
 * Basis-URL für die Firebase-Datenbank.
 */
const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Zeigt das Overlay an oder schließt es, je nach Zustand.
 * Wenn das Overlay sichtbar ist, wird es geschlossen. Wenn es geschlossen ist, wird es angezeigt.
 * 
 * @returns {void} - Keine Rückgabe.
 */
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

/**
 * Gibt den HTML-Inhalt für das Overlay zurück.
 * 
 * @returns {string} - Der HTML-Inhalt für das Overlay.
 */
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

/**
 * Verhindert das Schließen des Overlays, wenn auf das innere Overlay geklickt wird.
 * 
 * @param {Event} event - Das Ereignisobjekt des Klicks.
 */
function overlayProtection(event) {
    event.stopPropagation();
}
