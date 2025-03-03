// Function to show the overlay
function showOverlay() {
    let overlay = document.getElementById('overlay');
    overlay.classList.add('active'); 
}


const closeButton = document.querySelector('.close-button');
if (closeButton) {
    closeButton.addEventListener('click', function () {
        hideOverlay();
    });
}




document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";

   
    function getInitials(name) {
        return name.split(' ').map(part => part[0]).join('').toUpperCase();
    }

    // Function to generate a random color
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Function to save the contact to Firebase
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

    // Function to fetch contacts from Firebase
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

            // Render the grouped contacts
            for (const letter in groupedContacts) {
                
                const header = document.createElement('div');
                header.classList.add('letter-header');
                header.textContent = letter;
                contentDiv.appendChild(header);

                // Add contacts for this letter
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
                    // Add click event to show details
                    newContact.addEventListener('click', () => showContactDetails(contact));
                    contentDiv.appendChild(newContact);
                }
            }
        });
    }

    // Function to show contact details
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

        // Set up mobile overlay edit and delete links
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

    // Function to open the edit overlay
    function openEditOverlay(contact) {
        const overlay = document.getElementById('contact-overlay');
        const contactInitialsOverlay = document.getElementById('contact-initials-overlay');
        const editContactName = document.getElementById('edit-contact-name');
        const editContactEmail = document.getElementById('edit-contact-email');
        const editContactPhone = document.getElementById('edit-contact-phone');

        // Populate the overlay with contact details
        contactInitialsOverlay.textContent = contact.initials;
        contactInitialsOverlay.style.backgroundColor = contact.color;
        editContactName.value = contact.name;
        editContactEmail.value = contact.email;
        editContactPhone.value = contact.phone;

        // Show the overlay
        overlay.style.display = 'flex';

        // Set up the save button
        const saveButton = document.getElementById('save-contact-button');
        saveButton.onclick = () => saveEditedContact(contact);
        const deleteButton = document.getElementById('delete-contact-button');
        deleteButton.onclick = () => deleteContact(contact);
        
    }
    function hideContactOverlay() {
        const contactOverlay = document.getElementById('contact-overlay');
        if (contactOverlay) {
            contactOverlay.style.display = 'none'; 
            console.log('Contact overlay hidden');
        } else {
            console.error('Contact overlay element not found!'); 
        }
    }



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
// Function to delete a contact with contact-overlay integration
function deleteContact(contact) {
    fetch(`${BASE_URL}/contacts/${contact.id}.json`, {
        method: 'DELETE',
    }).then(() => {
        console.log('Contact deleted successfully!');
        renderContacts();
        hideContactOverlay(); 
        document.getElementById('showDetails').classList.add('hidden');
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
   
    // Function to delete a contact
    function deleteContact(contact) {
        fetch(`${BASE_URL}/contacts/${contact.id}.json`, {
            method: 'DELETE',
        })
        .then(() => {
            console.log('Contact deleted successfully!');            
            hideContactOverlay();            
            renderContacts();            
            document.getElementById('showDetails').classList.add('hidden');            
            if (window.innerWidth <= 960) {
                console.log('Small screen detected. Toggling back to left column...');
                toggleColumns(); 
            }
        })
        .catch(error => {
            console.error('Error deleting contact:', error);
        });
    }
    




    // Function to handle form submission
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
    
        // Save the contact to Firebase
        saveContact(newContact)
            .then((data) => {                
                showToast('Contact created successfully!');                
                newContact.id = data.name;                
                document.getElementById('contact-form').reset();              
                hideOverlay();               
                renderContacts();            
                showContactDetails(newContact);                
                if (window.innerWidth <= 960) {
                    toggleColumns();
                }
            })
            .catch(error => {
                // Show error toast
                showToast('Error saving contact. Please try again.');
                console.error('Error saving contact:', error);
            });
    }
    
    
    
    // Attach form submission handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', createContact);
    } else {
        console.error('Contact form not found!');
    }

    // Render contacts on page load
    renderContacts();
    hideOverlay();
});

      // Function to hide the overlay
      function hideOverlay() {
        const overlay = document.getElementById('overlay');
        const contactOverlay = document.getElementById('contact-overlay');
        
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        if (contactOverlay) {
            contactOverlay.classList.remove('active');
        }
    }
    
      // Function to hide the overlay
      
     

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
    // Function to toggle columns
    function toggleColumns() {
        const leftColumn = document.querySelector('.left-column');
        const rightColumn = document.querySelector('.right-column');

        // Only toggle columns on small screens (960px or smaller)
        if (window.innerWidth <= 960) {
            leftColumn.classList.toggle('hidden');
            rightColumn.classList.toggle('active');
        }
    }

    // Event delegation for dynamically populated elements
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
function toggleColumns() {
    const leftColumn = document.querySelector('.left-column');
    const rightColumn = document.querySelector('.right-column');

    console.log('Left Column:', leftColumn.classList);
    console.log('Right Column:', rightColumn.classList);

    // Toggle visibility
    leftColumn.classList.toggle('hidden');
    rightColumn.classList.toggle('active');
}
function toggleOverlay() {
    const overlay = document.getElementById('mobileEditOverlay');
    overlay.classList.toggle('active'); // Toggle the 'active' class
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


function toggleOverlay() {
    const overlay = document.getElementById('mobileEditOverlay');
    overlay.classList.toggle('active'); 
}

// Close the overlay when clicking outside of it
document.addEventListener('click', function(event) {
    const overlay = document.getElementById('mobileEditOverlay');
    const threeDotsButton = document.querySelector('.mobileEdit-button img'); 
    if (!overlay.contains(event.target) && event.target !== threeDotsButton) {
        overlay.classList.remove('active'); 
    }
});


