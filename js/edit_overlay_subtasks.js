let editSubtasks = {};

function showEditSubtaskContainerOverlay() {
    let edit_show_subtask_container = document.getElementById('edit_show_subtask_container');
    let edit_add_delete_container = document.getElementById('edit_add_delete_container');
    let edit_add_subtask_container = document.querySelector('.add_subtask_container');
    let edit_subtask_input = document.getElementById('edit_subtask_input');
    if (!edit_add_delete_container || !edit_add_subtask_container) return;
    edit_add_delete_container.classList.add('visible');
    edit_show_subtask_container.style.display = 'none';
    edit_add_subtask_container.classList.add('no-hover');
    edit_subtask_input.addEventListener('click', edit_show_subtask_container);
}

function deleteEditText() {
    document.getElementById('edit_subtask_input').value = '';
}

function editSubTask(id) {
    if (!editSubtasks) {
        console.error('editSubtasks ist nicht definiert.');
        return;
    }
    if (editSubtasks[id]) {
        editSubtasks[id].isEditing = true;
        renderSubtasksOverlay();
    } else {
        console.error(`Subtask mit ID ${id} nicht gefunden.`);
    }
}

function addNewEditText(event) {
    const input = document.getElementById('edit_subtask_input');
    const title = input.value.trim();
    if (!title) return;
    const subtaskId = Date.now();
    editSubtasks[subtaskId] = {
        title: title,
        completed: false,
        isEditing: false
    };

    // Sync with currentTask
    currentTask.subtasks = { ...editSubtasks };

    input.value = '';
    renderSubtasksOverlay();
}

function renderSubtasksOverlay() {
    const container = document.getElementById('edit_added_text');
    if (!container) return;
    container.innerHTML = Object.entries(editSubtasks).map(([id, subtask]) => {
        return subtask.isEditing ? renderEditMode(id, subtask) : renderViewMode(id, subtask);
    }).join('');
}

function deleteSubTaskOverlay(subtaskId) {
    const subtaskElement = document.querySelector(`.subTask[data-subtask-id="${subtaskId}"]`);
    if (subtaskElement) {
        subtaskElement.classList.add('deleting');
        setTimeout(() => {
            delete editSubtasks[subtaskId];

            // Sync with currentTask
            currentTask.subtasks = { ...editSubtasks };

            renderSubtasksOverlay();
        }, 300);
    } else {
        console.error(`Subtask with ID ${subtaskId} not found.`);
    }
}

async function saveEditedTask(taskId) {
    const updatedTask = {
        ...currentTask,
        subtasks: editSubtasks
    };
    await updateData(`tasks/${taskId}`, updatedTask);
    fetchTasks();
}

function loadTaskForEdit(task) {
    editSubtasks = {}; // Subtasks leeren

    if (!task || !task.subtasks) {
        return;
    }
    if (Array.isArray(task.subtasks)) {
        task.subtasks.forEach((subtask, index) => {
            let id = `subtask-${index}-${Date.now()}`;
            let title = "Unbenannt";
            let completed = false;

            if (typeof subtask === "string") {
                title = subtask;
            } else if (typeof subtask === "object") {
                title = subtask.title || "Unbenannt";
                completed = subtask.completed || false;
            }

            editSubtasks[id] = { title, completed, isEditing: false };
        });

    } else if (typeof task.subtasks === 'object') {

        Object.entries(task.subtasks).forEach(([id, subtask]) => {
            let title = "Unbenannt";
            let completed = false;

            if (typeof subtask === "string") {
                title = subtask;
            } else if (typeof subtask === "object") {
                title = subtask.title || "Unbenannt";
                completed = subtask.completed || false;
            }

            editSubtasks[id] = { title, completed, isEditing: false };
        });

    } else {
        console.error("Unerwartetes Format von `subtasks`:", task.subtasks);
    }
    renderSubtasksOverlay();
}


function saveSubTask(id) {
    const input = document.getElementById(`edit_input${id}`);
    const newTitle = input.value.trim();

    if (newTitle) {
        editSubtasks[id].title = newTitle;
        editSubtasks[id].isEditing = false;

        // Sync with currentTask
        currentTask.subtasks = { ...editSubtasks };
        renderSubtasksOverlay();
    }
}
