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
            console.log('Contact saved successfully:', data);
            return data;
        })
        .catch(error => {
            console.error('Error saving contact:', error);
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
            console.error('Error fetching contacts:', error);
            return [];
        });
}
/**
 * Renders the list of contacts on the page, grouping them by the first letter of their names.
 * 
 * This function fetches the list of contacts, sorts them alphabetically, and groups them by the 
 * first letter of their name. It then dynamically creates HTML elements to display the contact 
 * details, including initials, name, and email. Each contact is displayed as a clickable item, 
 * and clicking on a contact will show its detailed information.
*/
function renderContacts() {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        console.error('Content div not found!');
        return;
    }
    contentDiv.innerHTML = '';
    /**
          * Fetches the list of contacts, sorts them alphabetically by name, and groups them by the 
          * first letter of their name. Then, it generates HTML for displaying the grouped contacts.
          */

    fetchContacts().then(contacts => {
        contacts.sort((a, b) => a.name.localeCompare(b.name));
        const groupedContacts = {};
        for (const contact of contacts) {
            const firstLetter = (contact.name && contact.name.length > 0) ? contact.name[0].toUpperCase() : '?';
            if (!groupedContacts[firstLetter]) {
                groupedContacts[firstLetter] = [];
            }
            groupedContacts[firstLetter].push(contact);
        }

        for (const letter in groupedContacts) {
            const header = document.createElement('div');
            header.classList.add('letter-header');
            header.textContent = letter;
            contentDiv.appendChild(header);

            for (const contact of groupedContacts[letter]) {
                const newContact = document.createElement('div');
                newContact.classList.add('contact-item');
                newContact.innerHTML = `
                    <div class="contact-initials" style="background-color: ${contact.color};">${contact.initials}</div>
                    <div class="contact-details">
                        <h3>${contact.name}</h3>
                        <p>${contact.email}</p>
                    </div>
                `;
                newContact.addEventListener('click', () => window.showContactDetails(contact));
                contentDiv.appendChild(newContact);
            }
        }
    });
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