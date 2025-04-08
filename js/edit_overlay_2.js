/**
 * Öffnet das Bearbeitungs-Overlay und befüllt es mit den Aufgaben-Daten.
 * Falls keine Task-ID übergeben wird, schließt sich das Overlay.
 * @param {string} taskId - Die ID der zu bearbeitenden Aufgabe
 * @async
 */
async function editOverlay(taskId) {
    if (!taskId) return closeEditOverlay();
    try {
        await setupEditOverlay(taskId);
    } catch (error) {
        console.error('Fehler in editOverlay:', error);
        closeEditOverlay();
    }
}

/**
 * Initialisiert das Bearbeitungs-Overlay mit den notwendigen Daten und Elementen
 * @param {string} taskId - Die ID der zu bearbeitenden Aufgabe
 * @async
 */
async function setupEditOverlay(taskId) {
    const overlayRef = getOverlayElement();
    if (!overlayRef) return;
    closeOverlayBoard();
    currentTask = await loadTaskData(taskId);
    if (!currentTask) return;
    renderOverlayContent(overlayRef, currentTask);
    document.body.classList.add('no-scroll');
    await initOverlayElements(overlayRef);
}

/**
 * Holt das Overlay-Element aus dem DOM
 * @returns {HTMLElement|null} Das Overlay-Element oder null falls nicht gefunden
 */
function getOverlayElement() {
    const overlayRef = document.getElementById('edit_overlay');
    if (!overlayRef) console.error('Overlay-Element nicht gefunden');
    return overlayRef;
}

/**
 * Lädt die Aufgaben-Daten basierend auf der Task-ID
 * @param {string} taskId - Die ID der zu ladenden Aufgabe
 * @returns {Object|null} Kopie der Aufgaben-Daten oder null falls nicht gefunden
 */
async function loadTaskData(taskId) {
    const originalTask = todos.find(t => t.id === taskId);
    if (!originalTask) console.warn(`Aufgabe mit ID ${taskId} nicht gefunden`);
    return JSON.parse(JSON.stringify(originalTask));
}

/**
 * Rendert den Inhalt des Overlays mit den Aufgaben-Daten
 * @param {HTMLElement} overlayRef - Das Overlay-Element
 * @param {Object} task - Die Aufgaben-Daten
 */
function renderOverlayContent(overlayRef, task) {
    const overlayHTML = getOverlayEdit(task);
    if (!overlayHTML.includes('inner_content')) {
        console.error('HTML-Template enthält keinen inner_content Container');
        return;
    }
    overlayRef.classList.remove('edit_none');
    overlayRef.innerHTML = overlayHTML;
}

/**
 * Initialisiert alle notwendigen Overlay-Elemente und Event-Listener
 * @param {HTMLElement} overlayRef - Das Overlay-Element
 * @async
 */
async function initOverlayElements(overlayRef) {
    await populateDropdown();
    const overlayContent = overlayRef.querySelector('.inner_content');
    if (!overlayContent) return;
    
    overlayContent.addEventListener('click', editProtection);
    setupContactInput();
    setupSaveButton(overlayRef);
    setupOverlayClickHandler(overlayRef);
}

/**
 * Setzt das Kontakt-Eingabefeld zurück
 */
function setupContactInput() {
    const contactInput = document.getElementById('editContactInput');
    if (contactInput) contactInput.value = '';
}

/**
 * Fügt den Event-Listener zum Speichern-Button hinzu
 * @param {HTMLElement} overlayRef - Das Overlay-Element
 */
function setupSaveButton(overlayRef) {
    const okButton = overlayRef.querySelector('.ok_button');
    if (okButton) okButton.addEventListener('click', saveChanges);
}

/**
 * Fügt den Klick-Handler für das Overlay hinzu (Schließen bei Klick außerhalb)
 * @param {HTMLElement} overlayRef - Das Overlay-Element
 */
