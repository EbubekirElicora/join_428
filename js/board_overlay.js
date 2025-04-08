/**
 * An object used to temporarily store and manage the subtasks of a task that is being edited.
 * The keys are dynamic identifiers for each subtask 
 * and the values are the subtask objects containing the `title` and `completed` properties.
 * 
 * @type {Object.<string, {title: string, completed: boolean}>}
 */
let editSubTasks = {};

/**
 * Displays or hides the task overlay based on provided taskId
 * @param {string} taskId - The ID of the task to display
 */
async function overlayBoard(taskId) {
  const overlayRef = document.getElementById('board_overlay');
  if (!taskId) return hideOverlay(overlayRef);
  const task = findTaskById(taskId);
  if (!task) return;
  processSubtasks(task);
  showTaskOverlay(overlayRef, task);
}

/**
 * Hides the overlay and enables scrolling
 * @param {HTMLElement} overlayRef - The overlay element
 */
function hideOverlay(overlayRef) {
  overlayRef.classList.add('d_none');
  document.body.classList.remove('no-scroll');
}

/**
 * Finds a task by ID in the todos array
 * @param {string} taskId - The task ID to find
 * @returns {Object|undefined} The found task or undefined
 */
function findTaskById(taskId) {
  return todos.find(t => t.id === taskId);
}

/**
 * Processes subtasks into the editSubtasks format
 * @param {Object} task - The task containing subtasks
 */
function processSubtasks(task) {
  editSubtasks = Array.isArray(task.subtasks)
    ? convertArraySubtasks(task.subtasks)
    : { ...task.subtasks };
}

/**
 * Converts array format subtasks to object format
 * @param {Array} subtasks - Array of subtasks
 * @returns {Object} Subtasks in object format
 */
function convertArraySubtasks(subtasks) {
  return subtasks.reduce((acc, subtask, index) => {
    acc[`subtask-${index}-${Date.now()}`] = {
      title: typeof subtask === "string" ? subtask : subtask.title,
      completed: subtask.completed || false
    };
    return acc;
  }, {});
}

/**
 * Displays the task overlay with content
 * @param {HTMLElement} overlayRef - The overlay element
 * @param {Object} task - The task to display
 */
function showTaskOverlay(overlayRef, task) {
  overlayRef.classList.remove('d_none');
  overlayRef.innerHTML = getOverlayHtml(task);
  document.body.classList.add('no-scroll');
  renderSubtasksOverlay();
}

/**
 * Toggles subtask completion status and updates Firebase
 * @param {string} taskId - Parent task ID
 * @param {string} subtaskId - Subtask ID to toggle
 */
window.toggleSubtask = async function(taskId, subtaskId) {
  try {
    const task = findTask(taskId);
    if (!task) return;
    
    await processSubtaskToggle(task, subtaskId);
    updateSubtaskUI(taskId, subtaskId);
    updateHTML();
  } catch (error) {
    console.error("Error:", error);
  }
};

/**
 * Finds task by ID in todos array
 * @param {string} taskId - Task ID to find
 * @returns {Object|undefined} Found task or undefined
 */
function findTask(taskId) {
  return todos.find(t => t.id === taskId);
}

/**
 * Processes subtask toggle and updates Firebase
 * @param {Object} task - Parent task object
 * @param {string} subtaskId - Subtask ID to toggle
 */
async function processSubtaskToggle(task, subtaskId) {
  if (!task.subtasks || !task.subtasks[subtaskId]) return;
  
  normalizeSubtask(task, subtaskId);
  task.subtasks[subtaskId].completed = !task.subtasks[subtaskId].completed;
  await updateData(`tasks/${task.id}`, task);
}

/**
 * Normalizes subtask structure if needed
 * @param {Object} task - Parent task object
 * @param {string} subtaskId - Subtask ID to normalize
 */
function normalizeSubtask(task, subtaskId) {
  if (typeof task.subtasks[subtaskId] === 'string') {
    task.subtasks[subtaskId] = {
      title: task.subtasks[subtaskId],
      completed: false
    };
  }
}

/**
 * Updates subtask icon in UI
 * @param {string} taskId - Parent task ID
 * @param {string} subtaskId - Subtask ID to update
 */
function updateSubtaskUI(taskId, subtaskId) {
  const icon = document.querySelector(`[onclick*="${subtaskId}"] .subtask-icon`);
  if (!icon) return;
  
  const task = findTask(taskId);
  if (!task || !task.subtasks || !task.subtasks[subtaskId]) return;
  
  icon.src = `../assets/icons/contact_icon_${
    task.subtasks[subtaskId].completed ? 'check' : 'uncheck'
  }.png`;
}

/**
 * Migrates the subtasks in the tasks from a string format to an object format in Firebase and in-memory tasks.
 * If a subtask is stored as a string, it converts it into an object with `title` and `completed` properties.
 * 
 * This function updates all tasks in the database by fixing the structure of their subtasks and then saves them back.
 * It also updates in-memory tasks with the fixed subtask structure.
 * 
 * @returns {Promise<void>} A promise that resolves when all tasks have been migrated and updated in Firebase.
 */
