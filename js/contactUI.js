/**
 * Displays the contact details section by removing the hidden class.
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
 * Updates the contact initials and sets their background color.
 * @param {Object} contact - The contact object.
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
 * Updates the DOM element showing the contact's name.
 * @param {Object} contact - The contact object.
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
 * Updates the DOM element showing the contact's email.
 * @param {Object} contact - The contact object.
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
 * Updates the DOM element showing the contact's phone number.
 * @param {Object} contact - The contact object.
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
 * Assigns the edit function to the edit link.
 * @param {Object} contact - The contact to edit.
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
 * Assigns the delete function to the delete link.
 * @param {Object} contact - The contact to delete.
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
 * Assigns the edit function to the mobile edit link.
 * @param {Object} contact - The contact to edit.
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
 * Assigns the delete function to the mobile delete link.
 * @param {Object} contact - The contact to delete.
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
 * Displays contact details in the UI and assigns actions.
 * @param {Object} contact - The contact to display.
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
 * Clears all previous error messages and styles in the edit form.
 */
function resetEditErrors() {
    document.querySelectorAll('#contact-overlay .error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('#contact-overlay .contact-input-container').forEach(el => el.classList.remove('error'));
}

function validateEditInputs(nameInput, emailInput, phoneInput) {
    let isValid = true;
    if (!validateEditName(nameInput)) isValid = false;
    if (!validateEditEmail(emailInput)) isValid = false;
    if (!validateEditPhone(phoneInput)) isValid = false;
    return isValid;
}

/**
 * Validates the name input field during editing.
 * @param {HTMLElement} nameInput - The input element for the name.
 * @returns {boolean} Whether the name is valid.
 */
function validateEditName(nameInput) {
    if (!nameInput.value.trim()) {
        showEditError(nameInput, 'Name is required');
        return false;
    }
    return true;
}

/**
 * Validates the email input field during editing.
 * @param {HTMLElement} emailInput - The input element for the email.
 * @returns {boolean} Whether the email is valid.
 */
function validateEditEmail(emailInput) {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showEditError(emailInput, 'Email is required');
        return false;
    } else if (!email.includes('@')) {
        showEditError(emailInput, 'Please include @');
        return false;
    } else if (!email.includes('.')) {
        showEditError(emailInput, 'Please include .');
        return false;
    } else if (!emailRegex.test(email)) {
        showEditError(emailInput, 'Invalid email format');
        return false;
    }
    return true;
}

/**
 * Validates the phone input field during editing.
 * @param {HTMLElement} phoneInput - The input element for the phone number.
 * @returns {boolean} Whether the phone number is valid.
 */
function validateEditPhone(phoneInput) {
    const phone = phoneInput.value.trim();
    if (!phone) {
        showEditError(phoneInput, 'Phone is required');
        return false;
    } else if (!/^\d+$/.test(phone)) {
        showEditError(phoneInput, 'Invalid phone number');
        return false;
    }
    return true;
}
/**
 * Displays an error message below an input element.
 * @param {HTMLElement} inputElement - The input that has the error.
 * @param {string} message - The error message to display.
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

/**
 * Constructs an updated contact object with new data.
 * @param {Object} contact - The original contact.
 * @param {HTMLElement} nameInput - Name input.
 * @param {HTMLElement} emailInput - Email input.
 * @param {HTMLElement} phoneInput - Phone input.
 * @returns {Object} Updated contact object.
 */
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

/**
 * Sends updated contact to backend and refreshes UI.
 * @param {string} id - Contact ID.
 * @param {Object} updatedContact - New contact data.
 */
function updateAndRefresh(id, updatedContact) {
    updateContactAPI(id, updatedContact)
        .then(() => {
            handleUIUpdates(updatedContact);
            window.hideContactOverlay();
        })
        .catch(() => window.showToast('Failed to update contact'));
}

/**
 * Refreshes contact view in UI after update.
 * @param {Object} updatedContact - Contact data after saving.
 */
