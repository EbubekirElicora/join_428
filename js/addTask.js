
// Global variables
window.subtasks = window.subtasks || {};
let isDropdownClosed = false;
let selectedContacts = []; 

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

    // Function to get initials
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
        dropdownContent.innerHTML = ''; // Clear existing dropdown content
    
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
            checkbox.id = `contact-${key}`; // Ensure unique ID for each checkbox
    
            contactItem.appendChild(contactInfo);
            contactItem.appendChild(checkbox);
    
            // Add event listener to the contactItem to toggle the selected state
            contactItem.addEventListener('click', function (event) {
                // Prevent the checkbox from being toggled twice
                if (event.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
    
                // Toggle the selected state
                contactItem.classList.toggle('selected-dropdown-item');
    
                // Update the selectedContacts array
                if (checkbox.checked) {
                    selectedContacts.push(contact.name);
                } else {
                    selectedContacts = selectedContacts.filter(name => name !== contact.name);
                }
    
                // Update the input field
                updateInputField();
            });
    
            dropdownContent.appendChild(contactItem);
        });
    }


    // Update the input field with selected contacts
    function updateInputField() {
        console.log('Updating input field. Selected contacts:', selectedContacts); // Debugging
        contactInput.value = selectedContacts.join(', ');
    
        // Clear the existing initials
        const selectedContactsInitials = document.getElementById('selectedContactsInitials');
        selectedContactsInitials.innerHTML = '';
    
        // Add the initials of the selected contacts
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

    // Add click event listener to the icons
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

    // Add event listener to the "Create Task" button
    document.getElementById('createTaskBtn').addEventListener('click', async function (event) {
        event.preventDefault(); 

        // Collect task data
        const taskData = collectTaskData();

        // Validate required fields
        if (!taskData.title || !taskData.dueDate || !taskData.category) {
            alert('Please fill in all required fields (Title, Due Date, Category).');
            return;
        }

        // Save task to Firebase
        const savedTask = await saveTaskToFirebase(taskData);

        if (savedTask) {
            showToast('Task created successfully!');
            console.log('Task saved. Resetting form...'); 

            // Reset the form
            resetForm();

            // Redirect to the board page after a short delay (e.g., 2 seconds)
            setTimeout(() => {
                window.location.href = 'board.html'; // Replace with the correct path to your board page
            }, 2000); // 2000 milliseconds = 2 seconds
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

    // Add initials to each contact object
    const assignedContacts = selectedContacts.map(contact => {
        const contactName = typeof contact === 'string' ? contact : contact.name; // Handle both strings and objects
        return {
            name: contactName,
            color: getRandomColor(), // Use the globally defined function
            initials: getInitials(contactName) // Add initials here
        };
    });

    const subtasksList = subtasks;

    // Log the assignedContacts array for debugging
    console.log("Assigned Contacts:", assignedContacts);

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
        return ''; // Return empty string if name is not a string
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
        console.log('Task saved successfully:', data);
        return data;
    } catch (error) {
        console.error('Error saving task:', error);
        return null;
    }
}

// Function to reset the form
function resetForm() {
    console.log('Resetting form...');

    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    document.getElementById('select_txt').textContent = 'Select task category';
    document.getElementById('added_text').innerHTML = '';

    selectedContacts = [];
    console.log('Selected contacts after reset:', selectedContacts);

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

function getCategoryElements() {
    return {
        category_select: document.getElementById('category_select'),
        category_dropdown: document.getElementById('category_dropdown'),
        drop_down_image: document.getElementById('drop_down_img_category'),
        selected_txt: document.getElementById('select_txt')
    };
}

function setupCategoryEventListeners(elements) {
    elements.category_select.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleCategoryDropdown(elements);
    });
}

function toggleCategoryDropdown(elements) {
    let isOpen = elements.category_dropdown.classList.toggle('show');
    elements.drop_down_image.classList.toggle('rotate180', isOpen);
}

function closeCategoryDropdown(elements) {
    elements.category_dropdown.classList.remove('show');
    elements.drop_down_image.classList.remove('rotate180');
}

function selectCategory(category, elements) {
    elements.selected_txt.textContent = category;
    closeCategoryDropdown(elements);
}

function toggleRotationDownImage() {
    let down_image = document.getElementById('drop_down_img_category');
    down_image.classList.add('rotate180');
}
function initializeCategorySelector() {
    let category_select = document.getElementById('category_select');
    
    if (!category_select) { 
        return;
    }

    category_select.addEventListener('click', function (event) {
        let selected_category = document.getElementById('select_txt');
        if (selected_category && selected_category.textContent !== 'Select task category') {
            event.stopPropagation();
            resetCategorySelector();
        }
    });
}

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

function addCategoryOptions(category_dropdown) {
    const categories = ['Technical Task', 'User Story'];
    categories.forEach(category => {
        let category_item = document.createElement('div');
        category_item.className = 'select_category';
        category_item.textContent = category;
        category_item.addEventListener('click', (event) => {
            event.stopPropagation();
            selectCategory(category, getCategoryElements());
        });
        category_dropdown.appendChild(category_item);
    });
}

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


function add_new_text(event) {
    let newSubTask = document.getElementById('subtask_input');
    if (!newSubTask.value.trim()) return;

    let id = Date.now(); // Erzeuge eine eindeutige ID
    subtasks[id] = newSubTask.value; //  Speichern im Objekt

    newSubTask.value = ''; // Input-Feld leeren
    renderSubtasks();
}

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

function renderSubtasks(editIndex = null) {
    let subtask_list = document.getElementById('added_text');
    subtask_list.innerHTML = '';

    Object.keys(subtasks).forEach(id => {
        let subtask = subtasks[id];

        if (id == editIndex) {
            subtask_list.innerHTML += subTaskProgressTemplate(id, subtask);
        } else {
            subtask_list.innerHTML += subTaskCreatedTemplate(id, subtask);
        }
    });
}

function editSubTask(id) {
    renderSubtasks(id); // Edit-Modus aktivieren
}
function saveSubTask(id) {
    let input = document.getElementById(`editInput${id}`);
    if (!input.value.trim()) return;
    
    subtasks[id] = input.value; // Aktualisieren
    renderSubtasks();
}

function deleteSubTask(id) {
    delete subtasks[id]; // Löscht den Eintrag aus dem Objekt
    renderSubtasks();
}