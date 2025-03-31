/**
 * Timeout-Referenz für den Berührungsstart (wird für lange Berührungen benötigt)
 * @type {number|null}
 */
let touchStartTimeout = null;

/**
 * Speichert die aktuell markierte Spalte (Stage), über der sich das gezogene Element befindet
 * @type {string|null}
 */
let currentHighlightedStage = null;

/**
 * Speichert die vertikale Startposition bei Berührungsbeginn (wird zur Unterscheidung zwischen Scrollen und Drag-Vorgang benötigt)
 * @type {number}
 * @description Enthält den Y-Koordinatenwert des ersten Touch-Ereignisses in Pixeln relativ zum oberen Bildschirmrand
 */
let touchStartY = 0;

/**
 * Verarbeitet den Beginn einer Berührung auf einer Aufgabe
 * @param {TouchEvent} event - Das Berührungsereignis
 * @param {string} taskId - Die ID der Aufgabe
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
 * Verarbeitet die Bewegung während der Berührung
 * @param {TouchEvent} event - Das Bewegungsereignis
 */
function handleTouchMove(event) {
    if (!currentDraggedElement) {
        const touch = event.touches[0];
        const deltaY = touch.clientY - touchStartY;
        if (Math.abs(deltaY) > 5) {
            clearTimeout(touchStartTimeout);
            touchStartTimeout = null;
            return;
        }
    }
    if (!currentDraggedElement) return;
    event.preventDefault();
    const touch = event.touches[0];
    highlightStageUnderTouch(touch.clientX, touch.clientY);
    const taskElement = document.querySelector('.dragging');
    if (taskElement) {
        const rotation = Math.min(8, Math.max(-8, touch.clientX % 10));
        taskElement.style.transform = `rotate(${rotation}deg) scale(1.02)`;
    }
}

/**
 * Ermittelt und markiert die Spalte unter der Berührung
 * @param {number} x - X-Koordinate
 * @param {number} y - Y-Koordinate
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
 * Sucht die übergeordnete Spalte
 * @param {Element} element - Das Startelement
 */
function findParentStageColumn(element) {
    while (element && !element.classList.contains('stage-column')) {
        element = element.parentElement;
    }
    return element;
}

/**
 * Verarbeitet das Ende der Berührung mit Click-Fallback
 * @param {TouchEvent|MouseEvent} event - Das Endereignis
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
