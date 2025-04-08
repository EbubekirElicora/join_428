/**
 * Initialisiert die erforderlichen Komponenten auf der Seite für das Hinzufügen einer Aufgabe.
 * Diese Funktion richtet das Datum, Dropdown-Menüs, das Aufgabenkategoriefeld und andere UI-Elemente ein.
 * 
 * 1. Setzt das heutige Datum.
 * 2. Initialisiert die Dropdown-Menüs.
 * 3. Initialisiert den Kategorieselector für Aufgaben.
 * 4. Konfiguriert das Aufgabenformular.
 * 5. Fügt einen Ereignishandler hinzu, um das Eingabefeld für Unteraufgaben auszublenden, wenn außerhalb des Eingabebereichs geklickt wird.
 * 6. Lädt die Liste der Kontakte.
 * 
 * @function initAddTask
 */
function initAddTask() {
    getDateToday();
    initializeDropdown();
    initializeCategorySelector();
    initializeTaskForm();
    hideInputSubTaksClickContainerOnOutsideClick();
    loadContacts();
}

/**
 * This function sets the button to activated
 * 
 * @param {string} priority - The priority level to set
 */
function setPrio(prio) {
    document.querySelectorAll('.prioBtnUrgent, .prioBtnMedium, .prioBtnLow').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.prioBtn${prio.charAt(0).toUpperCase() + prio.slice(1)}`).classList.add('active');
}

/**
 * Setzt das minimale Datum des Date-Inputs auf das heutige Datum.
 * 
 * Diese Funktion setzt das `min` Attribut des Date-Input-Feldes auf das heutige Datum, 
 * damit der Benutzer nur Daten ab dem heutigen Datum auswählen kann.
 * 
 * @function getDateToday
 */
function getDateToday() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }
}

/**
 * Initialisiert das Dropdown-Menü und fügt Event-Listener für das Öffnen und Schließen hinzu.
 * Diese Funktion wird nach dem Laden des DOMs aufgerufen.
 */
document.addEventListener('DOMContentLoaded', () => {
    const dropdownContent = document.getElementById('dropdownContent');
    if (!dropdownContent) {
        return;
    }
    initializeDropdown();
});

/**
 * Initialisiert das Dropdown-Menü mit allen Event-Listenern
 */
function initializeDropdown() {
    const dropdownContent = getDropdownElement();
    if (!dropdownContent) return; 
    setupToggleListeners();
    setupCloseListener(dropdownContent);
}

/**
 * Holt das Dropdown-Element aus dem DOM
 * @returns {HTMLElement|null} Dropdown-Content Element
 */
function getDropdownElement() {
    return document.getElementById('dropdownContent');
}

/**
 * Setzt die Event-Listener für das Öffnen/Schließen des Dropdowns
 */
function setupToggleListeners() {
    const elements = [
        document.getElementById('dropdownIcon'),
        document.getElementById('dropdownIconUp'), 
        document.getElementById('contactInput')
    ];
    elements.forEach(element => {
        if (element) {
            element.addEventListener('click', handleToggleClick);
        }
    });
}

/**
 * Handler für Klick-Events zum Öffnen/Schließen
 * @param {Event} event - Klick-Event
 */
function handleToggleClick(event) {
    event.stopPropagation();
    toggleDropdown();
}

/**
 * Setzt den Event-Listener zum Schließen bei Klicks außerhalb
 * @param {HTMLElement} dropdownContent - Dropdown-Container
 */
function setupCloseListener(dropdownContent) {
    document.addEventListener('click', (event) => {
        if (!dropdownContent.contains(event.target)) {
            closeDropdown();
        }
    });
}

/**
 * Wechselt die Anzeige des Dropdowns: Öffnet es, wenn es geschlossen ist, und schließt es, wenn es geöffnet ist.
 */
function toggleDropdown() {
    const dropdownContent = document.getElementById('dropdownContent');
    const dropdownIcon = document.getElementById('dropdownIcon');
    const dropdownIconUp = document.getElementById('dropdownIconUp');
    if (!dropdownContent || !dropdownIcon || !dropdownIconUp) return;
    const isOpen = dropdownContent.style.display === 'block';
    if (isOpen) {
        closeDropdown();
    } else {
        dropdownContent.style.display = 'block';
        dropdownIcon.classList.add('d-none');
        dropdownIconUp.classList.remove('d-none');
    }
}

/**
 * Schließt das Dropdown und setzt die Icons zurück.
 */
function closeDropdown() {
    const dropdownContent = document.getElementById('dropdownContent');
    const dropdownIcon = document.getElementById('dropdownIcon');
    const dropdownIconUp = document.getElementById('dropdownIconUp');
    if (!dropdownContent || !dropdownIcon || !dropdownIconUp) return;
    dropdownContent.style.display = 'none';
    dropdownIcon.classList.remove('d-none');
    dropdownIconUp.classList.add('d-none');
}

/**
 * Initialisiert den Kategorien-Selektor, indem ein Klick-Ereignis auf das Element hinzugefügt wird.
 * Beim Klicken wird das Dropdown für die Kategorien angezeigt oder ausgeblendet.
 * 
 * @function initializeCategorySelector
 */
function initializeCategorySelector() {
    const categorySelect = document.getElementById('category_select');
    if (categorySelect) {
        categorySelect.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleCategoryDropdown();
        });
    }
}

/**
 * Schaltet das Kategorien-Dropdown um, zeigt es an oder blendet es aus.
 * Wenn das Dropdown leer ist, wird es mit den verfügbaren Kategorien befüllt.
 * 
 * 1. Wenn das Dropdown-Menü nicht sichtbar ist oder leer ist, wird es angezeigt und mit den Kategorien "Technical Task" und "User Story" gefüllt.
 * 2. Wenn das Dropdown-Menü bereits sichtbar ist, wird es ausgeblendet.
 * 
 * @function toggleCategoryDropdown
 */
function toggleCategoryDropdown() {
    let dropdown = document.getElementById("category_dropdown");
    if (dropdown) {
        if (dropdown.style.display === "none" || dropdown.style.display === "") {
            if (dropdown.innerHTML.trim() === "") {
                dropdown.innerHTML = `
                    <div class="select_category" onclick="selectCategory('Technical Task')">Technical Task</div>
                    <div class="select_category" onclick="selectCategory('User Story')">User Story</div>
                `;
            }
            dropdown.style.display = "block";
        } else {
            dropdown.style.display = "none";
        }
    }
}

/**
 * Wählt eine Kategorie aus und zeigt sie im Dropdown-Auswahlbereich an.
 * Diese Funktion aktualisiert den Text des angezeigten Kategorieauswahlbereichs
 * und blendet das Dropdown-Menü aus.
 * 
 * @param {string} category - Die ausgewählte Kategorie, die im Dropdown angezeigt wird.
 * @function selectCategory
 */
function selectCategory(category) {
    document.getElementById("select_txt").innerText = category;
    document.getElementById("category_dropdown").style.display = "none";
}

/**
 * Öffnet oder schließt das Kategorien-Dropdown-Menü.
 * Diese Funktion verwendet die CSS-Klasse "visible", um das Dropdown-Menü anzuzeigen oder auszublenden.
 * 
 * Wenn das Dropdown-Element nicht gefunden wird, wird eine Fehlermeldung in der Konsole ausgegeben.
 * 
 * @function to_open_category_dropdown
 */
function to_open_category_dropdown() {
    let dropdown = document.getElementById("category_dropdown");
    if (dropdown) {
        dropdown.classList.toggle("visible");
    } else {
        console.error("Dropdown element with id 'category_dropdown' not found!");
    }
}

/**
 * Initialisiert das Aufgabenformular, sobald die DOM-Inhalte vollständig geladen sind.
 * Diese Funktion wird aufgerufen, wenn das 'DOMContentLoaded'-Ereignis ausgelöst wird.
 * 
 * @function initializeTaskForm
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeTaskForm();
});

/**
 * Initialisiert das Aufgabenformular, indem ein Klick-Ereignis auf die Schaltfläche "Create Task" hinzugefügt wird.
 * Wenn der Benutzer auf die Schaltfläche klickt, wird das Formular überprüft und die Aufgabe im Firebase-Datenbank gespeichert.
 * 
 * 1. Verhindert das Standardverhalten des Buttons (Seitenaktualisierung).
 * 2. Sammelt die Aufgabeninformationen aus dem Formular.
 * 3. Überprüft die gesammelten Daten.
 * 4. Speichert die Aufgabe in Firebase, wenn die Daten gültig sind.
 * 5. Leitet den Benutzer auf das Board weiter, wenn die Aufgabe erfolgreich gespeichert wurde.
 * 6. Zeigt eine Fehlermeldung an, wenn das Speichern der Aufgabe fehlschlägt.
 * 
 * @function initializeTaskForm
 */
function initializeTaskForm() {
    const createTaskBtn = document.getElementById('createTaskBtn');
    if (!createTaskBtn) return;
    createTaskBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        const taskData = collectTaskData();
        if (!taskData) return;
        const savedTask = await saveTaskToFirebase(taskData);
        if (savedTask) {
            resetForm();
            window.location.href = "../html/board.html";
        } else {
            alert('Failed to create task. Please try again.');
        }
    });
}

/**
 * Sammelt die Daten für die Aufgabe aus den Formularfeldern.
 * Diese Funktion liest die Eingabewerte und gibt ein Aufgabenobjekt zurück.
 * 
 * 1. Holt sich den Titel, die Kategorie, das Fälligkeitsdatum, die Priorität, die zugewiesenen Kontakte und die Unteraufgaben.
 * 2. Setzt den Status der Aufgabe auf "todo".
 * 3. Gibt das Aufgabenobjekt zurück.
 * 
 * @returns {Object} Das Aufgabenobjekt mit allen gesammelten Informationen.
 * @function collectTaskData
 */
function collectTaskData() {
    const title = document.getElementById('title')?.value?.trim();
    const category = document.getElementById('select_txt')?.textContent?.trim();
    const dueDate = document.getElementById('date')?.value?.trim();
    const priority = getSelectedPriority();
    const assignedContacts = selectedContacts || [];
    const subtasksArray = subtasks || [];
    const stage = 'todo';
    return createTask(title, category, dueDate, priority, assignedContacts, subtasksArray, stage);
}

/**
 * Erstellt ein neues Aufgabenobjekt mit Standardwerten
 * @param {string} title - Titel der Aufgabe
 * @param {string} category - Kategorie der Aufgabe
 * @param {string} dueDate - Fälligkeitsdatum
 * @param {string} priority - Prioritätsstufe
 * @param {Array} assignedContacts - Zugewiesene Kontakte
 * @param {Array} subtasksArray - Unteraufgaben
 * @param {string} [stage='todo'] - Status (default: 'todo')
 * @returns {Object} Neues Aufgabenobjekt
 */
function createTask(title, category, dueDate, priority, assignedContacts, subtasksArray, stage = 'todo') {
    return {
        id: generateTaskId(),
        title,
        category,
        dueDate,
        priority,
        stage,
        assignedContacts,
        subtasks: createSubtasksObject(subtasksArray)
    };
}

/**
 * Generiert eine eindeutige Task-ID
 * @returns {string} Timestamp als ID
 */
function generateTaskId() {
    return Date.now().toString();
}

/**
 * Erstellt ein Unteraufgaben-Objekt
 * @param {Array} subtasksArray - Array von Unteraufgaben-Titeln
 * @returns {Object} Unteraufgaben als Objekt
 */
function createSubtasksObject(subtasksArray) {
    return subtasksArray.reduce((acc, title, index) => {
        acc[index] = createSubtask(title);
        return acc;
    }, {});
}

/**
 * Erstellt ein einzelnes Unteraufgaben-Objekt
 * @param {string} title - Titel der Unteraufgabe
 * @returns {Object} Unteraufgabe mit Standardwerten
 */
function createSubtask(title) {
    return {
        title: title,
        completed: false
    };
}

/**
 * Speichert Aufgaben-Daten in Firebase
 * @param {Object} taskData - Zu speichernde Daten
 * @returns {Promise<Object|null>} Gespeicherte Daten oder null
 */
async function saveTaskToFirebase(taskData) {
    try {
        const response = await postTaskData(taskData);
        return handleSuccessResponse(response);
    } catch (error) {
        return handleFirebaseError(error);
    }
}

/**
 * Sendet POST-Request an Firebase
 * @param {Object} taskData - Zu speichernde Daten
 * @returns {Promise<Response>} Server-Response
 */
async function postTaskData(taskData) {
    const BASE_URL = 'https://join-428-default-rtdb.europe-west1.firebasedatabase.app/';
    const TASKS_ENDPOINT = 'tasks.json';
    return await fetch(`${BASE_URL}${TASKS_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
    });
}

/**
 * Verarbeitet erfolgreiche Response
 * @param {Response} response - Server-Response
 * @returns {Promise<Object>} JSON-Daten
 */
async function handleSuccessResponse(response) {
    if (!response.ok) throw new Error('Failed to save task to Firebase');
    
    const data = await response.json();
    console.log('Task saved successfully:', data);
    return data;
}

/**
 * Verarbeitet Firebase-Fehler
 * @param {Error} error - Fehlerobjekt
 * @returns {null} Immer null
 */
function handleFirebaseError(error) {
    console.error('Error saving task:', error);
    return null;
}

/**
 * Schließt das Overlay und das Popup-Fenster.
 * Diese Funktion blendet das Overlay und das Popup-Fenster aus, indem sie die entsprechenden
 * Klassen hinzufügt, die das Element unsichtbar machen.
 * 
 * @function closeOverlay
 */
function closeOverlay() {
    const overlay = document.getElementById('overlay');
    const popupContainer = document.getElementById('popup_container');
    overlay.classList.add('d_none');
    popupContainer.classList.add('d_none');
    resetAll();
}




