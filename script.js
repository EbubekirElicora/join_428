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
 * Initialisiert das Dropdown-Menü und fügt Ereignishandler hinzu, um das Dropdown anzuzeigen oder auszublenden.
 * 
 * Diese Funktion setzt Ereignisse auf das Dropdown-Symbol und das umgekehrte Dropdown-Symbol:
 * 1. Zeigt das Dropdown-Menü an, wenn eines der Symbole geklickt wird.
 * 2. Blendet das Dropdown-Menü aus, wenn außerhalb des Dropdowns oder der Symbole geklickt wird.
 * 3. Wechselt das Dropdown-Symbol zwischen zwei Zuständen (auf und ab).
 * 
 * @function initializeDropdown
 */
function initializeDropdown() {
    const dropdownIcon = document.getElementById('dropdownIcon');
    const dropdownIconUp = document.getElementById('dropdownIconUp');
    const dropdownContent = document.getElementById('dropdownContent');
    if (dropdownIcon && dropdownIconUp && dropdownContent) {
        dropdownIcon.addEventListener('click', toggleDropdown);
        dropdownIconUp.addEventListener('click', toggleDropdown);
        document.addEventListener('click', (event) => {
            if (!dropdownContent.contains(event.target) &&
                !dropdownIcon.contains(event.target) &&
                !dropdownIconUp.contains(event.target)) {
                dropdownContent.style.display = 'none';
                dropdownIcon.classList.remove('d-none');
                dropdownIconUp.classList.add('d-none');
            }
        });
    } else {
        console.error('Dropdown elements not found!');
    }
}

/**
 * Schaltet das Dropdown-Menü um, zeigt es an oder blendet es aus.
 * Diese Funktion überprüft den aktuellen Anzeigestatus des Dropdowns und wechselt diesen.
 * 
 * 1. Wenn das Dropdown-Menü sichtbar ist, wird es ausgeblendet.
 * 2. Wenn das Dropdown-Menü nicht sichtbar ist, wird es angezeigt.
 * 3. Wechselt das Dropdown-Symbol (nach oben und nach unten) je nach Status des Menüs.
 * 
 * @function toggleDropdown
 */
function toggleDropdown() {
    const dropdownContent = document.getElementById('dropdownContent');
    const dropdownIcon = document.getElementById('dropdownIcon');
    const dropdownIconUp = document.getElementById('dropdownIconUp');
    if (!dropdownContent || !dropdownIcon || !dropdownIconUp) return;
    if (dropdownContent.style.display === 'block') {
        dropdownContent.style.display = 'none';
        dropdownIcon.classList.remove('d-none');
        dropdownIconUp.classList.add('d-none');
    } else {
        dropdownContent.style.display = 'block';
        dropdownIcon.classList.add('d-none');
        dropdownIconUp.classList.remove('d-none');
    }
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
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            const taskData = collectTaskData();
            const isValid = validateTaskForm(taskData.title, taskData.dueDate, taskData.category); 
            if (isValid) {
                const savedTask = await saveTaskToFirebase(taskData);
                if (savedTask) {
                    window.location.href = "/html/board.html";
                } else {
                    alert('Failed to create task. Please try again.');
                }
            }
        });
    }
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
    const title = document.getElementById('title')?.value.trim();
    const category = document.getElementById('select_txt')?.textContent.trim();
    const dueDate = document.getElementById('date')?.value.trim();
    const priority = getSelectedPriority();
    const assignedContacts = selectedContacts;
    const subtasksArray = subtasks;
    const stage = 'todo';
    return createTask(title, category, dueDate, priority, assignedContacts, subtasksArray, stage);
}

/**
 * Erstellt eine neue Aufgabe mit den angegebenen Daten.
 * Diese Funktion erstellt ein Aufgabenobjekt mit einem eindeutigen ID (auf Grundlage der aktuellen Zeit),
 * der Titel, Kategorie, das Fälligkeitsdatum, die Priorität, zugewiesene Kontakte, Unteraufgaben und den Status der Aufgabe.
 * 
 * Der Standardwert für den Status ist 'todo', wenn er nicht angegeben wird.
 * 
 * @param {string} title - Der Titel der Aufgabe.
 * @param {string} category - Die Kategorie der Aufgabe (z.B. 'Technical Task', 'User Story').
 * @param {string} dueDate - Das Fälligkeitsdatum der Aufgabe.
 * @param {string} priority - Die Priorität der Aufgabe.
 * @param {Array} assignedContacts - Die Kontakte, die der Aufgabe zugewiesen sind.
 * @param {Array} subtasksArray - Ein Array von Unteraufgaben.
 * @param {string} [stage='todo'] - Der Status der Aufgabe (Standardwert ist 'todo').
 * 
 * @returns {Object} Das erstellte Aufgabenobjekt.
 * @function createTask
 */
function createTask(title, category, dueDate, priority, assignedContacts, subtasksArray, stage = 'todo') {
    const newTask = {
        id: Date.now().toString(),
        title,
        category,
        dueDate,
        priority,
        stage, // Default to 'todo' if not provided
        assignedContacts,
        subtasks: subtasksArray.reduce((acc, title, index) => {
            acc[index] = {
                title: title,
                completed: false
            };
            return acc;
        }, {})
    };
    return newTask;
}

/**
 * Setzt das Formular für die Erstellung einer neuen Aufgabe zurück.
 * Diese Funktion löscht die Werte und Textinhalte aller relevanten Felder im Formular,
 * einschließlich des Titels, der Beschreibung, des Fälligkeitsdatums, der Kategorie, der hinzugefügten Texte,
 * der zugewiesenen Kontakte und der Unteraufgaben.
 * 
 * @function resetForm
 */
function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    document.getElementById('select_txt').textContent = 'Select task category';
    document.getElementById('added_text').innerHTML = '';
    
    document.getElementById('contactInput').value = '';
    document.getElementById('selectedContactsInitials').innerHTML = '';
    subtasks = [];
}

/**
 * Speichert die Aufgaben-Daten in Firebase Realtime Database.
 * Diese Funktion sendet die Aufgaben-Daten an Firebase, um sie dort zu speichern.
 * Wenn der Speichervorgang erfolgreich ist, gibt sie die gespeicherten Daten zurück,
 * andernfalls gibt sie null zurück.
 * 
 * @param {Object} taskData - Die zu speichernden Aufgaben-Daten.
 * @returns {Promise<Object|null>} Die gespeicherten Daten von Firebase oder null im Fehlerfall.
 * @function saveTaskToFirebase
 */
async function saveTaskToFirebase(taskData) {
    const BASE_URL = 'https://join-428-default-rtdb.europe-west1.firebasedatabase.app/';
    const TASKS_ENDPOINT = 'tasks.json';
    try {
        const response = await fetch(`${BASE_URL}${TASKS_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        if (!response.ok) {
            throw new Error('Failed to save task to Firebase');
        }
        const data = await response.json();
        console.log('Task saved successfully:', data);
        return data;
    } catch (error) {
        console.error('Error saving task:', error);
        return null;
    }
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
}