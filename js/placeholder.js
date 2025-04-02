/**
 * Initializes the application when the DOM is fully loaded.
 * 
 * This function waits for the `DOMContentLoaded` event, ensuring that the DOM is fully loaded 
 * before running any JavaScript code. It sets the base URL for the Firebase database that will 
 * be used for fetching and saving data.
 */
document.addEventListener('DOMContentLoaded', () => {
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
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contact),
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
                    newContact.addEventListener('click', () => showContactDetails(contact));
                    contentDiv.appendChild(newContact);
                }
            }
        });
    }


    /**
     * Displays detailed information about a contact.
     * 
     * @param {object} contact - The contact object to display.
     */
    function showDetailsContainer() {
        const showDetailsDiv = document.getElementById('showDetails');
        if (!showDetailsDiv) {
            console.error('Show details div not found in the DOM!');
            return;
        }
        showDetailsDiv.classList.remove('hidden');
    }

    /**
     * Updates the contact's initials display in the DOM.
     * 
     * @param {Object} contact - The contact object.
     * @param {string} contact.initials - The initials of the contact.
     * @param {string} contact.color - The background color for the contact's initials.
     */
    function updateContactInitials(contact) {
        const contactInitials = document.getElementById('contactInitials');
        if (!contactInitials) {
            console.error('Contact initials element not found in the DOM!');
            return;
        }
        contactInitials.textContent = contact.initials;
        contactInitials.style.backgroundColor = contact.color;
    }

    /**
     * Updates the contact's name in the DOM.
     * 
     * @param {Object} contact - The contact object.
     * @param {string} contact.name - The name of the contact.
     */
    function updateContactName(contact) {
        const contactName = document.getElementById('contactName');
        if (!contactName) {
            console.error('Contact name element not found in the DOM!');
            return;
        }
        contactName.textContent = contact.name;
    }

    /**
     * Updates the contact's email in the DOM.
     * 
     * @param {Object} contact - The contact object.
     * @param {string} contact.email - The email of the contact.
     */
    function updateContactEmail(contact) {
        const contactEmail = document.getElementById('contactEmail');
        if (!contactEmail) {
            console.error('Contact email element not found in the DOM!');
            return;
        }
        contactEmail.textContent = contact.email;
    }

    /**
     * Updates the contact's phone number in the DOM.
     * 
     * @param {Object} contact - The contact object.
     * @param {string} contact.phone - The phone number of the contact.
     */
    function updateContactPhone(contact) {
        const contactPhone = document.getElementById('contactPhone');
        if (!contactPhone) {
            console.error('Contact phone element not found in the DOM!');
            return;
        }
        contactPhone.textContent = contact.phone;
    }

    /**
     * Sets up the edit link for the contact, allowing the user to edit the contact's details.
     * 
     * @param {Object} contact - The contact object.
     */
    function setupEditLink(contact) {
        const editLink = document.getElementById('editLink');
        if (!editLink) {
            console.error('Edit link not found!');
            return;
        }
        editLink.onclick = (event) => {
            event.preventDefault();
            openEditOverlay(contact);
        };
    }

    /**
     * Sets up the delete link for the contact, allowing the user to delete the contact.
     * 
     * @param {Object} contact - The contact object.
     */
    function setupDeleteLink(contact) {
        const deleteLink = document.getElementById('deleteLink');
        if (!deleteLink) {
            console.error('Delete link not found!');
            return;
        }
        deleteLink.onclick = (event) => {
            event.preventDefault();
            deleteContact(contact);
        };
    }

    /**
     * Sets up the mobile edit link for the contact, allowing the user to edit the contact's details on mobile view.
     * 
     * @param {Object} contact - The contact object.
     */
    function setupMobileEditLink(contact) {
        const editLinkOverlay = document.getElementById('editLinkOverlay');
        if (!editLinkOverlay) {
            console.error('Mobile edit link not found!');
            return;
        }
        editLinkOverlay.onclick = (event) => {
            event.preventDefault();
            openEditOverlay(contact);
        };
    }

    /**
     * Sets up the mobile delete link for the contact, allowing the user to delete the contact on mobile view.
     * 
     * @param {Object} contact - The contact object.
     */
    function setupMobileDeleteLink(contact) {
        const deleteLinkOverlay = document.getElementById('deleteLinkOverlay');
        if (!deleteLinkOverlay) return; // Silent fail

        deleteLinkOverlay.onclick = (event) => {
            event.preventDefault();
            deleteContact(contact);
        };
    }

    /**
     * Displays the contact's details in the details container and sets up the edit and delete links.
     * 
     * @param {Object} contact - The contact object.
     */
    function showContactDetails(contact) {
        showDetailsContainer();
        updateContactInitials(contact);
        updateContactName(contact);
        updateContactEmail(contact);
        updateContactPhone(contact);
        setupEditLink(contact);
        setupDeleteLink(contact);
        setupMobileEditLink(contact);
        setupMobileDeleteLink(contact);
    }

    /**
     * Opens the edit overlay for the contact, allowing the user to edit the contact's details.
     * 
     * @param {Object} contact - The contact object.
     */
    function openEditOverlay(contact) {
        const editLink = document.getElementById('editLinkOverlay');
        const overlay = document.getElementById('contact-overlay');
        const contactInitialsOverlay = document.getElementById('contact-initials-overlay');
        const editContactName = document.getElementById('edit-contact-name');
        const editContactEmail = document.getElementById('edit-contact-email');
        const editContactPhone = document.getElementById('edit-contact-phone');
        const backdrop = document.createElement('div');
        backdrop.id = 'overlay-backdrop';
        backdrop.className = 'overlay-backdrop';
        backdrop.onclick = hideOverlay; // Close when clicking backdrop
        document.body.appendChild(backdrop);
        backdrop.style.display = 'block';
        if (editLink) {
            editLink.classList.add('active');
        }
        if (contactInitialsOverlay) {
            contactInitialsOverlay.textContent = contact.initials;
            contactInitialsOverlay.style.backgroundColor = contact.color;
        }
        if (editContactName) {
            editContactName.value = contact.name;
        }
        if (editContactEmail) {
            editContactEmail.value = contact.email;
        }
        if (editContactPhone) {
            editContactPhone.value = contact.phone;
        }
        setTimeout(() => {
            if (overlay) {
                overlay.style.display = 'block';
                overlay.classList.add('active');
            }
            if (editLink) {
                editLink.classList.remove('active');
            }
        }, 100);
        const saveButton = document.getElementById('save-contact-button');
        if (saveButton) {
            saveButton.onclick = () => saveEditedContact(contact);
        }
        const deleteButton = document.getElementById('delete-contact-button');
        if (deleteButton) {
            deleteButton.onclick = () => deleteContact(contact);
        }
    }

    /**
     * Saves the edited contact details to Firebase.
     * 
     * @param {object} contact - The contact object to update.
     */
    function gatherUpdatedContactData(contact) {
        const name = document.getElementById('edit-contact-name').value;
        const email = document.getElementById('edit-contact-email').value;
        const phone = document.getElementById('edit-contact-phone').value;
        return {
            name: name,
            email: email,
            phone: phone,
            initials: getInitials(name),
            color: contact.color,
        };
    }

    /**
     * Updates the contact information in the backend API.
     * 
     * @param {string} contactId - The unique identifier for the contact to be updated.
     * @param {Object} updatedContact - The updated contact data to be saved.
     * @param {string} updatedContact.name - The updated name of the contact.
     * @param {string} updatedContact.email - The updated email of the contact.
     * @param {string} updatedContact.phone - The updated phone number of the contact.
     * @param {string} updatedContact.initials - The updated initials of the contact.
     * @param {string} updatedContact.color - The updated color for the contact's initials.
     * @returns {Promise} The fetch promise that resolves when the contact is updated in the API.
     */
    function updateContactAPI(contactId, updatedContact) {
        return fetch(`${BASE_URL}/contacts/${contactId}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedContact),
        });
    }

    /**
      * Handles UI updates after successfully updating a contact.
      * This function hides the contact overlay, renders the updated list of contacts, 
      * and shows the updated contact's details.
      * 
      * @param {Object} updatedContact - The updated contact data to be reflected in the UI.
      */
    function handleUIUpdates(updatedContact) {
        hideContactOverlay();
        renderContacts();
        showContactDetails(updatedContact);
    }

    /**
     * Handles errors that occur during the process of updating a contact.
     * 
     * @param {Error} error - The error that occurred during the contact update process.
     */
    function handleError(error) {
        console.error('Error updating contact:', error);
    }

    /**
     * Saves the edited contact by validating the form and updating the contact in the backend.
     * 
     * @param {Object} contact - The original contact object to be updated.
     * @param {string} contact.id - The unique identifier of the contact.
     * @param {string} contact.name - The current name of the contact.
     * @param {string} contact.email - The current email of the contact.
     * @param {string} contact.phone - The current phone number of the contact.
     * @param {string} contact.initials - The current initials of the contact.
     * @param {string} contact.color - The current color of the contact's initials.
     */
    function saveEditedContact(contact) {
        const nameInput = document.getElementById('edit-contact-name');
        const emailInput = document.getElementById('edit-contact-email');
        const phoneInput = document.getElementById('edit-contact-phone');
    
        // Clear previous errors
        document.querySelectorAll('#contact-overlay .error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('#contact-overlay .contact-input-container').forEach(el => el.classList.remove('error'));
    
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        // Name validation
        if (!nameInput.value.trim()) {
            showEditError(nameInput, 'Name is required');
            isValid = false;
        }
    
        // Email validation
        if (!emailInput.value.trim()) {
            showEditError(emailInput, 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value)) {
            showEditError(emailInput, 'Invalid email format');
            isValid = false;
        }
    
        // Phone validation
        if (!phoneInput.value.trim()) {
            showEditError(phoneInput, 'Phone is required');
            isValid = false;
        } else if (!/^\d+$/.test(phoneInput.value)) {
            showEditError(phoneInput, 'Invalid phone number');
            isValid = false;
        }
    
        if (!isValid) {
            console.log('Validation failed - preventing save');
            return;
        }
    
        const updatedContact = {
            id: contact.id,
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            initials: getInitials(nameInput.value.trim()),
            color: contact.color
        };
    
        updateContactAPI(contact.id, updatedContact)
            .then(() => {
                console.log('Update successful, refreshing contacts...');
                handleUIUpdates(updatedContact);
                hideContactOverlay();
            })
            .catch(error => {
                console.error('Update error:', error);
                showToast('Failed to update contact');
            });
    }
    function showEditError(inputElement, message) {
        const container = inputElement.closest('.contact-input-container');
        const errorId = inputElement.id + '-error';
        const errorElement = document.getElementById(errorId);
        
        if (errorElement) {
            errorElement.textContent = message;
            container.classList.add('error');
        } else {
            console.error('Error element not found for:', errorId);
        }
    }
    // Add this helper function if you don't have it
    function showError(inputElement, message) {
        const inputId = inputElement.id;
        const errorElement = document.getElementById(`${inputId}-error`);
        
        if (errorElement) {
            errorElement.textContent = message;
            inputElement.closest('.input-container').classList.add('error');
        }
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
            hideContactOverlay();
            document.getElementById('showDetails').classList.add('hidden');
            if (window.innerWidth <= 1060) {
                toggleColumns();
            }
        }).catch(error => {

        });
    }
    const closeContactOverlayButton = document.getElementById('close-contact-overlay');
    if (closeContactOverlayButton) {
        closeContactOverlayButton.addEventListener('click', (event) => {
            event.preventDefault();
            hideContactOverlay();
        });
    }
    const closeContactOverlayButtonWhite = document.getElementById('close-contact-overlay-white');
    if (closeContactOverlayButtonWhite) {
        closeContactOverlayButtonWhite.addEventListener('click', (event) => {
            event.preventDefault();
            hideContactOverlay();
        });
    }

    /**
    * Handles form submission to create a new contact.
    * 
    * @param {Event} event - The form submission event.
    */
    function gatherUpdatedContactData(contact) {
        const name = document.getElementById('edit-contact-name').value;
        return {
            id: contact.id, // Preserve existing ID
            name: name,
            email: document.getElementById('edit-contact-email').value,
            phone: document.getElementById('edit-contact-phone').value,
            initials: getInitials(name),
            color: contact.color
        };
    }
    
    

    /**
     * Saves the new contact and updates the UI accordingly.
     * 
     * This function first attempts to save the new contact using the `saveContact` function. 
     * If the contact is successfully saved, it updates the UI by rendering the contacts, 
     * showing a success toast, and displaying the details of the newly created contact. 
     * Additionally, it resets the form and hides the overlay.
     * 
     * @param {Object} newContact - The new contact object to be saved.
     * @param {string} newContact.name - The name of the contact.
     * @param {string} newContact.email - The email of the contact.
     * @param {string} newContact.phone - The phone number of the contact.
     */
    function saveAndUpdateUI(newContact) {
        saveContact(newContact)
            .then((data) => {
                showToast('Contact created successfully!');
                newContact.id = data.name;
                document.getElementById('contact-form').reset();
                hideOverlay();
                renderContacts();
                showContactDetails(newContact);
                if (window.innerWidth <= 1060) {
                    toggleColumns();
                }
            })
            .catch(error => {
                showToast('Error saving contact. Please try again.');
            });
    }
    function gatherContactData() {
        return {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            initials: getInitials(document.getElementById('name').value.trim()),
            color: getRandomColor()
        };
    }

/**
 * Handles the creation of a new contact.
 *  * 
 * This function is triggered when the contact form is submitted. It validates the email 
 * and ensures it contains both "@" and "." before proceeding to gather contact data 
 * and calling `saveAndUpdateUI` to save the contact and update the UI.
 * 
 * @param {Event} event - The submit event triggered by the form.
 */
function createContact(event) {
    event.preventDefault();
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    // Reset errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.input-container').forEach(el => el.classList.remove('error'));

    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Name validation
    if (!nameInput.value.trim()) {
        showError(nameInput, 'Name is required');
        isValid = false;
    }

    // Email validation
    if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'Invalid email format');
        isValid = false;
    }

    // Phone validation
    if (!phoneInput.value.trim()) {
        showError(phoneInput, 'Phone is required');
        isValid = false;
    } else if (!/^\d+$/.test(phoneInput.value)) {
        showError(phoneInput, 'Invalid phone number');
        isValid = false;
    }

    if (!isValid) return;
    const newContact = gatherContactData();
    saveAndUpdateUI(newContact);
}

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', createContact);
    }
    renderContacts();
    hideOverlay();
});

/**
 * Sets up the email validation for both the add contact and edit contact forms.
 * 
 * This function listens for input events on the email fields and ensures that the 
 * email contains both "@" and ".", clearing any custom validity messages once 
 * the email is valid.
 */
function showError(inputElement, message) {
    const container = inputElement.closest('.input-container, .contact-input-container');
    const errorElement = container.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.textContent = message;
        container.classList.add('error');
    }
}
// Add input event listeners to clear errors
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        const container = input.closest('.input-container, .contact-input-container');
        container.classList.remove('error');
        container.querySelector('.error-message').textContent = '';
    });
});