async function migrateSubtasks() {
  const tasks = await loadData("tasks");
  for (const [taskId, task] of Object.entries(tasks)) {
    if (task.subtasks) {
      const fixedSubtasks = {};
      Object.entries(task.subtasks).forEach(([key, value]) => {
        if (typeof value === 'string') {
          fixedSubtasks[key] = { title: value, completed: false };
        } else {
          fixedSubtasks[key] = value;
        }
      });
      await updateData(`tasks/${taskId}`, { ...task, subtasks: fixedSubtasks });
    }
  }
}

/**
 * Fixes the subtasks structure in memory, converting any string subtasks to objects with `title` and `completed` properties.
 * This function iterates over all tasks in memory and ensures the correct format for subtasks.
 */
todos.forEach(task => {
  if (task.subtasks) {
    Object.keys(task.subtasks).forEach(key => {
      if (typeof task.subtasks[key] === 'string') {
        task.subtasks[key] = {
          title: task.subtasks[key],
          completed: false
        };
      }
    });
  }
});

/**
 * Calculates the completion progress of a task based on the completion status of its subtasks.
 * It returns a percentage of completed subtasks out of the total subtasks for the given task.
 * 
 * @param {Object} task - The task object containing subtasks.
 * @param {Object} task.subtasks - The subtasks of the task, each having a `completed` property.
 * @returns {number} The percentage of completed subtasks (0 to 100).
 */
function calculateProgress(task) {
  const subtasks = Object.values(task.subtasks || {});
  if (subtasks.length === 0) return 0;
  return (subtasks.filter(s => s.completed).length / subtasks.length) * 100;
}

/**
 * Returns a string showing how many subtasks are completed out of the total subtasks for a given task.
 * 
 * @param {Object} task - The task object containing subtasks.
 * @param {Object} task.subtasks - The subtasks of the task, each having a `completed` property.
 * @returns {string} A string displaying the number of completed subtasks out of the total subtasks (e.g., "3 of 5 done").
 */
function getSubtasksCounter(task) {
  const subtasks = Object.values(task.subtasks || {});
  return `${subtasks.filter(s => s.completed).length} of ${subtasks.length} done`;
}

/**
 * Prevents the click event from propagating further up the DOM tree.
 * This is useful for stopping clicks on specific elements from triggering other event listeners.
 * 
 * @param {Event} event - The event object triggered by a click.
 */
function overlayProtection(event) {
  event.stopPropagation();
}

/**
 * Deletes a task from Firebase and removes it from the local `todos` array.
 * It then updates the UI and closes the task overlay.
 * 
 * @param {string} taskId - The ID of the task to delete.
 * @returns {Promise<void>} A promise that resolves when the task is deleted successfully.
 */
async function deleteTask(taskId) {
  try {
    await deleteData(`tasks/${taskId}`);
    todos = todos.filter(task => task.id !== taskId);
    updateHTML();
    overlayBoard();
  } catch (error) {
    console.error("Uninstall error:", error);
  }
}

/**
 * Schließt das Board-Overlay und setzt den Zustand zurück.
 */
function closeOverlayBoard() {
  try {
      const overlayRef = document.getElementById('board_overlay');
      if (!overlayRef) return console.warn('Board overlay element not found');
      hideOverlay(overlayRef);
      resetBodyState();
      clearSubtasks();
      clearOverlayContent(overlayRef);
      hideDropdowns(overlayRef);
  } catch (error) {
      console.error('Error closing board overlay:', error);
  }
}

/**
* Versteckt das Overlay und entfernt den "no-scroll" Zustand.
* 
* @param {HTMLElement} overlayRef - Das Overlay-Element.
*/
function hideOverlay(overlayRef) {
  overlayRef.classList.add('d_none');
}

/**
* Setzt den "no-scroll" Zustand des Body zurück.
*/
function resetBodyState() {
  document.body.classList.remove('no-scroll');
}

/**
* Löscht die gespeicherten Subtasks.
*/
function clearSubtasks() {
  if (window.editSubtasks) {
      editSubtasks = {};
  }
}

/**
* Löscht den Inhalt des Overlays.
* 
* @param {HTMLElement} overlayRef - Das Overlay-Element.
*/
function clearOverlayContent(overlayRef) {
  const contentContainer = overlayRef.querySelector('.content-container');
  if (contentContainer) contentContainer.innerHTML = '';
}

/**
* Versteckt alle Dropdowns im Overlay.
* 
* @param {HTMLElement} overlayRef - Das Overlay-Element.
*/
function hideDropdowns(overlayRef) {
  const dropdowns = overlayRef.querySelectorAll('.dropdown-content');
  dropdowns.forEach(dropdown => dropdown.style.display = 'none');
}
