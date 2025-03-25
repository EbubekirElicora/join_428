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
        
    function setupMobileDeleteLink(contact) {
            const deleteLinkOverlay = document.getElementById('deleteLinkOverlay');
            if (!deleteLinkOverlay) {
                console.error('Mobile delete link not found!');
                return;
            }
            deleteLinkOverlay.onclick = (event) => {
                event.preventDefault();
                deleteContact(contact);
            };
    }
        
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
     * Opens the edit overlay for a contact.
     * 
     * @param {object} contact - The contact object to edit.
     */
    function openEditOverlay(contact) {
        const editLink = document.getElementById('editLinkOverlay');
        const overlay = document.getElementById('contact-overlay');
        const contactInitialsOverlay = document.getElementById('contact-initials-overlay');
        const editContactName = document.getElementById('edit-contact-name');
        const editContactEmail = document.getElementById('edit-contact-email');
        const editContactPhone = document.getElementById('edit-contact-phone');
    
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
        }, 1000);        
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
        
    function updateContactAPI(contactId, updatedContact) {
            return fetch(`${BASE_URL}/contacts/${contactId}.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedContact),
            });
    }   
        
    function handleUIUpdates(updatedContact) {
            hideContactOverlay();
            renderContacts();
            showContactDetails(updatedContact);
    }
        
    function handleError(error) {
            console.error('Error updating contact:', error);
    }
        
    function saveEditedContact(contact) {
        const editForm = document.querySelector('#contact-overlay .contact-details-inputs');
        const emailInput = document.getElementById('edit-contact-email');
        const email = emailInput.value;
    
        // First check if form is valid (structural validation)
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
            console.log('Contact deleted successfully!');
            renderContacts();
            hideContactOverlay();
            document.getElementById('showDetails').classList.add('hidden');
            if (window.innerWidth <= 1060) {
                console.log('Small screen detected. Toggling back to left column...');
                toggleColumns(); 
            }
        }).catch(error => {
            console.error('Error deleting contact:', error);
        });
    }

    // Event listener for closing the contact-overlay
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
        
    function createContact(event) {
        event.preventDefault();
        const emailInput = document.getElementById('email');
        
        // Check if email is valid (contains @ and .)
        if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) {
            emailInput.setCustomValidity('Email must contain both @ and .');
            emailInput.reportValidity();
            return;
        }
        
        // Clear any previous validation messages
        emailInput.setCustomValidity('');
        
        const newContact = gatherContactData();
        saveAndUpdateUI(newContact);
    }
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', createContact);
    } else {
        console.error('Contact form not found!');
    }    
    renderContacts();
    hideOverlay();
});









 




