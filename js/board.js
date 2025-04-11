/**
 * Waits until the DOM is fully loaded, then executes the initialization functions.
 */
document.addEventListener('DOMContentLoaded', () => { 
    initializeCategorySelector();
    initializeTaskForm();
    init();
});

/**
 * Opens the overlay and shows the popup window.
 * Removes the 'd_none' CSS class to make the elements visible.
 */
function openOverlay() {
    document.getElementById('overlay').classList.remove('d_none');
    document.getElementById('popup_container').classList.remove('d_none');
}

/**
 * Loads the content from addTask.html and initializes the form.
 */
async function loadAddTaskContent() {
    try {
        const doc = await fetchAndParseHTML('../html/addTask.html');
        const addTaskContent = doc.querySelector('.content_container_size');
        if (addTaskContent) {
            insertAddTaskContent(addTaskContent);
            await loadAddTaskScripts();
            if (typeof initAddTask === 'function') initAddTask();
            else console.error('initAddTask is not defined!');
        }
    } catch (error) {
        console.error('Error loading addTask.html:', error);
    }
}

/**
 * Fetches and parses an HTML file.
 * @param {string} url - The URL of the HTML file.
 * @returns {Document} - The parsed HTML document.
 */
async function fetchAndParseHTML(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    const html = await response.text();
    return new DOMParser().parseFromString(html, 'text/html');
}

/**
 * Inserts the loaded content into the popup container.
 * @param {Element} content - The DOM element to replace.
 */
function insertAddTaskContent(content) {
    const popupContainer = document.getElementById('popup_container');
    popupContainer.replaceChildren(content.cloneNode(true));
}

/**
 * Loads the necessary JavaScript files for the addTask form.
 */
async function loadAddTaskScripts() {
    const scripts = [
        '../js/addTaskSubTasks.js',
        '../js/addTaskCategory.js',
        '../js/addTaskDate.js',
        '../js/addTaskPriority.js',
        '../js/addTaskValidation.js',
        '../js/addTask.js'
    ];
    for (const src of scripts) await loadScript(src);
}

/**
 * Dynamically loads a single script.
 * @param {string} src - The path to the JS file.
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
    });
}

/**
 * Opens the overlay and loads the form for creating a new task.
 * Calls `openOverlay()` to make the popup visible,
 * then loads the content from `addTask.html` with `loadAddTaskContent()`.
 */
function addTask() {
    openOverlay();
    loadAddTaskContent();
}

/**
 * Closes the overlay and the popup window.
 * Adds the 'd_none' CSS class to hide the elements,
 * and clears the content of the popup container.
 */
function closeOverlay() {
    document.getElementById('overlay').classList.add('d_none');
    document.getElementById('popup_container').classList.add('d_none');
    document.getElementById('popup_container').innerHTML = '';
}

/** 
 * Stores the currently dragged (dragged) element for the drag-and-drop functionality.
 * @type {HTMLElement | null}
 */
let currentDraggedElement;

/**
 * Contains the list of all tasks.
 * @type {Array<Object>}
 */
let todos = [];

/**
 * Defines the different stages of a task in the workflow.
 * @type {Array<string>}
 * @constant
 */
const stages = ["todo", "progress", "feedback", "done"]; 

/**
 * Initializes the application by loading the tasks and updating the HTML view.
 * @async
 * @function init
 * @returns {Promise<void>} A promise that resolves after initialization.
 */
async function init() {
    todosLoaded();
    updateHTML();
}

/**
 * Loads the tasks from storage and updates the view.
 * If no data is found, `todos` is set as an empty array.
 * @async
 * @function todosLoaded
 * @returns {Promise<void>} A promise that resolves after loading the data.
 */
