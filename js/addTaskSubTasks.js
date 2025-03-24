window.subtasks = window.subtasks || {};

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

