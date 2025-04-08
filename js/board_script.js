/**
 * Lädt Kontakte und zeigt sie im Dropdown an
 */
async function loadContacts() {
    const dropdownContent = getDropdownContent();
    if (!dropdownContent) return;
    
    setupDropdownCloseHandler(dropdownContent);
    const contactsData = await loadData('contacts');
    renderContacts(dropdownContent, contactsData);
}

/**
 * Holt das Dropdown-Container-Element aus dem DOM
 * @returns {HTMLElement|null} Dropdown-Container oder null falls nicht gefunden
 */
function getDropdownContent() {
    const dropdownContent = document.getElementById('dropdownContent');
    if (!dropdownContent) console.error('Dropdown content element not found!');
    return dropdownContent;
}

/**
 * Setzt den Event-Handler zum Schließen des Dropdowns bei Klick außerhalb
 * @param {HTMLElement} dropdownContent - Das Dropdown-Container-Element
 */
function setupDropdownCloseHandler(dropdownContent) {
    document.addEventListener('click', (event) => {
        if (!dropdownContent.contains(event.target)) {
            dropdownContent.style.display = 'none';
        }
    });
}

/**
 * Rendert die Kontaktliste im Dropdown
 * @param {HTMLElement} dropdownContent - Container-Element
 * @param {Object|null} contactsData - Kontaktdaten oder null
 */
function renderContacts(dropdownContent, contactsData) {
    dropdownContent.innerHTML = '';
    if (!contactsData) {
        dropdownContent.innerHTML = '<div class="dropdown-item">No contacts available</div>';
        return;
    }
    Object.values(contactsData).forEach(contact => {
        createContactElement(dropdownContent, contact);
    });
}

/**
 * Erstellt ein einzelnes Kontakt-Element
 * @param {HTMLElement} dropdownContent - Container-Element
 * @param {Object} contact - Kontaktdaten
 */
function createContactElement(dropdownContent, contact) {
    const contactDiv = document.createElement('div');
    contactDiv.classList.add('dropdown-item');
    contactDiv.innerHTML = getContactHTML(contact);
    const checkbox = contactDiv.querySelector('.contact-checkbox');
    setupContactClickHandler(contactDiv, checkbox, contact);
    setupCheckboxHandler(contactDiv, checkbox, contact);
    dropdownContent.appendChild(contactDiv);
}

/**
 * Generiert HTML für einen Kontakt-Eintrag
 * @param {Object} contact - Kontaktdaten
 * @returns {string} HTML-String
 */
function getContactHTML(contact) {
    return `
        <div class="contact-info">
            <div class="contact-initials-container" style="background-color: ${getRandomColor()}">
                <div class="contact-initials">${getInitials(contact.name)}</div>
            </div>
            <span class="contact-name">${contact.name}</span>
        </div>
        <input type="checkbox" class="contact-checkbox">
    `;
}

/**
 * Setzt den Klick-Handler für Kontakt-Elemente
 * @param {HTMLElement} contactDiv - Kontakt-Element
 * @param {HTMLInputElement} checkbox - Checkbox-Element
 */
function setupContactClickHandler(contactDiv, checkbox) {
    contactDiv.addEventListener('click', (event) => {
        event.stopPropagation();
        if (event.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        }
    });
}

/**
 * Setzt den Change-Handler für Kontakt-Checkboxen
 * @param {HTMLElement} contactDiv - Kontakt-Element
 * @param {HTMLInputElement} checkbox - Checkbox-Element
 * @param {Object} contact - Kontaktdaten
 */
function setupCheckboxHandler(contactDiv, checkbox, contact) {
    checkbox.addEventListener('change', () => {
        handleContactSelection(contactDiv, checkbox, contact);
    });
}

/**
 * Verarbeitet die Auswahl/Deselektion eines Kontakts
 * @param {HTMLElement} contactDiv - Kontakt-Element
 * @param {HTMLInputElement} checkbox - Checkbox-Element
 * @param {Object} contact - Kontaktdaten
 */
function handleContactSelection(contactDiv, checkbox, contact) {
    if (checkbox.checked) {
        contactDiv.classList.add('selected-contact-item');
        addSelectedContact(contact);
    } else {
        contactDiv.classList.remove('selected-contact-item');
        removeSelectedContact(contact);
    }
    updateSelectedContacts();
}

/**
 * Fügt einen Kontakt zur Auswahlliste hinzu
 * @param {Object} contact - Kontaktdaten
 */
function addSelectedContact(contact) {
    if (!selectedContacts.find(c => c.name === contact.name)) {
        selectedContacts.push(contact);
    }
}

/**
 * Entfernt einen Kontakt von der Auswahlliste
 * @param {Object} contact - Kontaktdaten
 */
