/**
 * An object used to temporarily store and manage the subtasks of a task that is being edited.
 * The keys are dynamic identifiers for each subtask 
 * and the values are the subtask objects containing the `title` and `completed` properties.
 * 
 * @type {Object.<string, {title: string, completed: boolean}>}
 */
let editSubTasks = {};

/**
 * Displays the overlay for a task on the board, allowing the user to view and edit the task details.
 * If no taskId is provided, the overlay is hidden and the body scroll is restored.
 * 
 * This function fetches the task by its ID from the `todos` array, processes any subtasks into an editable format,
 * and then updates the overlay's HTML and displays it. It also disables body scrolling while the overlay is visible.
 * 
 * @param {string} taskId - The ID of the task to display in the overlay.
 * @returns {void}
 */
async function overlayBoard(taskId) {
  const overlayRef = document.getElementById('board_overlay');
  if (!taskId) {
    overlayRef.classList.add('d_none');
    document.body.classList.remove('no-scroll');
    return;
  }
  const task = todos.find(t => t.id === taskId);
  if (!task) return;
  if (Array.isArray(task.subtasks)) {
    editSubtasks = task.subtasks.reduce((acc, subtask, index) => {
      acc[`subtask-${index}-${Date.now()}`] = {
        title: typeof subtask === "string" ? subtask : subtask.title,
        completed: subtask.completed || false
      };
      return acc;
    }, {});
  } else {
    editSubtasks = { ...task.subtasks };
  }
  overlayRef.classList.remove('d_none');
  overlayRef.innerHTML = getOverlayHtml(task);
  document.body.classList.add('no-scroll');
  renderSubtasksOverlay();
}

/**
 * Toggles the completion status of a subtask (checked/unchecked) and updates the task in Firebase.
 * This function finds the task by its ID, checks if the subtask exists, and flips its `completed` status.
 * It then updates the task in Firebase and updates the UI to reflect the change.
 * 
 * @param {string} taskId - The ID of the task containing the subtask to toggle.
 * @param {string} subtaskId - The ID of the subtask whose completion status is being toggled.
 * @returns {Promise<void>} A promise that resolves when the update operation is completed.
 */
window.toggleSubtask = async function (taskId, subtaskId) {
  try {
    const task = todos.find(t => t.id === taskId);
    if (!task || !task.subtasks || !task.subtasks[subtaskId]) return;
    if (typeof task.subtasks[subtaskId] === 'string') {
      task.subtasks[subtaskId] = {
        title: task.subtasks[subtaskId],
        completed: false
      };
    }
    task.subtasks[subtaskId].completed = !task.subtasks[subtaskId].completed;
    await updateData(`tasks/${taskId}`, task);
    const icon = document.querySelector(`[onclick*="${subtaskId}"] .subtask-icon`);
    if (icon) {
      icon.src = `../assets/icons/contact_icon_${task.subtasks[subtaskId].completed ? 'check' : 'uncheck'}.png`;
    }
    updateHTML();
  } catch (error) {
    console.error("Error:", error);
  }
};

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

function closeOverlayBoard() {
  try {
      const overlayRef = document.getElementById('board_overlay');
      if (!overlayRef) {
          console.warn('Board overlay element not found');
          return;
      }
      overlayRef.classList.add('d_none');
      document.body.classList.remove('no-scroll');
      if (window.editSubtasks) {
          editSubtasks = {};
      }
      const contentContainer = overlayRef.querySelector('.content-container');
      if (contentContainer) {
          contentContainer.innerHTML = '';
      }
      const dropdowns = overlayRef.querySelectorAll('.dropdown-content');
      dropdowns.forEach(dropdown => {
          dropdown.style.display = 'none';
      });
  } catch (error) {
      console.error('Error closing board overlay:', error);
  }
}