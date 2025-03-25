
window.isDropdownClosed = false;
window.selectedContacts = [];


// Function to save task to Firebase
async function saveTaskToFirebase(taskData) {
    const TASKS_ENDPOINT = "tasks.json";
    const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";
    try {
        const response = await fetch(`${BASE_URL}${TASKS_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        if (!response.ok) {
            throw new Error('Failed to save task to Firebase');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error saving task:', error);
        return null;
    }
}

// Function to collect task data
function collectTaskData() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('date').value;
    const priority = document.querySelector('.prioBtnUrgent.active') ? 'urgent' :
        document.querySelector('.prioBtnMedium.active') ? 'medium' :
            document.querySelector('.prioBtnLow.active') ? 'low' : 'medium';
    const category = document.getElementById('select_txt').textContent;
    if (!validateTaskForm(title, dueDate, category)) {
        return null;
    }
    const assignedContacts = selectedContacts.map(contact => {
        const contactName = typeof contact === 'string' ? contact : contact.name;
        return {
            name: contactName,
            color: getRandomColor(),
            initials: getInitials(contactName)
        };
    });
    const subtasksList = subtasks;
    return {
        title,
        description,
        dueDate,
        priority,
        category,
        assignedContacts,
        subtasks: subtasksList
    };
}

function getInitials(name) {
    if (typeof name !== 'string') {
        console.error("Invalid name:", name);
        return '';
    }
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
}

// Rest of your code...
document.addEventListener('DOMContentLoaded', function () {
    const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";
    const CONTACTS_ENDPOINT = "contacts.json";
    const contactInput = document.getElementById('contactInput');
    const dropdownContent = document.getElementById('dropdownContent');
    const dropdownIcon = document.getElementById('dropdownIcon');
    const dropdownIconUp = document.getElementById('dropdownIconUp');
    function getInitials(name) {
        const names = name.split(' ');
        const initials = names.map(n => n[0]).join('');
        return initials.toUpperCase();
    }

    // Fetch contacts from Firebase
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

    // Populate dropdown with contacts
    async function populateDropdown() {
        const contacts = await fetchContacts();
        if (!contacts) {
            console.error('No contacts found or failed to fetch.');
            return;
        }
        const dropdownContent = document.getElementById('dropdownContent');
        dropdownContent.innerHTML = '';

        Object.keys(contacts).forEach(key => {
            const contact = contacts[key];
            const contactItem = document.createElement('div');
            contactItem.className = 'contact-item'; // Add a class for styling
            const contactInfo = document.createElement('div');
            contactInfo.className = 'contact-info';
            const contactName = document.createElement('span');
            contactName.textContent = contact.name;
            const initialsContainer = document.createElement('div');
            initialsContainer.className = 'initials-container';
            initialsContainer.style.backgroundColor = getRandomColor();
            const initialsDiv = document.createElement('div');
            initialsDiv.className = 'initials';
            initialsDiv.textContent = getInitials(contact.name);
            initialsContainer.appendChild(initialsDiv);
            contactInfo.appendChild(initialsContainer);
            contactInfo.appendChild(contactName);
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox_class';
            checkbox.value = contact.email;
            checkbox.id = `contact-${key}`;
            contactItem.appendChild(contactInfo);
            contactItem.appendChild(checkbox);
            contactItem.addEventListener('click', function (event) {
                if (event.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
                contactItem.classList.toggle('selected-dropdown-item');
                if (checkbox.checked) {
                    selectedContacts.push(contact.name);
                } else {
                    selectedContacts = selectedContacts.filter(name => name !== contact.name);
                }
                updateInputField();
            });
            dropdownContent.appendChild(contactItem);
        });
    }


    // Update the input field with selected contacts
    function updateInputField() {
        console.log('Updating input field. Selected contacts:', selectedContacts); // Debugging
        contactInput.value = selectedContacts.join(', ');
        const selectedContactsInitials = document.getElementById('selectedContactsInitials');
        selectedContactsInitials.innerHTML = '';
        selectedContacts.forEach(contactName => {
            const initialsContainer = document.createElement('div');
            initialsContainer.className = 'initials-container';
            initialsContainer.style.backgroundColor = getRandomColor();
            const initialsDiv = document.createElement('div');
            initialsDiv.className = 'initials';
            initialsDiv.textContent = getInitials(contactName);
            initialsContainer.appendChild(initialsDiv);
            selectedContactsInitials.appendChild(initialsContainer);
        });
    }
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
    dropdownIcon.addEventListener('click', toggleDropdown);
    dropdownIconUp.addEventListener('click', toggleDropdown);
    document.addEventListener('click', function (event) {
        if (!dropdownIcon.contains(event.target) && !dropdownIconUp.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.style.display = 'none';
            dropdownIcon.classList.remove('d-none');
            dropdownIconUp.classList.add('d-none');
        }
    });

    populateDropdown();

    // Add event listener to the "Create Task" button
    document.getElementById('createTaskBtn').addEventListener('click', async function (event) {
        event.preventDefault();
        const taskData = collectTaskData();
        if (!taskData) {
            return;
        }
        const savedTask = await saveTaskToFirebase(taskData);
        if (savedTask) {
            showToast('Task created successfully!');
            console.log('Task saved. Resetting form...');
            resetForm();
            setTimeout(() => {
                window.location.href = '/html/board.html';
            }, 2000);
        } else {
            alert('Failed to create task. Please try again.');
        }
    });
});

// Function to reset the form
function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    document.getElementById('select_txt').textContent = 'Select task category';
    document.getElementById('added_text').innerHTML = '';
    selectedContacts = [];
    document.getElementById('contactInput').value = '';
    document.getElementById('selectedContactsInitials').innerHTML = '';
    subtasks = [];
    setPrio('medium');
}

// Define getRandomColor in the global scope
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
