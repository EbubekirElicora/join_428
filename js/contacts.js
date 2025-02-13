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
