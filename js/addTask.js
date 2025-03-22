// Global variables

let isDropdownClosed = false;
let selectedContacts = [];

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
            updateDateColor.call(this);
        };
    }
}

/**
 * This function updates the color of the date input
 * 
 */
function updateDateColor() {
    this.style.color = this.value && this.value !== "yyyy-mm-dd" ? 'black' : '#D1D1D1';
}

/**
 * This function sets the button to activated
 * 
 * @param {string} priority - The priority level to set
 */
function setPrio(prio) {
    document.querySelectorAll('.prioBtnUrgent, .prioBtnMedium, .prioBtnLow').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.prioBtn${prio.charAt(0).toUpperCase() + prio.slice(1)}`).classList.add('active');
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

    // Add initials to each contact object
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

//create task functions//
function to_open_category_dropdown() {
    if (isDropdownClosed) return;
    let elements = getCategoryElements();
    setupCategoryEventListeners(elements);
    addCategoryOptions(elements.category_dropdown);
    isDropdownClosed = true;
    document.addEventListener('click', (event) => {
        if (!elements.category_select.contains(event.target) && !elements.category_dropdown.contains(event.target)) {
            closeCategoryDropdown(elements);
        }
    });
}

/**
 * This function retrieves the necessary DOM elements for the category dropdown
 * 
 *@returns {Object} An object containing references to the category-related DOM elements
 */
function getCategoryElements() {
    return {
        category_select: document.getElementById('category_select'),
        category_dropdown: document.getElementById('category_dropdown'),
        drop_down_image: document.getElementById('drop_down_img_category'),
        selected_txt: document.getElementById('select_txt')
    };
}

/**
 * This function sets up event listeners for the category dropdown
 * 
 * @param {Object} elements - The object containing references to category-related DOM elements 
 */
function setupCategoryEventListeners(elements) {
    elements.category_select.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleCategoryDropdown(elements);
    });
}

/**
 * This function toggles the visibility of the category dropdown
 * 
 * @param {Object} elements - The object containing references to category-related DOM elements
 */
function toggleCategoryDropdown(elements) {
    let isOpen = elements.category_dropdown.classList.toggle('show');
    elements.drop_down_image.classList.toggle('rotate180', isOpen);
}

/**
 * This function toggles the rotation of the dropdown image
 * 
 */
function toggleRotationDownImage() {
    let down_image = document.getElementById('drop_down_img_category');
    down_image.classList.add('rotate180');
}

/**
 * This function selects a category and updates the UI
 * 
 * @param {string} category - The selected category 
 * @param {Object} elements - The object containing references to category-related DOM elements
 */
function selectCategory(category, elements) {
    elements.selected_txt.textContent = category;
    let errorMessage = document.querySelector('.category_container .errorMessage');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
    elements.category_select.classList.remove('inputError');
    closeCategoryDropdown(elements);
}

/**
 * This function closes the category dropdown
 * 
 * @param {Object} elements - The object containing references to category-related DOM elements
 */
function closeCategoryDropdown(elements) {
    elements.category_dropdown.classList.remove('show');
    elements.drop_down_image.classList.remove('rotate180');
}

/**
 * This function initializes the category selector with event listeners
 * 
 */
function initializeCategorySelector() {
    let category_select = document.getElementById('category_select');
    category_select.addEventListener('click', function (event) {
        let selected_category = document.getElementById('select_txt');
        if (selected_category && selected_category.textContent !== 'Select task category') {
            event.stopPropagation();
            resetCategorySelector();
        }
    });
}

/**
 * This function resets the category selector to its default state
 * 
 */
function resetCategorySelector() {
    let selected_txt = document.getElementById('select_txt');
    selected_txt.textContent = 'Select task category';
    let category_dropdown = document.getElementById('category_dropdown');
    category_dropdown.classList.add('show');
    let drop_down_image = document.getElementById('drop_down_img_category');
    drop_down_image.classList.add('rotate180');
}
document.addEventListener('DOMContentLoaded', function () {
    if (typeof initializeCategorySelector === 'function') {
        initializeCategorySelector();
    }
});

/**
 * This function adds category options to the dropdown
 * 
 * @param {HTMLElement} category_dropdown - The dropdown element to populate with options 
 */
function addCategoryOptions(category_dropdown) {
    const categories = ['Technical Task', 'User Story'];
    categories.forEach(category => {
        let category_item = document.createElement('div');
        category_item.className = 'select_category';
        category_item.textContent = category;
        category_item.addEventListener('click', function (event) {
            event.stopPropagation();
            selectCategory(category, getCategoryElements()); // Hier wird die Funktion aufgerufen!
        });
        category_dropdown.appendChild(category_item);
    });
}

window.subtasks = window.subtasks || {};


/**
 * This function displays the input container for subtasks
 * 
 */
function show_subtask_container() {
    {
        let add_delete_container = document.getElementById('add_delete_container');
        let show_subtask_container = document.getElementById('show_subtask_container');
        let add_subtask_container = document.querySelector('.add_subtask_container');
        let subtask_input = document.getElementById('subtask_input');
        add_delete_container.classList.add('visible');
        show_subtask_container.style.display = 'none';
        add_subtask_container.classList.add('no-hover');
        subtask_input.addEventListener('click', show_subtask_container);
    }
}

/**
 * This function deletes the current text in the subtask input
 * 
 */
function delete_text() {
    let add_delete_container = document.getElementById('add_delete_container');
    let show_subtask_container = document.getElementById('show_subtask_container');
    let add_subtask_container = document.querySelector('.add_subtask_container');
    let subtask_input = document.getElementById('subtask_input');
    subtask_input.value = "";
    show_subtask_container.style.display = 'block';
    add_delete_container.classList.remove('visible');
    add_subtask_container.classList.remove('no-hover');
    subtask_input.removeEventListener('click', show_subtask_container);
}

/**
 * This function adds a new subtask to the list
 * 
 * @param {event} event - The event that triggered the function
 *
 */
function add_new_text(event) {
    let newSubTask = document.getElementById('subtask_input');
    if (!newSubTask.value.trim()) return;
    let id = Date.now();
    subtasks[id] = {
        title: newSubTask.value,
        completed: false,
        isEditing: false
    };
    newSubTask.value = '';
    renderSubtasks();
}

/**
 * This function hides the subtask input container when clicking outside
 * 
 */
function hideInputSubTaksClickContainerOnOutsideClick() {
    document.addEventListener('click', function (event) {
        let add_delete_container = document.getElementById('add_delete_container');
        let show_subtask_container = document.getElementById('show_subtask_container');
        let add_subtask_container = document.querySelector('.add_subtask_container');
        let subtask_input = document.getElementById('subtask_input');
        if (!add_delete_container.contains(event.target) &&
            !subtask_input.contains(event.target) &&
            !show_subtask_container.contains(event.target)) {
            add_delete_container.classList.remove('visible');
            show_subtask_container.style.display = 'block';
            add_subtask_container.classList.remove('no-hover');
        }
    });
}

/**
 * This function renders the list of subtasks
 * 
 * @param {number} editIndex - The index of the subtask to edit
 */
function renderSubtasks(editIndex = null) {
    let subtask_list = document.getElementById('added_text');
    subtask_list.innerHTML = '';

    Object.keys(subtasks).forEach(id => {
        let subtask = subtasks[id];

        if (typeof subtask === 'string') {
            subtask = { title: subtask, completed: false, isEditing: false };
            subtasks[id] = subtask;
        }
        if (id == editIndex) {
            subtask_list.innerHTML += subTaskProgressTemplate(id, subtask.title);
        } else {
            subtask_list.innerHTML += subTaskCreatedTemplate(id, subtask.title);
        }
    });
}

/**
 * This function enables editing mode for a specific subtask
 * 
 * @param {number} id - The id of the subtask to edit
 */
function editSubTask(id) {
    renderSubtasks(id); // Edit-Modus aktivieren
}

/**
 * This function saves the edited subtask
 * 
 * @param {number} id - The id of the subtask to save 
 */
function saveSubTask(id) {
    let input = document.getElementById(`editInput${id}`);
    if (!input.value.trim()) return;
    subtasks[id] = input.value; // Aktualisieren
    renderSubtasks();
}

/**
 * This function deletes a subtask from the list
 * 
 * @param {number} index - The index of the subtask to delete
 */
function deleteSubTask(id) {
    delete subtasks[id]; // Löscht den Eintrag aus dem Objekt
    renderSubtasks();
}

/**
/ This function sets up validation for the title field
* 
*/
function fieldRequiredTitle() {
    let titleInput = document.getElementById('title');
    if (titleInput) {
        titleInput.onfocus = validateTitleField;
        titleInput.oninput = validateTitleField;
        titleInput.onblur = validateTitleField;
        validateTitleField.call(titleInput);
    }
}

/**
* This function validates the title field
* 
*/
function validateTitleField() {
    let errorMessage = this.nextElementSibling;
    if (!this.value) {
        this.classList.add('inputError');
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'This field is required';
    } else {
        this.classList.remove('inputError');
        errorMessage.style.display = 'none';
    }
}

/**
* This function sets up validation for the date field
* 
*/
function fieldRequiredDate() {
    let dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.onchange = updateDateColor;
        dateInput.onfocus = validateDateField;
        dateInput.oninput = validateDateField;
        dateInput.onblur = validateDateField;
        updateDateColor.call(dateInput);
        validateDateField.call(dateInput);
    }
}

/**
 * This function validates the title field
 * 
 */
function validateDateField() {
    let errorMessage = this.nextElementSibling;
    if (!this.value) {
        this.classList.add('inputError');
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'This field is required';
    } else {
        this.classList.remove('inputError');
        errorMessage.style.display = 'none';
    }
}

/**
 * - This function sets up validation for the category field
 * 
 */
function fieldRequiredCategory() {
    let categorySelector = document.getElementById('category_select');
    let selectedText = document.getElementById('select_txt');
    let errorMessage = document.querySelector('.category_container .errorMessage');
    if (!selectedText || !errorMessage) return;
    if (selectedText.textContent === 'Select task category') {
        categorySelector.classList.add('inputError');
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'This field is required';
    } else {
        categorySelector.classList.remove('inputError');
        errorMessage.style.display = 'none';
    }
}

/**
 * This function validates the task form inputs
 * 
 * @param {string} title - The task title
 * @param {string} dueDate - The task due date 
 * @param {string} category - The task category
 * @returns {boolean} True if the form is valid, false otherwise
 */
function validateTaskForm(title, dueDate, category) {
    let isValid = true;
    if (!title) {
        fieldRequiredTitle();
        isValid = false;
    }
    if (!dueDate) {
        fieldRequiredDate();
        isValid = false;
    }
    if (category === 'Select task category') {
        fieldRequiredCategory();
        isValid = false;
    }
    return isValid;
}

/**
 * This function validates the category field
 * 
 */
function validateCategoryField() {
    let selectedText = document.getElementById('select_txt');
    let errorMessage = document.querySelector('.category_container .errorMessage');
    if (selectedText.textContent === 'Select task category') {
        this.classList.add('inputError');
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'This field is required';
        }
    } else {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }
}
