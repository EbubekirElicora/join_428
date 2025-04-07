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
         * Populates the dropdown menu with contact items.
         * Fetches contacts, clears existing content, and appends new contact elements.
         */
    async function populateDropdown() {
        const contacts = await fetchContacts();
        if (!contacts) return console.error('No contacts found or failed to fetch.');
        const dropdownContent = document.getElementById('dropdownContent');
        dropdownContent.innerHTML = '';
        Object.entries(contacts).forEach(([key, contact]) => {
            const contactItem = createContactItem(key, contact);
            dropdownContent.appendChild(contactItem);
        });
    }

    /**
     * Creates a single contact item element including info and checkbox.
     * Adds event listener to handle selection toggling.
     * 
     * @param {string} key - The key or ID of the contact.
     * @param {Object} contact - The contact object containing name and email.
     * @returns {HTMLElement} The constructed contact item element.
     */
    function createContactItem(key, contact) {
        const item = document.createElement('div');
        item.className = 'contact-item';
        const checkbox = createCheckbox(key, contact.email);
        const info = createContactInfo(contact.name);
        item.appendChild(info);
        item.appendChild(checkbox);
        item.addEventListener('click', event => {
            if (event.target !== checkbox) checkbox.checked = !checkbox.checked;
            item.classList.toggle('selected-dropdown-item');
            if (checkbox.checked) {
                selectedContacts.push(contact.name);
            } else {
                selectedContacts = selectedContacts.filter(name => name !== contact.name);
            }
            updateInputField();
        });
        return item;
    }

    /**
     * Creates a checkbox input element for the contact item.
     * 
     * @param {string} key - The contact's key used as part of the checkbox ID.
     * @param {string} email - The contact's email address used as the checkbox value.
     * @returns {HTMLInputElement} The checkbox input element.
     */
    function createCheckbox(key, email) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox_class';
        checkbox.value = email;
        checkbox.id = `contact-${key}`;
        return checkbox;
    }

    /**
     * Creates the contact information section including initials and name.
     * 
     * @param {string} name - The name of the contact.
     * @returns {HTMLElement} The contact information container.
     */
    function createContactInfo(name) {
        const info = document.createElement('div');
        info.className = 'contact-info';
        const initialsContainer = document.createElement('div');
        initialsContainer.className = 'initials-container';
        initialsContainer.style.backgroundColor = getRandomColor();
        const initials = document.createElement('div');
        initials.className = 'initials';
        initials.textContent = getInitials(name);
        initialsContainer.appendChild(initials);
        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;
        info.appendChild(initialsContainer);
        info.appendChild(nameSpan);
        return info;
    }

    /**
  * Updates the selected contacts display with initials and a count for extra contacts.
  * 
  * This function updates the `selectedContactsInitials` container by displaying the initials
  * of up to `maxInitials` selected contacts. If more than `maxInitials` contacts are selected,
  * an additional div will be appended, showing the remaining count.
  * 
  * @function updateInputField
  */
    function updateInputField() {
        const selectedContactsInitials = document.getElementById('selectedContactsInitials');
        selectedContactsInitials.innerHTML = '';
        const maxInitials = 4;
        // Display initials for up to maxInitials contacts
        selectedContacts.slice(0, maxInitials).forEach(contactName => {
            const initialsContainer = document.createElement('div');
            initialsContainer.className = 'initials-container';
            initialsContainer.style.backgroundColor = getRandomColor();
            const initialsDiv = document.createElement('div');
            initialsDiv.className = 'initials';
            initialsDiv.textContent = getInitials(contactName);
            initialsContainer.appendChild(initialsDiv);
            selectedContactsInitials.appendChild(initialsContainer);
        });
        // If there are more than maxInitials contacts, show a "+X" counter
        if (selectedContacts.length > maxInitials) {
            const remainingCount = selectedContacts.length - maxInitials;
            const remainingDiv = document.createElement('div');
            remainingDiv.className = 'remaining_contacts_addTask';
            remainingDiv.textContent = `+${remainingCount}`;
            selectedContactsInitials.appendChild(remainingDiv);
        }
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
    contactInput.addEventListener('click', toggleDropdown);
    document.addEventListener('click', function (event) {
        if (
            !dropdownIcon.contains(event.target) &&
            !dropdownIconUp.contains(event.target) &&
            !dropdownContent.contains(event.target) &&
            !contactInput.contains(event.target)
        ) {
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