function handleUIUpdates(updatedContact) {
    core.fetchContacts().then(contacts => {
        core.renderContacts();
        const freshContact = contacts.find(c => c.id === updatedContact.id) || updatedContact;
        window.showContactDetails(freshContact);
        window.hideContactOverlay();
    });
}

/**
 * Handles save action for editing a contact.
 * @param {Object} contact - Contact being edited.
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

/**
 * Clears error states and messages from the form.
 */
function resetErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.input-container').forEach(el => el.classList.remove('error'));
}

function validateInputs(nameInput, emailInput, phoneInput) {
    let isValid = true;
    if (!validateName(nameInput)) isValid = false;
    if (!validateEmail(emailInput)) isValid = false;
    if (!validatePhone(phoneInput)) isValid = false;
    return isValid;
}

/**
 * Validates the name input field.
 * @param {HTMLElement} nameInput - The input element for the name.
 * @returns {boolean} Whether the name is valid.
 */
function validateName(nameInput) {
    if (!nameInput.value.trim()) {
        window.showError(nameInput, 'Name is required');
        return false;
    }
    return true;
}

/**
 * Validates the email input field.
 * @param {HTMLElement} emailInput - The input element for the email.
 * @returns {boolean} Whether the email is valid.
 */
function validateEmail(emailInput) {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        window.showError(emailInput, 'Email is required');
        return false;
    } else if (!email.includes('@')) {
        window.showError(emailInput, 'Please include @');
        return false;
    } else if (!email.includes('.')) {
        window.showError(emailInput, 'Please include .');
        return false;
    } else if (!emailRegex.test(email)) {
        window.showError(emailInput, 'Invalid email format');
        return false;
    }
    return true;
}

/**
 * Validates the phone input field.
 * @param {HTMLElement} phoneInput - The input element for the phone number.
 * @returns {boolean} Whether the phone number is valid.
 */
function validatePhone(phoneInput) {
    const phone = phoneInput.value.trim();
    if (!phone) {
        window.showError(phoneInput, 'Phone is required');
        return false;
    } else if (!/^\d+$/.test(phone)) {
        window.showError(phoneInput, 'Invalid phone number');
        return false;
    }
    return true;
}

/**
 * Collects data from the input fields and prepares a contact object.
 * @returns {Object} New contact object.
 */
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
 * Saves the new contact to the backend and updates the UI.
 * @param {Object} newContact - Contact to be saved.
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

/**
 * Main function for creating a new contact.
 * @param {Event} event - Form submit event.
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

/**
 * Sends a PUT request to update a contact in the backend.
 * @param {string} contactId - The contact's unique ID.
 * @param {Object} updatedContact - Updated contact data.
 * @returns {Promise<Object>} A promise resolving to the response.
 */
function updateContactAPI(contactId, updatedContact) {
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
 * Initializes event listeners and renders initial UI state.
 */
document.addEventListener('DOMContentLoaded', () => {
    setupCloseContactOverlayButton('close-contact-overlay');
    setupCloseContactOverlayButton('close-contact-overlay-white');
    setupContactFormSubmitListener();
    core.renderContacts();
    window.hideOverlay();
});

/**
 * Sets up the event listener for the close contact overlay button.
 * @param {string} buttonId - The ID of the close contact overlay button.
 */
function setupCloseContactOverlayButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            window.hideContactOverlay();
        });
    }
}

/**
 * Sets up the event listener for the contact form submit.
 */
function setupContactFormSubmitListener() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', createContact);
    }
}

/**
 * Displays an inline validation error for a form input.
 * @param {HTMLElement} inputElement - Input element that failed validation.
 * @param {string} message - Error message to show.
 */
window.showError = function (inputElement, message) {
    const inputId = inputElement.id;
    const errorElement = document.getElementById(`${inputId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        inputElement.closest('.input-container').classList.add('error');
    }
};