/**
 * An object that stores subtasks being edited, where each key is a task ID
 * and the value is the subtask data in edit mode.
 *
 * @type {Object.<string, {title: string, isCompleted: boolean, isEditing: boolean}>}
 * @property {Object} [key] - Key is the task ID string
 * @property {string} key.title - The title of the subtask
 * @property {boolean} key.isCompleted - Completion status of the subtask
 * @property {boolean} key.isEditing - Whether the subtask is in edit mode
 */
let editSubtasks = {};

/**
 * Displays the subtask editing container overlay by toggling visibility of relevant elements.
 * 
 * Reveals the container for adding or deleting subtasks and hides the container for viewing subtasks.
 * Sets up an event listener to show the subtask container when the input field is clicked.
 */
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

/**
 * Clears the value in the subtask input field.
 * 
 * This function is typically used to reset the input field after adding a subtask or canceling the task creation.
 */
function deleteEditText() {
    document.getElementById('edit_subtask_input').value = '';
}

/**
 * Toggles the editing mode for a specific subtask by setting the `isEditing` flag to `true`.
 * 
 * This function triggers the UI update to render the subtask in edit mode.
 * 
 * @param {string} id - The ID of the subtask to edit.
 */
function editSubTaskOverlay(id) {
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

/**
 * Adds a new subtask by generating a unique ID and storing the subtask's title and completion status.
 * 
 * After adding the subtask, the input field is cleared, and the task list is re-rendered.
 * 
 * @param {Event} event - The event triggered when a new subtask is added.
 */
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
    currentTask.subtasks = { ...editSubtasks };
    input.value = '';
    renderSubtasksOverlay();
}

/**
 * Renders the subtasks in the overlay, displaying either the edit or view mode for each subtask.
 * 
 * This function updates the HTML content of the subtask container, showing the tasks based on their current state.
 */
function renderSubtasksOverlay() {
    const container = document.getElementById('edit_added_text');
    if (!container) return;
    container.innerHTML = Object.entries(editSubtasks).map(([id, subtask]) => {
        return subtask.isEditing ? renderEditMode(id, subtask) : renderViewMode(id, subtask);
    }).join('');
}

/**
 * Deletes a subtask from the overlay and updates the task's subtasks list.
 * 
 * This function animates the removal of the subtask and updates the UI after a brief delay.
 * 
 * @param {string} subtaskId - The ID of the subtask to delete.
 */
function deleteSubTaskOverlay(subtaskId) {
    const subtaskElement = document.querySelector(`.subTask[data-subtask-id="${subtaskId}"], .subTaskEdit[data-subtask-id="${subtaskId}"]`);
    if (subtaskElement) {
        subtaskElement.classList.add('deleting');
        setTimeout(() => {
            delete editSubtasks[subtaskId];
            currentTask.subtasks = { ...editSubtasks };
            renderSubtasksOverlay();
        }, 200);
    } else {
        console.error(`Subtask with ID ${subtaskId} not found.`);
    }
}

/**
 * Saves the edited task by updating its subtasks and syncing the changes with the backend.
 * 
 * This function sends the updated task to the backend and refreshes the task list.
 * 
 * @param {string} taskId - The ID of the task to save.
 */
async function saveEditedTask(taskId) {
    const updatedTask = {
        ...currentTask,
        subtasks: editSubtasks
    };
    await updateData(`tasks/${taskId}`, updatedTask);
    fetchTasks();
}

/**
 * Loads task subtasks for editing
 * @param {Object} task - Task object to load
 */
function loadTaskForEdit(task) {
    editSubtasks = {};
    if (!task?.subtasks) return; 
    if (Array.isArray(task.subtasks)) {
        processArraySubtasks(task.subtasks);
    } else if (typeof task.subtasks === 'object') {
        processObjectSubtasks(task.subtasks);
    } else {
        handleInvalidSubtasks(task.subtasks);
    }
    renderSubtasksOverlay();
}

/**
 * Processes array format subtasks
 * @param {Array} subtasks - Array of subtasks
 */
function processArraySubtasks(subtasks) {
    subtasks.forEach((subtask, index) => {
        const id = `subtask-${index}-${Date.now()}`;
        editSubtasks[id] = normalizeSubtask(subtask);
    });
}

/**
 * Processes object format subtasks
 * @param {Object} subtasks - Subtasks object
 */
function processObjectSubtasks(subtasks) {
    Object.entries(subtasks).forEach(([id, subtask]) => {
        editSubtasks[id] = normalizeSubtask(subtask);
    });
}

/**
 * Normalizes subtask to standard format
 * @param {string|Object} subtask - Subtask to normalize
 * @returns {Object} Normalized subtask
 */
function normalizeSubtask(subtask) {
    const title = getSubtaskTitle(subtask);
    const completed = getSubtaskCompleted(subtask);
    return { title, completed, isEditing: false };
}

/**
 * Extracts title from subtask
 * @param {string|Object} subtask - Subtask to process
 * @returns {string} Subtask title
 */
function getSubtaskTitle(subtask) {
    if (typeof subtask === "string") return subtask;
    return subtask?.title || "Unbenannt";
}

/**
 * Extracts completed status from subtask
 * @param {string|Object} subtask - Subtask to process
 * @returns {boolean} Completion status
 */
function getSubtaskCompleted(subtask) {
    return typeof subtask === "object" ? subtask.completed || false : false;
}

/**
 * Handles invalid subtasks format
 * @param {any} subtasks - Invalid subtasks data
 */
function handleInvalidSubtasks(subtasks) {
    console.error("Unerwartetes Format von `subtasks`:", subtasks);
}

/**
 * Saves the edited title of a specific subtask and updates its state.
 * 
 * This function updates the subtask's title and sets the `isEditing` flag to `false`.
 * 
 * @param {string} id - The ID of the subtask to save.
 */
function saveSubTaskOverlay(id) {
    const input = document.getElementById(`edit_input${id}`);
    const newTitle = input.value.trim();
    if (newTitle) {
        editSubtasks[id].title = newTitle;
        editSubtasks[id].isEditing = false;
        currentTask.subtasks = { ...editSubtasks };
        renderSubtasksOverlay();
    }
}
