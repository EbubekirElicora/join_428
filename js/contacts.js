function showOverlay() {
    const overlay = document.getElementById('overlay');
    const addContactCircle = document.querySelector('.add-contact-circle');

    if (addContactCircle) {
        addContactCircle.classList.add('clicked');
    }

    setTimeout(() => {
        if (overlay) {
            overlay.style.display = 'block';
            overlay.classList.add('active');
        }
    }, 200);
}


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
        function showContactDetails(contact) {
            const showDetailsDiv = document.getElementById('showDetails');
            const contactInitials = document.getElementById('contactInitials');
            const contactName = document.getElementById('contactName');
            const contactEmail = document.getElementById('contactEmail');
            const contactPhone = document.getElementById('contactPhone');
    
            if (!showDetailsDiv || !contactInitials || !contactName || !contactEmail || !contactPhone) {
                console.error('One or more elements not found in the DOM!');
                return;
            }
    
            showDetailsDiv.classList.remove('hidden');
    
            contactInitials.textContent = contact.initials;
            contactInitials.style.backgroundColor = contact.color;
            contactName.textContent = contact.name;
            contactEmail.textContent = contact.email;
            contactPhone.textContent = contact.phone;
    
            const editLink = document.getElementById('editLink');
            const deleteLink = document.getElementById('deleteLink');
    
            if (editLink && deleteLink) {
                editLink.onclick = (event) => {
                    event.preventDefault();
                    openEditOverlay(contact);
                };
                deleteLink.onclick = (event) => {
                    event.preventDefault();
                    deleteContact(contact);
                };
            } else {
                console.error('Edit or delete links not found!');
            }
    
            const editLinkOverlay = document.getElementById('editLinkOverlay');
            const deleteLinkOverlay = document.getElementById('deleteLinkOverlay');
    
            if (editLinkOverlay && deleteLinkOverlay) {
                editLinkOverlay.onclick = (event) => {
                    event.preventDefault();
                    openEditOverlay(contact);
                };
                deleteLinkOverlay.onclick = (event) => {
                    event.preventDefault();
                    deleteContact(contact);
                };
            } else {
                console.error('Mobile overlay Edit or Delete links not found!');
            }
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
     * Hides the contact overlay.
     */
    function hideContactOverlay() {
        const contactOverlay = document.getElementById('contact-overlay');
        if (contactOverlay) {
            contactOverlay.style.display = 'none';
            contactOverlay.classList.remove('active');
            console.log('Contact overlay hidden');
        } else {
            console.error('Contact overlay element not found!');
        }
    }
        /**
     * Saves the edited contact details to Firebase.
     * 
     * @param {object} contact - The contact object to update.
     */

    function saveEditedContact(contact) {
        const editContactName = document.getElementById('edit-contact-name').value;
        const editContactEmail = document.getElementById('edit-contact-email').value;
        const editContactPhone = document.getElementById('edit-contact-phone').value;

        const updatedContact = {
            name: editContactName,
            email: editContactEmail,
            phone: editContactPhone,
            initials: getInitials(editContactName),
            color: contact.color,
        };


        fetch(`${BASE_URL}/contacts/${contact.id}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedContact),
        })
            .then(() => {
                console.log('Contact updated successfully!');
                hideContactOverlay();
                renderContacts();
                showContactDetails(updatedContact);
            })
            .catch(error => {
                console.error('Error updating contact:', error);
            });
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
    function createContact(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        const newContact = {
            name: name,
            email: email,
            phone: phone,
            initials: getInitials(name),
            color: getRandomColor(),
        };
    
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
                console.error('Error saving contact:', error);
            });
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
/**
 * Hides the overlay and contact overlay.
 */

function hideOverlay() {
    const overlay = document.getElementById('overlay');
    const contactOverlay = document.getElementById('contact-overlay');

    function hideElement(overlayElement) {
        if (overlayElement) {
            overlayElement.style.display = 'none'; 
            overlayElement.classList.remove('active'); 
        }
    }    
    if (overlay && overlay.style.display === 'block') {
        hideElement(overlay);
    }
    if (contactOverlay && contactOverlay.style.display === 'block') {
        hideElement(contactOverlay);
    }
}
/**
* Toggles visibility of the left and right columns on small screens.
*/
document.addEventListener('DOMContentLoaded', function () {    
    function toggleColumns() {
        const leftColumn = document.querySelector('.left-column');
        const rightColumn = document.querySelector('.right-column');

        if (window.innerWidth <= 1080) {
            leftColumn.classList.toggle('hidden');
            rightColumn.classList.toggle('active');
        }
    }

    const content = document.getElementById('content');
    if (content) {
        content.addEventListener('click', function (event) {
            if (event.target.closest('.contact-item')) {
                toggleColumns();
            }
        });
    } else {
        console.error('Element with ID "content" not found.');
    }
});

/**
 * Toggles visibility of the left and right columns.
 * Adds/removes the 'hidden' class to the left column and the 'active' class to the right column.
 */
function toggleColumns() {
    const leftColumn = document.querySelector('.left-column');
    const rightColumn = document.querySelector('.right-column');

    console.log('Left Column:', leftColumn.classList);
    console.log('Right Column:', rightColumn.classList);

    leftColumn.classList.toggle('hidden');
    rightColumn.classList.toggle('active');
}
/**
 * Toggles the mobile edit overlay and changes the button color temporarily.
 */
function toggleOverlay() {
    const mobileEditOverlay = document.getElementById('mobileEditOverlay');
    const mobileEditButton = document.querySelector('.mobileEdit-button');

    if (mobileEditOverlay) {
        mobileEditButton.style.backgroundColor = '#3498db';
        mobileEditOverlay.classList.toggle('active');
        setTimeout(() => {
            mobileEditButton.style.backgroundColor = '';
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const cancelButton = document.getElementById('cancel');
    if (cancelButton) {
        cancelButton.addEventListener('click', function (event) {
            event.preventDefault();
            hideOverlay();
        });
    } else {
        console.error('Cancel button not found!');
    }
});

 
/**
 * Adds a click event listener to the edit link to open the contact overlay after a delay.
 */
const editLink = document.getElementById('editLinkOverlay');
if (editLink) {
    editLink.addEventListener('click', function (e) {
        e.preventDefault();

        editLink.classList.add('active');

        setTimeout(() => {
            const contactOverlay = document.getElementById('contact-overlay');
            if (contactOverlay) {
                contactOverlay.style.display = 'block';
                contactOverlay.classList.add('active');
            }
        }, 2000);
    });
}

document.addEventListener('click', function (event) {
    const overlay = document.getElementById('mobileEditOverlay');
    const threeDotsButton = document.querySelector('.mobileEdit-button img');
    if (!overlay.contains(event.target) && event.target !== threeDotsButton) {
        overlay.classList.remove('active');
    }
});

/**
     * Handles click events on contact items in the content area.
     * Adds the 'active' class to the clicked contact item and removes it from others.
     * 
     * @param {Event} event - The click event.
     */
document.addEventListener('DOMContentLoaded', function () {
    const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";
    
    document.getElementById('content').addEventListener('click', function (event) {
        const contactItem = event.target.closest('.contact-item');
        if (contactItem) {
            document.querySelectorAll('.contact-item').forEach(item => {
                item.classList.remove('active');
            });

            contactItem.classList.add('active');

            console.log('Clicked on:', contactItem);
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    /**
     * Hides the contact overlay.
     */
    function hideContactOverlay() {
        const contactOverlay = document.getElementById('contact-overlay');
        if (contactOverlay) {
            contactOverlay.style.display = 'none';
            contactOverlay.classList.remove('active');
            console.log('Contact overlay hidden');
        } else {
            console.error('Contact overlay element not found!');
        }
    }

    /**
     * Handles clicks outside overlays to close them.
     * 
     * @param {Event} event - The click event.
     */
    document.addEventListener('click', function (event) {
        const overlay = document.getElementById('overlay');
        const contactOverlay = document.getElementById('contact-overlay');
        const mobileEditOverlay = document.getElementById('mobileEditOverlay');

        if (overlay && overlay.style.display === 'block' && !overlay.contains(event.target)) {
            hideOverlay();
        }

        if (contactOverlay && contactOverlay.style.display === 'block' && !contactOverlay.contains(event.target)) {
            hideContactOverlay();
        }

        if (
            mobileEditOverlay &&
            !mobileEditOverlay.contains(event.target) &&
            !event.target.closest('.mobileEdit-button')
        ) {
            mobileEditOverlay.classList.remove('active');
        }
    });
});