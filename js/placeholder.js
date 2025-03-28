document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";

    /**
     * Generates initials from a given name.
     * 
     * @param {string} name - The full name of the contact.
     * @returns {string} - The initials of the name.
     */
    function getInitials(name) {
        return name.split(' ').map(part => part[0]).join('').toUpperCase();
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
     * Renders contacts into the content div, grouped by the first letter of the name.
     */
    function renderContacts() {
        const contentDiv = document.getElementById('content');
        if (!contentDiv) {
            console.error('Content div not found!');
            return;
        }
        contentDiv.innerHTML = '';

        fetchContacts().then(contacts => {
            contacts.sort((a, b) => a.name.localeCompare(b.name));
            const groupedContacts = {};
            for (const contact of contacts) {
                const firstLetter = contact.name[0].toUpperCase();
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
     * Updates the contact initials element with the provided contact's initials.
     * The background color of the initials element is also updated.
     * 
     * @param {Object} contact - The contact object containing the initials and color.
     * @param {string} contact.initials - The initials of the contact.
     * @param {string} contact.color - The color for the initials background.
     * @returns {void} This function does not return any value.
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
     * Updates the contact name element with the provided contact's name.
     * 
     * @param {Object} contact - The contact object containing the name.
     * @param {string} contact.name - The name of the contact.
     * @returns {void} This function does not return any value.
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
     * Updates the contact email element with the provided contact's email.
     * 
     * @param {Object} contact - The contact object containing the email.
     * @param {string} contact.email - The email of the contact.
     * @returns {void} This function does not return any value.
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
     * Updates the contact phone element with the provided contact's phone number.
     * 
     * @param {Object} contact - The contact object containing the phone number.
     * @param {string} contact.phone - The phone number of the contact.
     * @returns {void} This function does not return any value.
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
     * Sets up the edit link to open the edit overlay when clicked.
     * 
     * @param {Object} contact - The contact object for which the edit link is being set.
     * @returns {void} This function does not return any value.
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
     * Sets up the delete link to delete the contact when clicked.
     * 
     * @param {Object} contact - The contact object for which the delete link is being set.
     * @returns {void} This function does not return any value.
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
     * Sets up the mobile edit link to open the edit overlay when clicked.
     * 
     * @param {Object} contact - The contact object for which the mobile edit link is being set.
     * @returns {void} This function does not return any value.
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
     * Sets up the mobile delete link to delete the contact when clicked.
     * 
     * @param {Object} contact - The contact object for which the mobile delete link is being set.
     * @returns {void} This function does not return any value.
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
     * Displays the contact details in the UI by updating the respective elements with the contact information.
     * Also sets up the edit and delete links for both desktop and mobile views.
     * 
     * @param {Object} contact - The contact object containing the details to be displayed.
     * @param {string} contact.initials - The initials of the contact.
     * @param {string} contact.name - The name of the contact.
     * @param {string} contact.email - The email of the contact.
     * @param {string} contact.phone - The phone number of the contact.
     * @returns {void} This function does not return any value.
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
     * Opens the overlay for editing the contact details. The overlay contains input fields pre-filled with the contact's details.
     * Also sets up the save and delete buttons within the overlay.
     * 
     * @param {Object} contact - The contact object whose details are to be edited.
     * @param {string} contact.initials - The initials of the contact.
     * @param {string} contact.name - The name of the contact.
     * @param {string} contact.email - The email of the contact.
     * @param {string} contact.phone - The phone number of the contact.
     * @returns {void} This function does not return any value.
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
        backdrop.onclick = hideOverlay;
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
     * Sends a PUT request to update a contact's details in the API.
     * 
     * @param {string} contactId - The unique identifier for the contact to be updated.
     * @param {Object} updatedContact - The updated contact data to be saved.
     * @param {string} updatedContact.name - The updated name of the contact.
     * @param {string} updatedContact.email - The updated email of the contact.
     * @param {string} updatedContact.phone - The updated phone number of the contact.
     * @param {string} updatedContact.initials - The updated initials of the contact.
     * @param {string} updatedContact.color - The updated background color for the initials.
     * @returns {Promise} A promise that resolves when the contact has been successfully updated in the API.
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
     * Handles UI updates after a contact has been successfully updated.
     * 
     * @param {Object} updatedContact - The updated contact data.
     * @param {string} updatedContact.name - The updated name of the contact.
     * @param {string} updatedContact.email - The updated email of the contact.
     * @param {string} updatedContact.phone - The updated phone number of the contact.
     * @param {string} updatedContact.initials - The updated initials of the contact.
     * @param {string} updatedContact.color - The updated background color for the initials.
     * @returns {void} This function does not return any value.
     */
    function handleUIUpdates(updatedContact) {
        hideContactOverlay();
        renderContacts();
        showContactDetails(updatedContact);
    }

    /**
 * Handles errors that occur during the contact update process.
 * 
 * @param {Error} error - The error object representing the failure.
 * @returns {void} This function does not return any value.
 */
    function handleError(error) {
        console.error('Error updating contact:', error);
    }

    /**
     * Gathers updated contact data and saves it through the API.
     * Validates the email input and triggers the update process.
     * 
     * @param {Object} contact - The original contact object before the update.
     * @param {string} contact.id - The unique identifier of the contact to be updated.
     * @returns {void} This function does not return any value. It triggers the update process.
     */
    function saveEditedContact(contact) {
        const editForm = document.querySelector('#contact-overlay .contact-details-inputs');
        const emailInput = document.getElementById('edit-contact-email');
        const email = emailInput.value;
        if (!emailInput.checkValidity()) {
            emailInput.reportValidity();
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            emailInput.setCustomValidity('Email must contain both @ and .');
            emailInput.reportValidity();
            return;
        }
        emailInput.setCustomValidity('');
        const updatedContact = gatherUpdatedContactData(contact);
        updateContactAPI(contact.id, updatedContact)
            .then(() => {
                console.log('Contact updated successfully!');
                handleUIUpdates(updatedContact);
            })
            .catch(handleError);
    }

    /**
     * Deletes a contact from Firebase.
     * 
     * @param {object} contact - The contact object to delete.
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
    function gatherContactData() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        return {
            name: name,
            email: email,
            phone: phone,
            initials: getInitials(name),
            color: getRandomColor(),
        };
    }

    /**
 * Saves a new contact and updates the UI with the created contact data.
 * Displays a toast message upon success or failure.
 * 
 * @param {Object} newContact - The contact object to be saved.
 * @param {string} newContact.name - The name of the contact.
 * @param {string} newContact.email - The email address of the contact.
 * @param {string} newContact.phone - The phone number of the contact.
 * @param {string} newContact.initials - The initials of the contact.
 * @param {string} newContact.color - The background color of the initials.
 * @returns {void} This function does not return any value. It updates the UI and saves the contact.
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

    /**
     * Handles the form submission for creating a new contact. Validates the email input 
     * and calls the function to save the new contact.
     * 
     * @param {Event} event - The form submission event.
     * @returns {void} This function does not return any value. It handles the form submission and validation.
     */
    function createContact(event) {
        event.preventDefault();
        const emailInput = document.getElementById('email');
        if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) {
            emailInput.setCustomValidity('Email must contain both @ and .');
            emailInput.reportValidity();
            return;
        }
        emailInput.setCustomValidity('');
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
 * Sets up email validation for both the add contact and edit contact forms.
 * It listens for input events and removes any custom validity messages 
 * when the email contains both '@' and '.'.
 * 
 * @returns {void} This function does not return any value. It sets up event listeners.
 */
function setupEmailValidation() {
    const emailInput = document.getElementById('email');
    const editEmailInput = document.getElementById('edit-contact-email');
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            if (emailInput.value.includes('@') && emailInput.value.includes('.')) {
                emailInput.setCustomValidity('');
            }
        });
    }
    if (editEmailInput) {
        editEmailInput.addEventListener('input', () => {
            if (editEmailInput.value.includes('@') && editEmailInput.value.includes('.')) {
                editEmailInput.setCustomValidity('');
            }
        });
    }
}

/**
 * Sets up event listeners for the contact form and email validation upon DOM content load.
 * 
 * @returns {void} This function does not return any value. It sets up necessary listeners for the form and email validation.
 */
document.addEventListener('DOMContentLoaded', () => {
    setupEmailValidation();
});













