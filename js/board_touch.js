/**
 * Timeout reference for the touch start (needed for long touches)
 * @type {number|null}
 */
let touchStartTimeout = null;

/**
 * Stores the currently highlighted column (stage) where the dragged element is hovering over
 * @type {string|null}
 */
let currentHighlightedStage = null;

/**
 * Stores the vertical starting position when the touch begins (used to differentiate between scrolling and dragging)
 * @type {number}
 * @description Contains the Y-coordinate value of the first touch event in pixels relative to the top of the screen
 */
let touchStartY = 0;

/**
 * Handles the beginning of a touch event on a task
 * @param {TouchEvent} event - The touch event
 * @param {string} taskId - The ID of the task
 */
function handleTouchStart(event, taskId) {
    const touch = event.touches[0];
    touchStartY = touch.clientY;
    const taskElement = event.currentTarget;
    taskElement.style.transition = 'transform 0.5s ease';
    taskElement.style.transform = 'rotate(2deg)';
    touchStartTimeout = setTimeout(() => {
        currentDraggedElement = taskId;
        taskElement.classList.add('dragging');
        taskElement.style.transform = 'rotate(5deg)';
    }, 500);
}

/**
 * Handles the movement during a touch event
 * @param {TouchEvent} event - The move event
 */
function handleTouchMove(event) {
    if (!currentDraggedElement) {
        if (shouldCancelTouch(event)) return;
    }
    if (!currentDraggedElement) return;
    event.preventDefault();
    const touch = event.touches[0];
    highlightStageUnderTouch(touch.clientX, touch.clientY);
    updateDraggedElementStyle(touch.clientX);
}

/**
 * Checks if the touch should be canceled
 * @param {TouchEvent} event - The move event
 * @returns {boolean} - True if the movement is too large and should be canceled
 */
function shouldCancelTouch(event) {
    const touch = event.touches[0];
    const deltaY = touch.clientY - touchStartY;
    if (Math.abs(deltaY) > 5) {
        clearTimeout(touchStartTimeout);
        touchStartTimeout = null;
        return true;
    }
    return false;
}

/**
 * Updates the style transformation of the dragged element
 * @param {number} clientX - The horizontal position of the touch
 */
function updateDraggedElementStyle(clientX) {
    const taskElement = document.querySelector('.dragging');
    if (taskElement) {
        const rotation = Math.min(8, Math.max(-8, clientX % 10));
        taskElement.style.transform = `rotate(${rotation}deg) scale(1.02)`;
    }
}

/**
 * Determines and highlights the column under the touch
 * @param {number} x - X-coordinate
 * @param {number} y - Y-coordinate
 */
function highlightStageUnderTouch(x, y) {
    const element = document.elementFromPoint(x, y);
    const stageColumn = findParentStageColumn(element);
    if (stageColumn) {
        const stageId = stageColumn.id;
        if (currentHighlightedStage !== stageId) {
            if (currentHighlightedStage) removeHighlight(currentHighlightedStage);
            currentHighlightedStage = stageId;
            highlight(currentHighlightedStage);
        }
    } else if (currentHighlightedStage) {
        removeHighlight(currentHighlightedStage);
        currentHighlightedStage = null;
    }
}

/**
 * Finds the parent stage column
 * @param {Element} element - The starting element
 */
function findParentStageColumn(element) {
    while (element && !element.classList.contains('stage-column')) {
        element = element.parentElement;
    }
    return element;
}

/**
 * Handles the end of the touch event with a click fallback
 * @param {TouchEvent|MouseEvent} event - The end event
 */
function handleTouchEnd(event) {
    const taskElement = event.currentTarget;
    clearTimeout(touchStartTimeout);
    if (currentDraggedElement) {
        event.preventDefault();
        if (currentHighlightedStage) {
            moveToStage(currentHighlightedStage.replace('stage-', ''));
            removeHighlight(currentHighlightedStage);
            currentHighlightedStage = null;
        }
        taskElement.classList.remove('dragging');
        currentDraggedElement = null;
    }
    taskElement.style.transform = 'rotate(0deg)';
}
