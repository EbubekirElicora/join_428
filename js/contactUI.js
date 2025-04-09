/**
 * Initializes the application when the DOM is fully loaded.
 */

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Displays detailed information about a contact.     * 
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
     * Updates the contact's initials display in the DOM.     * 
     * @param {Object} contact - The contact object.
     * @param {string} contact.initials - The initials of the contact.
     * @param {string} contact.color - The background color for the contact's initials.
     * @param {string} contact.email - The background color for the contact's initials.
     * @param {string} contact.name - The background color for the contact's initials.
     * @param {string} contact.phone - The background color for the contact's initials.
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

    function updateContactName(contact) {
        const contactName = document.getElementById('contactName');
        if (!contactName) {
            console.error('Contact name element not found in the DOM!');
            return;
        }
        contactName.textContent = contact.name;
    }

    function updateContactEmail(contact) {
        const contactEmail = document.getElementById('contactEmail');
        if (!contactEmail) {
            console.error('Contact email element not found in the DOM!');
            return;
        }
        contactEmail.textContent = contact.email;
    }

    function updateContactPhone(contact) {
        const contactPhone = document.getElementById('contactPhone');
        if (!contactPhone) {
            console.error('Contact phone element not found in the DOM!');
            return;
        }
        contactPhone.textContent = contact.phone;
    }

    /**
     * Sets up the edit link for the contact, allowing the user to edit the contact's details.     * 
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
            window.openEditOverlay(contact);
        };
    }

    /**
    * Sets up the delete link for the contact, allowing the user to delete the contact. * 
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
            core.deleteContact(contact);
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
            window.openEditOverlay(contact);
        };
    }
    /**
     * Sets up the mobile delete link for the contact, allowing the user to delete the contact on mobile view.
     * 
     * @param {Object} contact - The contact object.
     */
    function setupMobileDeleteLink(contact) {
        const deleteLinkOverlay = document.getElementById('deleteLinkOverlay');
        if (!deleteLinkOverlay) return;

        deleteLinkOverlay.onclick = (event) => {
            event.preventDefault();
            core.deleteContact(contact);
        };
    }
    /**
     * Displays the contact's details in the details container and sets up the edit and delete links.     * 
     * @param {Object} contact - The contact object.
     */
    window.showContactDetails = function (contact) {
        showDetailsContainer();
        updateContactInitials(contact);
        updateContactName(contact);
        updateContactEmail(contact);
        updateContactPhone(contact);
        setupEditLink(contact);
        setupDeleteLink(contact);
        setupMobileEditLink(contact);
        setupMobileDeleteLink(contact);
    };

    /**
     * Updates a contact via the API.
     * @param {string} contactId The ID of the contact to update.
     * @param {Object} updatedContact The updated contact information.
     * @returns {Promise} The fetch promise.
     */
    function updateContactAPI(contactId, updatedContact) {
        return fetch(`${core.BASE_URL}/contacts/${contactId}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedContact),
        });
    }

    /**
     * Handles UI updates after a contact has been updated.
     * Fetches the updated contacts, re-renders them, and updates the UI with the updated contact.
     * @param {Object} updatedContact The updated contact information.
     */
    function handleUIUpdates(updatedContact) {
        core.fetchContacts().then(contacts => {
            core.renderContacts();
            const freshContact = contacts.find(c => c.id === updatedContact.id) || updatedContact;
            window.showContactDetails(freshContact);
            window.hideContactOverlay();
        });
    }
    function updateContactAPI(contactId, updatedContact) {
        // Ensure BASE_URL is properly defined globally
        const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app";
        return fetch(`${BASE_URL}/contacts/${contactId}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedContact)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            });
    }
    /**
     * Saves the edited contact by validating the form and updating the contact in the backend.
     * @param {Object} contact - The original contact object to be updated.
     * @param {string} contact.id - The unique identifier of the contact.
     * @param {string} contact.name - The current name of the contact.
     * @param {string} contact.email - The current email of the contact.
     * @param {string} contact.phone - The current phone number of the contact.
     * @param {string} contact.initials - The current initials of the contact.
     * @param {string} contact.color - The current color of the contact's initials.
     */
    window.saveEditedContact = function (contact) {
        const nameInput = document.getElementById('edit-contact-name');
        const emailInput = document.getElementById('edit-contact-email');
        const phoneInput = document.getElementById('edit-contact-phone');

        resetEditErrors();
        if (!validateEditInputs(nameInput, emailInput, phoneInput)) return;

        const updatedContact = buildUpdatedContact(contact, nameInput, emailInput, phoneInput);
        updateAndRefresh(contact.id, updatedContact);
    };

    function buildUpdatedContact(contact, nameInput, emailInput, phoneInput) {
        return {
            id: contact.id,
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            initials: core.getInitials(nameInput.value.trim()),
            color: contact.color
        };
    }

    function updateAndRefresh(id, updatedContact) {
        updateContactAPI(id, updatedContact)
            .then(() => {
                handleUIUpdates(updatedContact);
                window.hideContactOverlay();
            })
            .catch(() => window.showToast('Failed to update contact'));
    }


    function resetEditErrors() {
        document.querySelectorAll('#contact-overlay .error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('#contact-overlay .contact-input-container').forEach(el => el.classList.remove('error'));
    }

    function validateEditInputs(nameInput, emailInput, phoneInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = true;
        if (!nameInput.value.trim()) { showEditError(nameInput, 'Name is required'); isValid = false; }
        const email = emailInput.value.trim();
        if (!email) {
            showEditError(emailInput, 'Email is required'); isValid = false;
        } else if (!email.includes('@')) {
            showEditError(emailInput, 'Please include @'); isValid = false;
        } else if (!email.includes('.')) {
            showEditError(emailInput, 'Please include .'); isValid = false;
        } else if (!emailRegex.test(email)) { showEditError(emailInput, 'Invalid email format'); isValid = false; }
        const phone = phoneInput.value.trim();
        if (!phone) {
            showEditError(phoneInput, 'Phone is required'); isValid = false;
        } else if (!/^\d+$/.test(phone)) { showEditError(phoneInput, 'Invalid phone number'); isValid = false; }
        return isValid;
    }

    /**
     * Sets up the email validation for both the add contact and edit contact forms. * 
     * This function listens for input events on the email fields and ensures that the 
     * email contains both "@" and ".", clearing any custom validity messages once 
     * the email is valid.
     */
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

    window.showError = function (inputElement, message) {
        const inputId = inputElement.id;
        const errorElement = document.getElementById(`${inputId}-error`);

        if (errorElement) {
            errorElement.textContent = message;
            inputElement.closest('.input-container').classList.add('error');
        }
    }

    const closeContactOverlayButton = document.getElementById('close-contact-overlay');
    if (closeContactOverlayButton) {
        closeContactOverlayButton.addEventListener('click', (event) => {
            event.preventDefault();
            window.hideContactOverlay();
        });
    }

    const closeContactOverlayButtonWhite = document.getElementById('close-contact-overlay-white');
    if (closeContactOverlayButtonWhite) {
        closeContactOverlayButtonWhite.addEventListener('click', (event) => {
            event.preventDefault();
            window.hideContactOverlay();
        });
    }

    /**
    * Saves the edited contact details to Firebase.    * 
    * @param {object} contact - The contact object to update.
    */
    function gatherUpdatedContactData(contact) {
        const name = document.getElementById('edit-contact-name').value;
        return {
            id: contact.id,
            name: name,
            email: document.getElementById('edit-contact-email').value,
            phone: document.getElementById('edit-contact-phone').value,
            initials: core.getInitials(name),
            color: contact.color
        };
    }
    /**
    * Saves the new contact and updates the UI accordingly.
    * This function first attempts to save the new contact using the `saveContact` function. 
    * If the contact is successfully saved, it updates the UI by rendering the contacts, Additionally, it resets the form and hides the overlay.      
    * @param {Object} newContact - The new contact object to be saved.
    * @param {string} newContact.name - The name of the contact.
    * @param {string} newContact.email - The email of the contact.
    * @param {string} newContact.phone - The phone number of the contact.
    */
    function saveAndUpdateUI(newContact) {
        core.saveContact(newContact)
            .then((data) => {
                window.showToast('Contact created successfully!');
                newContact.id = data.name;
                document.getElementById('contact-form').reset();
                window.hideOverlay();
                core.renderContacts();
                window.showContactDetails(newContact);
                if (window.innerWidth <= 1060) {
                    window.toggleColumns();
                }
            })
            .catch(error => {
                window.showToast('Error saving contact. Please try again.');
            });
    }

    function gatherContactData() {
        return {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            initials: core.getInitials(document.getElementById('name').value.trim()),
            color: core.getRandomColor()
        };
    }

    /**
     * Handles the creation of a new contact.
      * This function is triggered when the contact form is submitted. It validates the email 
     * and ensures it contains both "@" and "." before proceeding to gather contact data 
     * and calling `saveAndUpdateUI` to save the contact and update the UI. * 
     * @param {Event} event - The submit event triggered by the form.
     */
    function createContact(event) {
        event.preventDefault();
        resetErrors();
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        if (!validateInputs(nameInput, emailInput, phoneInput)) return;
        const newContact = gatherContactData();
        saveAndUpdateUI(newContact);
    }

    function resetErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.input-container').forEach(el => el.classList.remove('error'));
    }

    function validateInputs(nameInput, emailInput, phoneInput) {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!nameInput.value.trim()) { window.showError(nameInput, 'Name is required'); isValid = false; }
        const email = emailInput.value.trim();
        if (!email) {
            window.showError(emailInput, 'Email is required'); isValid = false;
        } else if (!email.includes('@')) {
            window.showError(emailInput, 'Please include @'); isValid = false;
        } else if (!email.includes('.')) {
            window.showError(emailInput, 'Please include .'); isValid = false;
        } else if (!emailRegex.test(email)) {
            window.showError(emailInput, 'Invalid email format'); isValid = false;
        }
        const phone = phoneInput.value.trim();
        if (!phone) {
            window.showError(phoneInput, 'Phone is required'); isValid = false;
        } else if (!/^\d+$/.test(phone)) {
            window.showError(phoneInput, 'Invalid phone number'); isValid = false;
        }
        return isValid;
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', createContact);
    }
    core.renderContacts();
    window.hideOverlay();
});