const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";

/**
* Generates initials from a given name.
* 
* @param {string} name - The full name of the contact.
* @returns {string} - The initials of the name.
*/
function getInitials(name) {
    if (!name || typeof name !== 'string') return '';
    return name.split(' ')
        .filter(part => part.length > 0)
        .map(part => part[0])
        .join('')
        .toUpperCase();
}

/**
 * Generates a random hex color code.
* 
* @returns {string} - A random hex color code.
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
 * Saves a contact to Firebase.
 * 
 * @param {object} contact - The contact object to save.
 * @returns {Promise} - A promise that resolves with the saved contact data.
 */
function saveContact(contact) {
    return fetch(`${BASE_URL}/contacts.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            throw error;
        });
}

/**
 * Fetches contacts from Firebase.
 * 
 * @returns {Promise<Array>} - A promise that resolves with an array of contacts.
 */
function fetchContacts() {
    return fetch(`${BASE_URL}/contacts.json`)
        .then(response => response.json())
        .then(data => {
            const contacts = [];
            for (const key in data) {
                contacts.push({ id: key, ...data[key] });
            }
            return contacts;
        })
        .catch(error => {
            return [];
        });
}

/**
 * Renders the contact list by fetching contacts and displaying them alphabetically.
 * This function fetches the contacts and groups them by the first letter of the name.
 * It then renders the grouped contacts in the specified container.
 * 
 * @returns {void}
 */
function renderContacts() {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;
    contentDiv.innerHTML = '';

    fetchContacts().then(contacts => {
        const grouped = groupContactsAlphabetically(contacts);
        renderGroupedContacts(grouped, contentDiv);
    });
}

/**
 * Groups the given contacts alphabetically by the first letter of their names.
 * Each contact is grouped under a letter corresponding to the first letter of their name.
 * 
 * @param {Array} contacts - The list of contacts to group.
 * @returns {Object} The grouped contacts, with the first letter as keys and the contacts as values.
 */
function groupContactsAlphabetically(contacts) {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    const groups = {};
    for (const contact of contacts) {
        const firstLetter = contact.name?.[0]?.toUpperCase() || '?';
        if (!groups[firstLetter]) groups[firstLetter] = [];
        groups[firstLetter].push(contact);
    }
    return groups;
}

/**
 * Renders the grouped contacts by appending them to the provided container element.
 * For each group, a letter header is created and the contacts under that letter are displayed.
 * 
 * @param {Object} groups - The grouped contacts, with letters as keys.
 * @param {HTMLElement} container - The container element where the contacts will be rendered.
 * @returns {void}
 */
function renderGroupedContacts(groups, container) {
    for (const letter in groups) {
        const header = createLetterHeader(letter);
        container.appendChild(header);
        groups[letter].forEach(contact => {
            const contactEl = createContactElement(contact);
            container.appendChild(contactEl);
        });
    }
}

/**
 * Creates a header element for the specified letter.
 * This header will be used to group contacts alphabetically by their first letter.
 * 
 * @param {string} letter - The letter to display as the header.
 * @returns {HTMLElement} The created header element.
 */
function createLetterHeader(letter) {
    const div = document.createElement('div');
    div.classList.add('letter-header');
    div.textContent = letter;
    return div;
}

/**
 * Creates a contact item element displaying the contact's initials, name, and email.
 * The contact element also adds an event listener to show contact details when clicked.
 * 
 * @param {Object} contact - The contact object to create an element for.
 * @returns {HTMLElement} The created contact element.
 */
function createContactElement(contact) {
    const div = document.createElement('div');
    div.classList.add('contact-item');
    div.innerHTML = `
        <div class="contact-initials" style="background-color: ${contact.color};">${contact.initials}</div>
        <div class="contact-details">
            <h3>${contact.name}</h3>
            <p>${contact.email}</p>
        </div>
    `;
    div.addEventListener('click', () => window.showContactDetails(contact));
    return div;
}

/**
  * Deletes a contact from the backend database and updates the UI accordingly.
  * 
  * This function sends a DELETE request to remove the contact data from the backend.
  * After successfully deleting the contact, it refreshes the contact list and hides
  * the contact details overlay. If the window width is less than or equal to 1060px, 
  * it also toggles the columns in the UI.
  * 
  * @param {Object} contact - The contact to be deleted.
  * @param {string} contact.id - The unique identifier of the contact to be deleted.
  */
function deleteContact(contact) {
    fetch(`${BASE_URL}/contacts/${contact.id}.json`, {
        method: 'DELETE',
    }).then(() => {
        renderContacts();
        window.hideContactOverlay();
        document.getElementById('showDetails').classList.add('hidden');
        if (window.innerWidth <= 1060) {
            window.toggleColumns();
        }
    }).catch(error => { });
}

/**
 * The `window.core` object provides essential utility functions for managing contacts within the application.
 * It includes methods for retrieving initials, generating random colors, saving, fetching, rendering, and deleting contacts. 
 * By exposing these functions globally via `window.core`, they can be easily accessed and used throughout the entire application.
 * 
 * - `getInitials(fullName)`: Extracts and returns the initials from a given full name.
 * - `getRandomColor()`: Generates and returns a random color in hexadecimal format (e.g., "#3b5998").
 * - `saveContact(contact)`: Saves a new contact, taking a contact object as an argument. Returns a promise.
 * - `fetchContacts()`: Fetches all contacts from the database or server and returns a promise containing an array of contacts.
 * - `renderContacts()`: Renders and displays the list of contacts on the user interface (UI).
 * - `deleteContact(contactId)`: Deletes a contact by its unique ID. Returns a promise upon completion.
 * 
 * The functions are organized in a global object, making them easily accessible anywhere in the application for seamless contact management.
 */
window.core = {
    getInitials,
    getRandomColor,
    saveContact,
    fetchContacts,
    renderContacts,
    deleteContact
};
