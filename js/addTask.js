
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











let isDropdownClosed = false;

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
    category_select.addEventListener('click', function (event) {
        let selected_category = this.querySelector('#select_txt');
        if (selected_category.textContent !== 'Select task category') {
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








let newtasks = [];
let subtasks = [];


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
    if (newSubTask.value == 0) {
        return false;
    }
    subtasks.push(newSubTask.value);
    newSubTask.value = '';
    renderSubtasks();
    if (event && event.type === 'click') {
        document.getElementById('add_delete_container').classList.remove('visible');
        document.getElementById('show_subtask_container').style.display = 'block';
        document.querySelector('.add_subtask_container').classList.remove('no-hover');
    }
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

function renderSubtasks(editIndex = -1) {
    let subtask_list = document.getElementById('added_text');
    subtask_list.innerHTML = '';
    subtasks.forEach((subtask, index) => {
        if (index === editIndex) {
            subtask_list.innerHTML += subTaskProgressTemplate(index, subtask);
        } else {
            subtask_list.innerHTML += subTaskCreatedTemplate(index, subtask);
        }
    });
}

function editSubTask(index) {
    renderSubtasks(index);
}

function saveSubTask(index) {
    let editedText = document.getElementById(`editInput${index}`).value;
    if (editedText.trim() !== '') {
        subtasks[index] = editedText;
    }
    renderSubtasks();
}

function deleteSubTask(index) {
    subtasks.splice(index, 1);
    renderSubtasks();
}