function removeSelectedContact(contact) {
    selectedContacts = selectedContacts.filter(c => c.name !== contact.name);
}

/**
 * Wählt einen Kontakt aus und fügt ihn zur Liste der ausgewählten Kontakte hinzu.
 * Wenn der Kontakt bereits ausgewählt ist, wird keine Änderung vorgenommen.
 * 
 * @param {Object} contact - Der Kontakt, der ausgewählt werden soll.
 * @param {string} contact.name - Der Name des Kontakts.
 * @function selectContact
 */
function selectContact(contact) {
    if (!selectedContacts.find(c => c.name === contact.name)) {
        selectedContacts.push(contact);
        updateSelectedContacts();
        console.log('Contact selected:', contact.name);
    } else {
        console.log('Contact already selected:', contact.name);
    }

}

/**
 * Aktualisiert die Anzeige der ausgewählten Kontakte
 */
function updateSelectedContacts() {
    const initialsContainer = getInitialsContainer();
    if (!initialsContainer) return;
    renderContactInitials(initialsContainer);
    renderRemainingContacts(initialsContainer);
}

/**
 * Holt den Container für Kontaktinitialen
 * @returns {HTMLElement|null} Initialen-Container oder null
 */
function getInitialsContainer() {
    return document.getElementById('selectedContactsInitials');
}

/**
 * Rendert die Initialen der ausgewählten Kontakte
 * @param {HTMLElement} initialsContainer - Container-Element
 */
function renderContactInitials(initialsContainer) {
    initialsContainer.innerHTML = '';
    selectedContacts.slice(0, 5).forEach(contact => {
        initialsContainer.appendChild(createInitialElement(contact));
    });
}

/**
 * Erstellt ein Initialen-Element für einen Kontakt
 * @param {Object} contact - Kontaktdaten
 * @returns {HTMLElement} Initialen-Element
 */
function createInitialElement(contact) {
    const span = document.createElement('span');
    span.classList.add('contact-initial');
    span.innerHTML = `
        <div class="contact-initials-container" style="background-color: ${getRandomColor()}">
            <div class="contact-initials">${getInitials(contact.name)}</div>
        </div>
    `;
    return span;
}

/**
 * Rendert die Anzeige für zusätzliche Kontakte
 * @param {HTMLElement} initialsContainer - Container-Element
 */
function renderRemainingContacts(initialsContainer) {
    if (selectedContacts.length <= 5) return;
    
    const remainingDiv = document.createElement('div');
    remainingDiv.innerHTML = `<div class="remaining-contacts-board">+${selectedContacts.length - 5}</div>`;
    initialsContainer.appendChild(remainingDiv);
}

/**
 * Gibt die Initialen eines Namens zurück.
 * Der Name wird in Wörter aufgeteilt und es werden die ersten Buchstaben jedes Wortes genommen,
 * um die Initialen zu bilden. Die Initialen werden in Großbuchstaben zurückgegeben.
 * 
 * @param {string} name - Der Name, dessen Initialen zurückgegeben werden sollen.
 * @returns {string} - Die Initialen des Namens.
 * @function getInitials
 */
function getInitials(name) {
    if (!name) return ''; // Handle undefined or empty names
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
}

/**
 * Generiert eine zufällige Farbe im Hexadezimalformat.
 * Diese Funktion erstellt eine zufällige Farbe, die aus 6 Zeichen im Hexadezimalformat besteht,
 * und gibt diese als Farbwert zurück.
 * 
 * @returns {string} - Eine zufällige Hex-Farbe (z. B. '#F1A2B3').
 * @function getRandomColor
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Setzt das Aufgabenformular vollständig zurück
 */
function resetForm() {
    resetInputFields();
    resetCategorySelection();
    resetContactSelection();
    resetSubtasks();
    setPrio('medium');
}

/**
 * Setzt alle Eingabefelder zurück
 */
function resetInputFields() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    document.getElementById('contactInput').value = '';
}

/**
 * Setzt die Kategorieauswahl zurück
 */
function resetCategorySelection() {
    document.getElementById('select_txt').textContent = 'Select task category';
    document.getElementById('added_text').innerHTML = '';
}

/**
 * Setzt die Kontaktauswahl zurück
 */
function resetContactSelection() {
    selectedContacts = [];
    document.getElementById('selectedContactsInitials').innerHTML = '';
    document.querySelectorAll('.contact-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.remove('selected-contact-item');
    });
}

/**
 * Setzt die Unteraufgaben zurück
 */
function resetSubtasks() {
    subtasks = [];
}

/**
 * Resets all relevant values.
 * 
 * - Calls the `resetForm()` function to reset the form.
 * - Sets the priority to 'medium' by calling the `setPrio('medium')` function.
 */
function resetAllBoard() {
    loadContacts();
    resetForm();
    setPrio('medium');
}

