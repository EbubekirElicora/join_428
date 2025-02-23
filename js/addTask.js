/**
 * This function sets the date input to today's date
 * 
 */
function getDateToday() {
    let dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
        dateInput.onclick = function () {
            if (this.value === "yyyy-mm-dd") {
                this.value = new Date().toISOString().split('T')[0];
            }
        };
    }
}


function setPrio(prio) {
    document.querySelectorAll('.prioBtnUrgent, .prioBtnMedium, .prioBtnLow').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.prioBtn${prio.charAt(0).toUpperCase() + prio.slice(1)}`).classList.add('active');
}
document.addEventListener('DOMContentLoaded', function () {
    const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";
    const CONTACTS_ENDPOINT = "contacts.json"; //

    const contactInput = document.getElementById('contactInput');
    const dropdownContent = document.getElementById('dropdownContent');
    const dropdownIcon = document.getElementById('dropdownIcon');
    const dropdownIconUp = document.getElementById('dropdownIconUp');
    let selectedContacts = []; 

    
    function getInitials(name) {
        const names = name.split(' ');
        const initials = names.map(n => n[0]).join('');
        return initials.toUpperCase();
    }
    
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

   
    async function fetchContacts() {
        try {
            const response = await fetch(`${BASE_URL}${CONTACTS_ENDPOINT}`);
            if (!response.ok) {
                throw new Error('Failed to fetch contacts');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching contacts:', error);
            return null;
        }
    }

    
    async function populateDropdown() {
        const contacts = await fetchContacts();

        if (!contacts) {
            console.error('No contacts found or failed to fetch.');
            return;
        }

        dropdownContent.innerHTML = '';

        
        Object.keys(contacts).forEach(key => {
            const contact = contacts[key];
            const contactItem = document.createElement('div');

            // Create a container for the contact info (name and initials)
            const contactInfo = document.createElement('div');
            contactInfo.className = 'contact-info';

            // Create a span for the contact name
            const contactName = document.createElement('span');
            contactName.textContent = contact.name;

            const initialsContainer = document.createElement('div');
            initialsContainer.className = 'initials-container';
            initialsContainer.style.backgroundColor = getRandomColor();

            // Create a div for the initials
            const initialsDiv = document.createElement('div');
            initialsDiv.className = 'initials';
            initialsDiv.textContent = getInitials(contact.name);

            // Append initials to the background container
            initialsContainer.appendChild(initialsDiv);

            // Append name and initials to the contact info container
            contactInfo.appendChild(initialsContainer);
            contactInfo.appendChild(contactName);

            // Create a checkbox for the contact
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = contact.email;
            checkbox.id = `contact-${key}`;

            
            contactItem.appendChild(contactInfo);
            contactItem.appendChild(checkbox);

            
            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    selectedContacts.push(contact.name); 
                } else {
                    selectedContacts = selectedContacts.filter(name => name !== contact.name); 
                }
                updateInputField(); 
            });

            dropdownContent.appendChild(contactItem);
        });
    }

    
    function updateInputField() {
        contactInput.value = selectedContacts.join(', '); 
    }

    // Toggle dropdown visibility
    function toggleDropdown() {
        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
            dropdownIcon.classList.remove('d-none');
            dropdownIconUp.classList.add('d-none');
        } else {
            dropdownContent.style.display = 'block';
            dropdownIcon.classList.add('d-none');
            dropdownIconUp.classList.remove('d-none');
        }
    }

    // Add click event listener to the icons only
    dropdownIcon.addEventListener('click', toggleDropdown);
    dropdownIconUp.addEventListener('click', toggleDropdown);

    // Hide dropdown when clicking outside
    document.addEventListener('click', function (event) {
        if (!dropdownIcon.contains(event.target) && !dropdownIconUp.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.style.display = 'none';
            dropdownIcon.classList.remove('d-none');
            dropdownIconUp.classList.add('d-none');
        }
    });

    populateDropdown();
});