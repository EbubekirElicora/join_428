/**
 * Loads contacts and displays them in the dropdown.
 * @function loadContacts
 */
async function loadContacts() {
    const dropdownContent = getDropdownContent();
    if (!dropdownContent) return;  
    setupDropdownCloseHandler(dropdownContent);
    const contactsData = await loadData('contacts');
    renderContacts(dropdownContent, contactsData);
}

/**
 * Retrieves the dropdown container element from the DOM. 
 * @returns {HTMLElement|null} Dropdown container or null if not found.
 * @function getDropdownContent
 */
function getDropdownContent() {
    const dropdownContent = document.getElementById('dropdownContent');
    if (!dropdownContent) console.error('Dropdown content element not found!');
    return dropdownContent;
}

/**
 * Sets the event handler to close the dropdown when clicking outside.
 * @param {HTMLElement} dropdownContent - The dropdown container element.
 * @function setupDropdownCloseHandler
 */
function setupDropdownCloseHandler(dropdownContent) {
    document.addEventListener('click', (event) => {
        if (!dropdownContent.contains(event.target)) {
            dropdownContent.style.display = 'none';
        }
    });
}

/**
 * Renders the contact list inside the dropdown. 
 * @param {HTMLElement} dropdownContent - The dropdown container element.
 * @param {Object|null} contactsData - Contact data or null.
 * @function renderContacts
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
 * Creates a single contact element in the dropdown. 
 * @param {HTMLElement} dropdownContent - The dropdown container element.
 * @param {Object} contact - Contact data.
 * @function createContactElement
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
 * Generates HTML for a contact entry.
 * @param {Object} contact - Contact data.
 * @returns {string} HTML string.
 * @function getContactHTML
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
 * Sets the click handler for the contact element.
 * @param {HTMLElement} contactDiv - Contact element.
 * @param {HTMLInputElement} checkbox - Checkbox element.
 * @function setupContactClickHandler
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
 * Sets the change handler for the contact checkbox.
 * @param {HTMLElement} contactDiv - Contact element.
 * @param {HTMLInputElement} checkbox - Checkbox element.
 * @param {Object} contact - Contact data.
 * @function setupCheckboxHandler
 */
function setupCheckboxHandler(contactDiv, checkbox, contact) {
    checkbox.addEventListener('change', () => {
        handleContactSelection(contactDiv, checkbox, contact);
    });
}

/**
 * Handles selection/deselection of a contact. 
 * @param {HTMLElement} contactDiv - Contact element.
 * @param {HTMLInputElement} checkbox - Checkbox element.
 * @param {Object} contact - Contact data.
 * @function handleContactSelection
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
 * Adds a contact to the selection list. 
 * @param {Object} contact - Contact data.
 * @function addSelectedContact
 */
function addSelectedContact(contact) {
    if (!selectedContacts.find(c => c.name === contact.name)) {
        selectedContacts.push(contact);
    }
}

/**
 * Removes a contact from the selection list. 
 * @param {Object} contact - Contact data.
 * @function removeSelectedContact
 */
function removeSelectedContact(contact) {
    selectedContacts = selectedContacts.filter(c => c.name !== contact.name);
}

/**
 * Selects a contact and adds it to the list of selected contacts.
 * If the contact is already selected, nothing changes.
 * @param {Object} contact - The contact to select.
 * @param {string} contact.name - The name of the contact.
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
 * Updates the display of selected contacts.
 * @function updateSelectedContacts
 */
function updateSelectedContacts() {
    const initialsContainer = getInitialsContainer();
    if (!initialsContainer) return;
    renderContactInitials(initialsContainer);
    renderRemainingContacts(initialsContainer);
}

/**
 * Retrieves the container for contact initials. 
 * @returns {HTMLElement|null} Initials container or null if not found.
 * @function getInitialsContainer
 */
function getInitialsContainer() {
    return document.getElementById('selectedContactsInitials');
}

/**
 * Renders the initials of selected contacts. 
 * @param {HTMLElement} initialsContainer - The container element.
 * @function renderContactInitials
 */
function renderContactInitials(initialsContainer) {
    initialsContainer.innerHTML = '';
    selectedContacts.slice(0, 5).forEach(contact => {
        initialsContainer.appendChild(createInitialElement(contact));
    });
}

/**
 * Creates an element representing the initials of a contact. 
 * @param {Object} contact - Contact data.
 * @returns {HTMLElement} Element with contact initials.
 * @function createInitialElement
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
 * Renders the "+X" indicator for additional selected contacts beyond the first five.
 * @param {HTMLElement} initialsContainer - The container element.
 * @function renderRemainingContacts
 */
function renderRemainingContacts(initialsContainer) {
    if (selectedContacts.length <= 5) return;
    const remainingDiv = document.createElement('div');
    remainingDiv.innerHTML = `<div class="remaining-contacts-board">+${selectedContacts.length - 5}</div>`;
    initialsContainer.appendChild(remainingDiv);
}

/**
 * Returns the initials of a name.
 * The name is split into words and the first letter of each word is used
 * to build the initials, which are returned in uppercase. 
 * @param {string} name - The name to extract initials from.
 * @returns {string} - The initials in uppercase.
 * @function getInitials
 */
function getInitials(name) {
    if (!name) return ''; // Handle undefined or empty names
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
}

/**
 * Generates a random color in hexadecimal format.
 * This function returns a color string composed of 6 hexadecimal characters. 
 * @returns {string} - A random hex color (e.g., '#F1A2B3').
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
 * Fully resets the task form.
 * @function resetForm
 */
function resetForm() {
    resetInputFields();
    resetCategorySelection();
    resetContactSelection();
    resetSubtasks();
    setPrio('medium');
}

/**
 * Resets all input fields.
 * @function resetInputFields
 */
function resetInputFields() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    document.getElementById('contactInput').value = '';
}

/**
 * Resets the category selection.
 * @function resetCategorySelection
 */
function resetCategorySelection() {
    document.getElementById('select_txt').textContent = 'Select task category';
    document.getElementById('added_text').innerHTML = '';
}

/**
 * Resets the selected contacts.
 * @function resetContactSelection
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
 * Resets the subtasks.
 * @function resetSubtasks
 */
function resetSubtasks() {
    subtasks = [];
}

/**
 * Resets all relevant values on the board.
 * - Loads contacts.
 * - Resets the form via `resetForm()`.
 * - Sets priority to 'medium' via `setPrio('medium')`.
 * @function resetAllBoard
 */
function resetAllBoard() {
    loadContacts();
    resetForm();
    setPrio('medium');
}