async function todosLoaded() {
    try {
        const loadedTodos = await loadData("tasks");
        todos = loadedTodos ? Object.entries(loadedTodos).map(([id, task]) => ({ id, ...task })) : [];
        updateHTML();
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

/**
 * Updates the HTML representation of the tasks for each stage.
 */
function updateHTML() {
    const categoryMapping = getCategoryMapping();
    stages.forEach(stage => updateStageHTML(stage, categoryMapping));
}

/**
 * Returns the category-to-stage mapping.
 * @returns {Object} - The category-to-stage mapping.
 */
function getCategoryMapping() {
    return {
        "Technical Task": "todo",
        "User Story": "todo",
    };
}

/**
 * Updates the HTML representation for a specific stage.
 * @param {string} stage - The name of the stage.
 * @param {Object} categoryMapping - The mapping of categories to stages.
 */
function updateStageHTML(stage, categoryMapping) {
    const container = document.getElementById(`${stage}_task`);
    if (!container) return;
    const filteredTasks = todos.filter(task =>
        task.stage ? task.stage === stage : categoryMapping[task.category] === stage
    );
    container.innerHTML = filteredTasks.length > 0
        ? filteredTasks.map(task => generateTodoHTML(task)).join('')
        : `<div class="tasks">No tasks in ${stage}</div>`;
}

/**
 * Stores the ID of the currently dragged (dragged) element.
 * @param {string} id - The ID of the element being dragged.
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * Creates a new task and stores it in the backend.
 * @async
 */
async function createTask(title, category, dueDate, priority, assignedContacts, subtasksArray) {
    const newTask = buildTaskObject(title, category, dueDate, priority, assignedContacts, subtasksArray);
    await postData("tasks", newTask);
    todos.push(newTask);
    updateHTML();
}

/**
 * Builds a new task object with all required properties.
 * @returns {Object} - The new task object.
 */
function buildTaskObject(title, category, dueDate, priority, assignedContacts, subtasksArray) {
    return {
        id: Date.now().toString(),
        title,
        category,
        dueDate,
        priority,
        assignedContacts,
        subtasks: buildSubtasks(subtasksArray)
    };
}

/**
 * Converts an array of subtask titles into an object.
 * @param {Array<string>} subtasksArray - The titles of the subtasks.
 * @returns {Object} - Subtasks as an object with status.
 */
function buildSubtasks(subtasksArray) {
    return subtasksArray.reduce((acc, title, index) => {
        acc[index] = { title, completed: false };
        return acc;
    }, {});
}

/**
 * Resets the form by clearing all input fields and selections.
 * Also updates the display of assigned contacts and subtasks.
 * @function resetForm
 */
function resetForm() {
    document.getElementById("taskTitle").value = '';
    document.getElementById("taskDescription").value = '';
    document.getElementById("taskDueDate").value = '';
    selectedContacts = [];
    subtasks = [];
    updateAssignedContactsDisplay();
    updateSubtasksDisplay();
}

/**
 * Allows elements to be dropped onto a target area.
 * Prevents the default browser actions that would prevent dropping.
 * @param {DragEvent} ev - The drag-and-drop event.
 * @function allowDrop
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Moves a task to a new stage.
 * Updates the task in the backend and then fetches the tasks again. 
 * @async
 * @function moveToStage
 * @param {string} targetStage - The target stage to move the task to (e.g. "todo", "progress").
 * @returns {Promise<void>} A promise that resolves when the task has been successfully moved.
 */
async function moveToStage(targetStage) {
    if (!currentDraggedElement) return;
    try {
        const task = todos.find(t => t.id === currentDraggedElement);
        await updateData(`tasks/${currentDraggedElement}`, { 
            ...task, 
            stage: targetStage
        });
        await fetchTasks();
        removeHighlight(`${targetStage}_task`);
    } catch (error) {
        console.error("Move error:", error);
    }
}

/**
 * Highlights the element with the specified ID to indicate that it is a drop target for drag-and-drop. 
 * @function highlight
 * @param {string} id - The ID of the element to highlight.
 */
function highlight(id) {
    document.getElementById(id).classList.add("drag-area-highlight");
}

/**
 * Removes the highlight from the element with the specified ID. 
 * @function removeHighlight
 * @param {string} id - The ID of the element to remove the highlight from.
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove("drag-area-highlight");
}

/**
 * Loads the tasks from the backend and updates the `todos` array.
 */
async function fetchTasks() {
    try {
        const data = await loadData("tasks");
        todos = data ? parseTasks(data) : [];
        updateHTML();
    } catch (error) {
        console.error("Task update error:", error);
    }
}

/**
 * Converts the loaded tasks into an array and fixes subtasks if necessary.
 * @param {Object} data - The data from the backend.
 * @returns {Array<Object>} - The formatted tasks array.
 */
function parseTasks(data) {
    return Object.entries(data).map(([id, task]) => {
        if (task.subtasks) task.subtasks = fixSubtasks(task.subtasks);
        return { id, ...task };
    });
}

/**
 * Fixes the subtasks if they are stored as strings.
 * @param {Object} subtasks - The subtasks in their original format.
 * @returns {Object} - The corrected subtasks.
 */
function fixSubtasks(subtasks) {
    const fixed = {};
    for (const [key, value] of Object.entries(subtasks)) {
        fixed[key] = typeof value === 'string' ? { title: value, completed: false } : value;
    }
    return fixed;
}

/**
 * Filters tasks based on the search term entered in the 'find_task' input field.
 * Only tasks whose title or description contain the search term will be shown.
 * @function taskFilter
 */
function taskFilter() {
    const searchTerm = document.getElementById('find_task').value.toLowerCase();
    const allTasks = document.querySelectorAll('.task');
    allTasks.forEach(task => {
        const title = task.querySelector('.title_find')?.textContent.toLowerCase() || '';
        const description = task.querySelector('.description_find')?.textContent.toLowerCase() || '';
        const isVisible = title.includes(searchTerm) || description.includes(searchTerm); 
        task.style.display = isVisible ? 'block' : 'none';
    });
    updateEmptyStates();
}

/**
 * Checks if any column on the board has tasks displayed.
 * If no tasks are displayed, a corresponding message is shown.
 * Otherwise, the message is hidden. 
 * @function updateEmptyStates
 */
function updateEmptyStates() {
    document.querySelectorAll('.nav_board').forEach(column => {
        const tasksContainer = column.querySelector('.board_tasks');
        if (!tasksContainer) return;
        const noTaskElement = tasksContainer.querySelector('.tasks.show');
        if (!noTaskElement) return;
        const hasVisibleTasks = Array.from(tasksContainer.children).some(child => {
            return child.style.display !== 'none' 
                   && !child.classList.contains('show')
                   && child !== noTaskElement;
        }); 
        noTaskElement.style.display = hasVisibleTasks ? 'none' : 'block';
    });
}

/**
 * Adds drag-and-drop event listeners to each stage container. 
 * - For each `.stage-container`, event listeners for `dragenter`, `dragleave`, and `drop` are added.
 * - When a dragged element enters the container, the default behavior is prevented, and the container is highlighted.
 * - When a dragged element leaves the container, the highlight is removed.
 * - When the element is dropped, the default behavior is prevented, the highlight is removed, and the `moveToStage`
 *   function is called with the target stage derived from the container's ID.
 */
document.querySelectorAll(".stage-container").forEach(container => {
    container.addEventListener("dragenter", (ev) => {
        ev.preventDefault();
        highlight(container.id);
    });
    container.addEventListener("dragleave", () => {
        removeHighlight(container.id);
    });
    container.addEventListener("drop", (ev) => {
        ev.preventDefault();
        removeHighlight(container.id);
        const targetStage = container.id.replace("_task", ""); 
        moveToStage(targetStage);
    });
});