function setupOverlayClickHandler(overlayRef) {
    overlayRef.addEventListener('click', (e) => {
        if (e.target === overlayRef) closeEditOverlay();
    });
}

/**
 * Closes the edit overlay and restores the original state.
 * - Hides the overlay by adding a CSS class.
 * - Enables scrolling on the page again.
 * - Clears the content of the overlay.
 * - Removes a global `currentTask` variable if it exists.
 * - Updates the UI if `updateHTML` is defined.
 */
function closeEditOverlay() {
    const overlayRef = document.getElementById('edit_overlay');
    if (!overlayRef) return;
    overlayRef.classList.add('edit_none');
    document.body.classList.remove('no-scroll');
    overlayRef.innerHTML = '';
    if (window.currentTask) {
        delete window.currentTask;
    }
    if (typeof updateHTML === "function") {
        updateHTML();
    }
}

/**
 * Initialisiert das Datumseingabefeld und setzt Validierungsregeln.
 * - Setzt das minimale Datum auf den aktuellen Tag.
 * - Fügt Echtzeit-Validierung bei Eingabe hinzu.
 * - Passt die Textfarbe basierend auf der Gültigkeit des Datums an.
 * @function
 * @returns {void}
 */
function getDateTodayEdit() {
    let dateInput = document.getElementById('edit_due_date');
    if (dateInput) {
        const today = new Date();
        const localDate = today.toLocaleDateString('en-CA');
        dateInput.min = localDate;
        dateInput.addEventListener('input', function () {
            validateDate(this);
            updateDateColor.call(this);
        });
        updateDateColor.call(dateInput);
    }
}

/**
 * Validiert das eingegebene Datum und korrigiert es falls nötig.
 * @param {HTMLInputElement} input - Das Datumseingabefeld.
 */
function validateDate(input) {
    const { correctedDate, needsUpdate } = checkAndCorrectDate(input.value);
    if (needsUpdate) {
        input.value = formatDate(correctedDate);
    }
}

/**
 * Überprüft und korrigiert das Datum.
 * @param {string} dateString - Das zu prüfende Datum.
 * @returns {Object} Objekt mit korrigiertem Datum und Update-Flag.
 */
function checkAndCorrectDate(dateString) {
    const currentDate = new Date();
    const selectedDate = new Date(dateString);
    const maxYear = 2999; 
    if (isNaN(selectedDate.getTime())) {
        return { correctedDate: currentDate, needsUpdate: true };
    }
    const correctedDate = adjustDateLimits(selectedDate, currentDate, maxYear);
    return {
        correctedDate,
        needsUpdate: dateString !== formatDate(correctedDate)
    };
}

/**
 * Passt das Datum an die Grenzwerte an.
 * @param {Date} date - Zu prüfendes Datum.
 * @param {Date} currentDate - Aktuelles Datum.
 * @param {number} maxYear - Maximal erlaubtes Jahr.
 * @returns {Date} Korrigiertes Datum.
 */
function adjustDateLimits(date, currentDate, maxYear) {
    const correctedDate = new Date(date);
    if (correctedDate.getFullYear() > maxYear) {
        correctedDate.setFullYear(maxYear);
    }
    if (correctedDate < currentDate) {
        correctedDate.setTime(currentDate.getTime());
    }
    return correctedDate;
}

/**
 * Formatiert das Datum als 'YYYY-MM-DD'.
 * @param {Date} date - Zu formatierendes Datum.
 * @returns {string} Formatiertes Datum.
 */
function formatDate(date) {
    return date.toLocaleDateString('en-CA');
}

/**
 * Aktualisiert die Textfarbe des Eingabefelds:
 * - Schwarz für gültige Daten.
 * - Grau (#D1D1D1) für ungültige oder leere Werte.
 * @function
 * @returns {void}
 */
function updateDateColor() {
    const isValidDate = !isNaN(new Date(this.value));
    this.style.color = isValidDate ? 'black' : '#D1D1D1';
}