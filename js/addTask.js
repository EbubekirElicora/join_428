
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