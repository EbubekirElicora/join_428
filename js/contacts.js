// Function to show the overlay
function showOverlay() {
    let overlay = document.getElementById('overlay');
    overlay.classList.add('active'); // Add the 'active' class
}

// Function to hide the overlay
function hideOverlay() {
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('active'); // Remove the 'active' class
}
/*function createContact(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // Create a new contact object
    const newContact = {
        name: name,
        email: email,
        phone: phone,
        initials: getInitials(name),
        color: getRandomColor()
    };

    // Save the contact to local storage (or an array)
    saveContact(newContact);

    // Render all contacts in alphabetical order
    renderContacts();

    // Clear the form fields
    document.getElementById('contact-form').reset();

    // Hide the overlay (optional)
    hideOverlay();
}

// Helper function to get initials from a name
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

// Function to save the contact (to local storage or an array)
let contacts = []; // Array to store contacts (or use localStorage)

function saveContact(contact) {
    contacts.push(contact);
    // Optionally, save to localStorage:
    // localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Function to render all contacts in alphabetical order
function renderContacts() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = ''; // Clear the content div

    // Sort contacts alphabetically by name
    contacts.sort((a, b) => a.name.localeCompare(b.name));

    // Group contacts by their first letter
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
        // Add a section header for the letter
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
                    <p>${contact.phone}</p>
                </div>
            `;
            contentDiv.appendChild(newContact);
        }
    }
}

// Function to hide the overlay (if you have one)
*/


document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";

    // Helper function to get initials from a name
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
            return data; // Return the Firebase response
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
                    contacts.push({ id: key, ...data[key] }); // Add Firebase ID to each contact
                }
                return contacts;
            })
            .catch(error => {
                console.error('Error fetching contacts:', error);
                return [];
            });
    }

    // Function to render all contacts in alphabetical order
    function renderContacts() {
        const contentDiv = document.getElementById('content');
        if (!contentDiv) {
            console.error('Content div not found!');
            return;
        }
        contentDiv.innerHTML = ''; // Clear the content div

        fetchContacts().then(contacts => {
            // Sort contacts alphabetically by name
            contacts.sort((a, b) => a.name.localeCompare(b.name));

            // Group contacts by their first letter
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
                // Add a section header for the letter
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
                            <p>${contact.phone}</p>
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

        // Check if elements exist
        if (!showDetailsDiv || !contactInitials || !contactName || !contactEmail || !contactPhone) {
            console.error('One or more elements not found in the DOM!');
            return;
        }

        // Show the details section
        showDetailsDiv.classList.remove('hidden');

        // Display contact details with initials beside the full name
        contactInitials.textContent = contact.initials;
        contactInitials.style.backgroundColor = contact.color;
        contactName.textContent = contact.name;

        // Display email and phone in columns
        contactEmail.textContent = contact.email;
        contactPhone.textContent = contact.phone;

        // Set up edit and delete links
        const editLink = document.getElementById('editLink');
        const deleteLink = document.getElementById('deleteLink');

        if (editLink && deleteLink) {
            editLink.onclick = () => openEditOverlay(contact);
            deleteLink.onclick = () => deleteContact(contact);
        } else {
            console.error('Edit or delete links not found!');
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
    }

    // Function to save the edited contact
    function saveEditedContact(contact) {
        const editContactName = document.getElementById('edit-contact-name');
        const editContactEmail = document.getElementById('edit-contact-email');
        const editContactPhone = document.getElementById('edit-contact-phone');

        const updatedContact = {
            name: editContactName.value,
            email: editContactEmail.value,
            phone: editContactPhone.value,
            initials: getInitials(editContactName.value),
            color: contact.color, // Keep the same color
        };

        // Update the contact in Firebase
        fetch(`${BASE_URL}/contacts/${contact.id}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedContact),
        })
        .then(() => {
            console.log('Contact updated successfully!');
            renderContacts(); // Refresh the contact list
            hideOverlay(); // Hide the overlay
        })
        .catch(error => {
            console.error('Error updating contact:', error);
        });
    }

    // Function to hide the overlay
    function hideOverlay() {
        const overlay = document.getElementById('contact-overlay');
        overlay.style.display = 'none';
    }

    // Function to delete a contact
    function deleteContact(contact) {
        if (confirm('Are you sure you want to delete this contact?')) {
            fetch(`${BASE_URL}/contacts/${contact.id}.json`, {
                method: 'DELETE',
            })
            .then(() => {
                console.log('Contact deleted successfully!');
                renderContacts(); // Refresh the contact list
                document.getElementById('showDetails').classList.add('hidden'); // Hide details section
            })
            .catch(error => {
                console.error('Error deleting contact:', error);
            });
        }
    }

    // Function to handle form submission
    function createContact(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Get input values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        // Create a new contact object
        const newContact = {
            name: name,
            email: email,
            phone: phone,
            initials: getInitials(name),
            color: getRandomColor(),
        };

        // Save the contact to Firebase
        saveContact(newContact)
            .then(() => {
                // Clear the form fields
                document.getElementById('contact-form').reset();

                // Hide the form after submission
                document.getElementById('contact-form').classList.add('hidden');

                // Render the updated contact list
                renderContacts();
            })
            .catch(error => {
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
});
// Function to hide the overlay
function hideOverlay() {
    const overlay = document.getElementById('contact-overlay');
    if (overlay) {
        overlay.style.display = 'none'; // Hide the overlay
        console.log('Overlay hidden successfully!'); // Debugging
    } else {
        console.error('Overlay element not found!'); // Debugging
    }
}

// Attach the hideOverlay function to the "X" button
document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.getElementById('close-contact-overlay');
    if (closeButton) {
        closeButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            hideOverlay(); // Call the hideOverlay function
        });
    } else {
        console.error('Close button not found!'); // Debugging
    }
});