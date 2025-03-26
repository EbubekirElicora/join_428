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
 * Verarbeitet den Beginn einer Berührung auf einer Aufgabe
 * @param {TouchEvent} event - Das Berührungsereignis
 * @param {string} taskId - Die ID der Aufgabe
 */
function handleTouchStart(event, taskId) {
    event.preventDefault();
    touchStartTimeout = setTimeout(() => {
        currentDraggedElement = taskId;
        event.target.classList.add('dragging');
    }, 500);
}

/**
 * Verarbeitet die Bewegung während der Berührung
 * @param {TouchEvent} event - Das Bewegungsereignis
 */
function handleTouchMove(event) {
    if (!currentDraggedElement) return;
    event.preventDefault();
    const touch = event.touches[0];
    highlightStageUnderTouch(touch.clientX, touch.clientY);
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
 * Verarbeitet das Ende der Berührung
 * @param {TouchEvent} event - Das Endereignis
 */
function handleTouchEnd(event) {
    clearTimeout(touchStartTimeout);
    if (currentDraggedElement) {
        event.preventDefault();
        if (currentHighlightedStage) {
            moveToStage(currentHighlightedStage.replace('stage-', ''));
            removeHighlight(currentHighlightedStage);
            currentHighlightedStage = null;
        }
        document.querySelector('.dragging')?.classList.remove('dragging');
        currentDraggedElement = null;
    }
}