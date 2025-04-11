/**
 * Opens the edit overlay and fills it with task data.
 * If no task ID is provided, the overlay will be closed.
 * @param {string} taskId - The ID of the task to edit
 * @async
 */
async function editOverlay(taskId) {
    if (!taskId) return closeEditOverlay();
    try {
        await setupEditOverlay(taskId);
    } catch (error) {
        console.error('Fehler in editOverlay:', error);
        closeEditOverlay();
    }
}

/**
 * Initializes the edit overlay with the necessary data and elements
 * @param {string} taskId - The ID of the task to edit
 * @async
 */
async function setupEditOverlay(taskId) {
    const overlayRef = getOverlayElement();
    if (!overlayRef) return;
    closeOverlayBoard();
    currentTask = await loadTaskData(taskId);
    if (!currentTask) return;
    renderOverlayContent(overlayRef, currentTask);
    document.body.classList.add('no-scroll');
    await initOverlayElements(overlayRef);
}

/**
 * Retrieves the overlay element from the DOM
 * @returns {HTMLElement|null} The overlay element or null if not found
 */
function getOverlayElement() {
    const overlayRef = document.getElementById('edit_overlay');
    if (!overlayRef) console.error('Overlay-Element nicht gefunden');
    return overlayRef;
}

/**
 * Loads task data based on the task ID
 * @param {string} taskId - The ID of the task to load
 * @returns {Object|null} A copy of the task data or null if not found
 */
async function loadTaskData(taskId) {
    const originalTask = todos.find(t => t.id === taskId);
    if (!originalTask) console.warn(`Aufgabe mit ID ${taskId} nicht gefunden`);
    return JSON.parse(JSON.stringify(originalTask));
}

/**
 * Renders the content of the overlay with task data
 * @param {HTMLElement} overlayRef - The overlay element
 * @param {Object} task - The task data
 */
function renderOverlayContent(overlayRef, task) {
    const overlayHTML = getOverlayEdit(task);
    if (!overlayHTML.includes('inner_content')) {
        console.error('HTML-Template enthält keinen inner_content Container');
        return;
    }
    overlayRef.classList.remove('edit_none');
    overlayRef.innerHTML = overlayHTML;
}

/**
 * Initializes all necessary overlay elements and event listeners
 * @param {HTMLElement} overlayRef - The overlay element
 * @async
 */
async function initOverlayElements(overlayRef) {
    await populateDropdown();
    const overlayContent = overlayRef.querySelector('.inner_content');
    if (!overlayContent) return;
    overlayContent.addEventListener('click', editProtection);
    setupContactInput();
    setupSaveButton(overlayRef);
    setupOverlayClickHandler(overlayRef);
}

/**
 * Resets the contact input field
 */
function setupContactInput() {
    const contactInput = document.getElementById('editContactInput');
    if (contactInput) contactInput.value = '';
}

/**
 * Adds the event listener to the save button
 * @param {HTMLElement} overlayRef - The overlay element
 */
function setupSaveButton(overlayRef) {
    const okButton = overlayRef.querySelector('.ok_button');
    if (okButton) okButton.addEventListener('click', saveChanges);
}

/**
 * Adds a click handler for the overlay (closes on click outside)
 * @param {HTMLElement} overlayRef - The overlay element
 */
function setupOverlayClickHandler(overlayRef) {
    overlayRef.addEventListener('click', (e) => {
        if (e.target === overlayRef) closeEditOverlay();
    });
}

/**
 * Closes the edit overlay and restores the original state.
 * - Hides the overlay by adding a CSS class.
 * - Enables scrolling on the page again.
 * - Clears the content of the overlay.
 * - Removes a global `currentTask` variable if it exists.
 * - Updates the UI if `updateHTML` is defined.
 */
function closeEditOverlay() {
    const overlayRef = document.getElementById('edit_overlay');
    if (!overlayRef) return;
    overlayRef.classList.add('edit_none');
    document.body.classList.remove('no-scroll');
    overlayRef.innerHTML = '';
    if (window.currentTask) {
        delete window.currentTask;
    }
    if (typeof updateHTML === "function") {
        updateHTML();
    }
}

/**
 * Initializes the date input field and sets validation rules.
 * - Sets the minimum date to the current day.
 * - Adds real-time validation when input changes.
 * - Adjusts the text color based on the validity of the date.
 * @function
 * @returns {void}
 */
function getDateTodayEdit() {
    let dateInput = document.getElementById('edit_due_date');
    if (dateInput) {
        const today = new Date();
        const localDate = today.toLocaleDateString('en-CA');
        dateInput.min = localDate;
        dateInput.addEventListener('input', function () {
            validateDate(this);
            updateDateColor.call(this);
        });
        updateDateColor.call(dateInput);
    }
}

/**
 * Validates the entered date and corrects it if needed.
 * @param {HTMLInputElement} input - The date input field.
 */
function validateDate(input) {
    const { correctedDate, needsUpdate } = checkAndCorrectDate(input.value);
    if (needsUpdate) {
        input.value = formatDate(correctedDate);
    }
}

/**
 * Checks and corrects the date.
 * @param {string} dateString - The date to check.
 * @returns {Object} Object containing corrected date and update flag.
 */
function checkAndCorrectDate(dateString) {
    const currentDate = new Date();
    const selectedDate = new Date(dateString);
    const maxYear = 2999; 
    if (isNaN(selectedDate.getTime())) {
        return { correctedDate: currentDate, needsUpdate: true };
    }
    const correctedDate = adjustDateLimits(selectedDate, currentDate, maxYear);
    return {
        correctedDate,
        needsUpdate: dateString !== formatDate(correctedDate)
    };
}

/**
 * Adjusts the date to the defined limits.
 * @param {Date} date - The date to check.
 * @param {Date} currentDate - The current date.
 * @param {number} maxYear - The maximum allowed year.
 * @returns {Date} Corrected date.
 */
function adjustDateLimits(date, currentDate, maxYear) {
    const correctedDate = new Date(date);
    if (correctedDate.getFullYear() > maxYear) {
        correctedDate.setFullYear(maxYear);
    }
    if (correctedDate < currentDate) {
        correctedDate.setTime(currentDate.getTime());
    }
    return correctedDate;
}

/**
 * Formats the date as 'YYYY-MM-DD'.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date.
 */
function formatDate(date) {
    return date.toLocaleDateString('en-CA');
}

/**
 * Updates the text color of the input field:
 * - Black for valid dates.
 * - Gray (#D1D1D1) for invalid or empty values.
 * @function
 * @returns {void}
 */
function updateDateColor() {
    const isValidDate = !isNaN(new Date(this.value));
    this.style.color = isValidDate ? 'black' : '#D1D1D1';
}