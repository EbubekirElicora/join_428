
/**
 * Handles the priority selection for a task.
 * 
 * Sets the task's priority to the specified value and updates the UI to reflect the selection.
 * 
 * @param {Event} event - The event object for the priority selection click event.
 * @param {string} priority - The priority level to set for the task.
 */
function handlePrioritySelection(event, priority) {
    event.stopPropagation();
    currentTask.priority = priority;
    const priorityOptions = document.querySelectorAll('.priority-option');
    priorityOptions.forEach(option => {
        if (option.getAttribute('onclick').includes(priority)) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

/**
 * Sets the priority of the current task and updates the UI.
 * 
 * Adds the 'active' class to the selected priority button and removes it from the others.
 * 
 * @param {string} priority - The priority level to set for the current task.
 */
function setPrio(priority) {
    currentTask.priority = priority;
    const priorityButtons = document.querySelectorAll('.prio_btn_container button');
    priorityButtons.forEach(button => {
        if (button.getAttribute('onclick').includes(priority)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

/**
 * Fetches contacts from the database and returns them as an array.
 * 
 * @returns {Promise<Array>} A promise that resolves to an array of contact objects.
 */
async function fetchContacts() {
    try {
        const response = await fetch(`${BASE_URL}/contacts.json`);
        if (!response.ok) throw new Error("Failed to fetch contacts");
        const data = await response.json();
        contacts = [];
        for (const key in data) {
            contacts.push({ id: key, ...data[key] });
        }
        return contacts;
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return [];
    }
}

/**
 * Füllt das Dropdown-Menü mit Kontaktoptionen für das Bearbeiten-Fenster einer Aufgabe.
 * 
 * Das Dropdown zeigt eine Liste von Kontakten mit deren Initialen und Namen an.
 * Bereits zugewiesene Kontakte der aktuellen Aufgabe werden vorselektiert.
 * 
 * @async
 * @function populateDropdown
 * @returns {Promise<void>} - Verspricht, das Dropdown zu füllen, nachdem die Kontakte geladen wurden.
 */
async function populateDropdown() {
    await fetchContacts();
    const dropdownContent = document.getElementById('editDropdownContent');
    if (dropdownContent) dropdownContent.innerHTML = generateDropdownHTML();
}

/**
 * Generiert den HTML-Inhalt für das Dropdown-Menü basierend auf den Kontakten.
 * 
 * @function generateDropdownHTML
 * @returns {string} - Der generierte HTML-String für das Dropdown.
 */
function generateDropdownHTML() {
    return contacts.map(createDropdownItem).join('') || '';
}

/**
 * Erstellt ein einzelnes Dropdown-Element für einen Kontakt.
 * 
 * @function createDropdownItem
 * @param {Object} contact - Ein Kontaktobjekt mit Name, Initialen und Farbe.
 * @returns {string} - Der HTML-String für ein Dropdown-Element.
 */
function createDropdownItem(contact) {
    const isSelected = currentTask.assignedContacts?.some(c => c.name === contact.name);
    return `
        <div class="dropdown-item ${isSelected ? 'selected-contact-item' : ''}" 
             onclick="event.stopPropagation(); toggleCheckbox('${contact.name}')">
            ${createContactInfo(contact)}
            <input type="checkbox" id="contact-${contact.name}" class="contact-checkbox"
                ${isSelected ? 'checked' : ''}>
        </div>
    `;
}

/**
 * Erstellt den HTML-Code für die Anzeige der Kontaktinformationen.
 * 
 * @function createContactInfo
 * @param {Object} contact - Ein Kontaktobjekt mit Initialen, Name und Farbe.
 * @returns {string} - Der HTML-String für die Kontaktanzeige.
 */
function createContactInfo(contact) {
    return `
        <div class="contact-info">
            <div class="contact-initials-container" style="background-color: ${contact.color}">
                <div class="contact-initials">${contact.initials}</div>
            </div>
            <span class="contact-name">${contact.name}</span>
        </div>
    `;
}

/**
 * Schaltet das Kontrollkästchen eines Kontakts um und aktualisiert die Auswahl.
 * 
 * Falls der Kontakt ausgewählt wird, wird er zur Liste der zugewiesenen Kontakte hinzugefügt
 * und optisch hervorgehoben. Falls der Kontakt abgewählt wird, wird er entfernt und die 
 * Hervorhebung verschwindet.
 * 
 * @param {string} contactName - Der Name des Kontakts, der ausgewählt oder abgewählt wird.
 */
function toggleCheckbox(contactName) {
    const checkbox = document.getElementById(`contact-${contactName}`);
    if (!checkbox) return;
    checkbox.checked = !checkbox.checked;
    selectEditContact(contactName);
    const contactItem = checkbox.closest('.dropdown-item');
    if (contactItem) {
        contactItem.classList.toggle('selected-contact-item', checkbox.checked);
    }
}

/**
 * Wählt einen Kontakt zum Bearbeiten aus, fügt ihn hinzu oder entfernt ihn basierend auf der Checkbox.
 * @function
 * @param {string} contactName - Der Name des Kontakts, der bearbeitet werden soll.
 */
function selectEditContact(contactName) {
    const contact = contacts.find(c => c.name === contactName);
    if (!contact) return;
    const checkbox = document.getElementById(`contact-${contact.name}`);
    if (!checkbox) return;
    checkbox.checked ? addEditContact(contact) : removeEditContact(contact);
    clearEditContactInput();
}

/**
 * Fügt einen Kontakt zur Liste der zugewiesenen Kontakte der aktuellen Aufgabe hinzu.
 * @function
 * @param {Object} contact - Der Kontakt, der hinzugefügt werden soll.
 */

function addEditContact(contact) {
    if (!currentTask.assignedContacts) currentTask.assignedContacts = [];
    currentTask.assignedContacts.push(contact);
    const selectedContactsInitials = document.getElementById('selectedContactsInitials');
    if (selectedContactsInitials) {
        selectedContactsInitials.insertAdjacentHTML('beforeend', createEditContactBadge(contact));
    }
}

/**
 * Entfernt einen Kontakt aus der Liste der zugewiesenen Kontakte der aktuellen Aufgabe.
 * @function
 * @param {Object} contact - Der Kontakt, der entfernt werden soll.
 */
function removeEditContact(contact) {
    currentTask.assignedContacts = currentTask.assignedContacts.filter(c => c.name !== contact.name);
    document.querySelector(`.contact-badge[title="${contact.name}"]`)?.remove();
}

/**
 * Erstellt das HTML für ein Kontakt-Badge.
 * @function
 * @param {Object} contact - Der Kontakt, für den das Badge erstellt werden soll.
 * @returns {string} HTML-String des Badges.
 */
function createEditContactBadge(contact) {
    return `<div class="contact-badge" style="background-color: ${contact.color}" title="${contact.name}">
                ${contact.initials}
            </div>`;
}

/**
 * Leert das Eingabefeld für Kontakte.
 * @function
 */
function clearEditContactInput() {
    const contactInput = document.getElementById('editContactInput');
    if (contactInput) contactInput.value = '';
}

/**
 * Toggles the visibility of the dropdown for selecting contacts in the task editing overlay.
 * 
 * Shows or hides the dropdown menu, depending on its current state.
 */
function toggleEditDropdown(event) {
    event.stopPropagation();
    const dropdownContent = document.getElementById('editDropdownContent');
    const iconDown = document.getElementById('editDropdownIcon');
    const iconUp = document.getElementById('editDropdownIconUp');
    if (!dropdownContent || !iconDown || !iconUp) return;
    const isOpen = dropdownContent.style.display === 'block';
    if (isOpen) {
        closeEditDropdown();
    } else {
        dropdownContent.style.display = 'block';
        iconDown.classList.add('d-none');
        iconUp.classList.remove('d-none');
    }
}

/**
 * Schließt das Dropdown-Menü zur Kontaktauswahl und aktualisiert die UI-Elemente.
 * 
 * Führt folgende Aktionen durch:
 * - Versteckt den Dropdown-Inhalt
 * - Zeigt das "Nach-unten"-Pfeil-Icon an
 * - Versteckt das "Nach-oben"-Pfeil-Icon
 * 
 * @function closeEditDropdown
 * @returns {void} Gibt keinen Wert zurück
 */
function closeEditDropdown() {
    const dropdownContent = document.getElementById('editDropdownContent');
    const iconDown = document.getElementById('editDropdownIcon');
    const iconUp = document.getElementById('editDropdownIconUp');
    if (!dropdownContent || !iconDown || !iconUp) return;
    dropdownContent.style.display = 'none';
    iconDown.classList.remove('d-none');
    iconUp.classList.add('d-none');
}


/**
 * Speichert die Änderungen an einer Aufgabe im Bearbeitungs-Overlay.
 * Aktualisiert die Aufgabe in der UI und in der Datenbank.
 */
async function saveChanges() {
    if (!validateCurrentTask()) return;
    updateCurrentTaskFromInputs();
    updateTodosArray();
    try {
        await saveTaskToBackend();
        if (typeof updateHTML === "function") updateHTML();
        if (typeof editOverlay === "function") editOverlay();
    } catch (error) {
        console.error("❌ Fehler beim Speichern in Firebase:", error);
    }
}

/**
 * Prüft, ob currentTask gültig ist.
 * @returns {boolean} - true, wenn gültig, sonst false
 */
function validateCurrentTask() {
    if (!currentTask) return console.error("❌ Fehler: currentTask ist nicht definiert!"), false;
    if (!currentTask.id) return console.error("❌ Fehler: currentTask hat keine ID!"), false;
    return true;
}

/**
 * Holt die Werte aus den Eingabefeldern und aktualisiert currentTask.
 */
function updateCurrentTaskFromInputs() {
    currentTask.title = document.getElementById('edit_title')?.value || "";
    currentTask.description = document.getElementById('edit_description')?.value || "";
    currentTask.dueDate = document.getElementById('edit_due_date')?.value || "";
}

/**
 * Aktualisiert das todos-Array mit den Änderungen aus currentTask.
 */
function updateTodosArray() {
    const taskIndex = todos.findIndex(t => t.id === currentTask.id);
    if (taskIndex !== -1) {
        todos[taskIndex] = { ...currentTask };
    } else {
        console.warn("⚠️ Warnung: Task wurde in todos nicht gefunden!");
    }
}

/**
 * Speichert die aktuelle Aufgabe im Backend (Firebase).
 * @returns {Promise<Response>} - Die Antwort von fetch
 */
function saveTaskToBackend() {
    return fetch(`${BASE_URL}/tasks/${currentTask.id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTask),
    }).then(response => {
        if (!response.ok) throw new Error("Fehler beim Speichern in Firebase");
        return response;
    });
}

/**
 * Rendert die Liste der Aufgaben und zeigt sie im Aufgaben-Container an.
 */
function renderTasks() {
    const taskContainer = document.getElementById('task_main');
    if (!taskContainer) return;
    taskContainer.innerHTML = '';
    todos.forEach(task => {
        const taskElement = createTaskElement(task);
        taskContainer.appendChild(taskElement);
    });
}

/**
 * Erstellt ein DOM-Element für eine einzelne Aufgabe.
 * 
 * @param {Object} task - Die Aufgabe mit Titel, Beschreibung, Fälligkeitsdatum und Kontakten.
 * @returns {HTMLElement} - Das HTML-Element für die Aufgabe.
 */
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description || 'No description'}</p>
        <p>Due: ${task.dueDate}</p>
        <div class="assigned-contacts">
            ${renderAssignedContacts(task)}
        </div>
    `;
    return taskElement;
}

/**
 * Rendert die zugewiesenen Kontakte als HTML-String.
 * 
 * @param {Object} task - Die Aufgabe mit `assignedContacts`.
 * @returns {string} - HTML-String der Kontakt-Badges.
 */
function renderAssignedContacts(task) {
    return task.assignedContacts?.map(contact => `
        <div class="contact-badge" style="background-color: ${contact.color}" title="${contact.name}">
            ${contact.initials}
        </div>
    `).join('') || '';
}

/**
 * Prevents event propagation to stop event bubbling.
 * 
 * This is typically used to stop the event from triggering higher-level event listeners.
 * 
 * @param {Event} event - The event object that is triggered on the element.
 */
function editProtection(event) {
    event.stopPropagation();
}

