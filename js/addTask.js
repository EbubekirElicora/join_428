// This variable tracks the state of a dropdown menu.
window.isDropdownClosed = false;
// This array stores the list of selected contacts.
window.selectedContacts = [];


/**
 * Saves a task to Firebase.
 * 
 * @param {Object} taskData - The task data to save.
 * @returns {Object|null} The response data from Firebase, or null if an error occurred.
 */
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

/**
 * Collects task data from the DOM and returns it in a structured format.
 * 
 * @returns {Object|null} The collected task data or null if validation fails.
 */
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

/**
 * Generates initials from a full name.
 * 
 * @param {string} name - The full name from which to extract initials.
 * @returns {string} The initials in uppercase.
 */
function getInitials(name) {
    if (typeof name !== 'string') {
        console.error("Invalid name:", name);
        return '';
    }
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
}

document.addEventListener('DOMContentLoaded', function () {
    // Base URL for the Firebase Realtime Database
    const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";
    // Endpoint for retrieving contacts data
    const CONTACTS_ENDPOINT = "contacts.json";
    // Input field for entering a contact name
    const contactInput = document.getElementById('contactInput');
    // Dropdown menu elements
    const dropdownContent = document.getElementById('dropdownContent');
    const dropdownIcon = document.getElementById('dropdownIcon');
    const dropdownIconUp = document.getElementById('dropdownIconUp');
    function getInitials(name) {
        const names = name.split(' ');
        const initials = names.map(n => n[0]).join('');
        return initials.toUpperCase();
    }

    /**
     * Fetches contacts from the Firebase database.
     * 
     * @returns {Promise<Object|null>} A promise that resolves to the contacts data from Firebase, or null if an error occurred.
     */
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

    /**
     * Populates the dropdown with contact information fetched from Firebase.
     * 
     * This function fetches the contacts, creates HTML elements for each contact,
     * and adds them to the dropdown content for user selection.
     * 
     * @returns {Promise<void>} A promise that resolves when the dropdown has been populated.
     */
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


    /**
     * Updates the contact input field and initials display based on selected contacts.
     * 
     * This function sets the input field's value to a comma-separated list of selected contacts' names,
     * and updates the initials displayed in the UI.
     */
    function updateInputField() {
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

    /**
     * Toggles the visibility of the dropdown menu.
     * 
     * This function shows or hides the dropdown depending on its current state.
     */
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
                window.location.href = '../html/board.html';
            }, 2000);
        } else {
            alert('Failed to create task. Please try again.');
        }
    });
});

/**
 * Resets the task creation form to its initial state.
 * 
 * This function clears all the input fields, selected contacts, and subtasks, and resets the priority to "medium".
 */
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
    document.querySelectorAll('.contact-item').forEach(item => {
        item.classList.remove('selected-dropdown-item');
        let checkbox = item.querySelector('.checkbox_class');
        if (checkbox) { checkbox.checked = false; }
    });
}

/**
 * Resets all relevant values.
 * 
 * - Calls the `resetForm()` function to reset the form.
 * - Sets the priority to 'medium' by calling the `setPrio('medium')` function.
 */
function resetAll() {
    resetForm();
    setPrio('medium');
}

/**
 * Generates a random color in hexadecimal format.
 * 
 * @returns {string} A randomly generated color in the format "#RRGGBB".
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
