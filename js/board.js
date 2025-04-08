/**
 * Wartet, bis das DOM vollständig geladen ist, und führt dann die Initialisierungsfunktionen aus.
 */
document.addEventListener('DOMContentLoaded', () => { 
    initializeCategorySelector();
    initializeTaskForm();
    init();
});

/**
 * Öffnet das Overlay und zeigt das Pop-up-Fenster an.
 * Entfernt die CSS-Klasse 'd_none', um die Elemente sichtbar zu machen.
 */
function openOverlay() {
    document.getElementById('overlay').classList.remove('d_none');
    document.getElementById('popup_container').classList.remove('d_none');
}

/**
 * Lädt den Inhalt von addTask.html und initialisiert das Formular
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
 * Holt und parst eine HTML-Datei
 * @param {string} url - Die URL der HTML-Datei
 * @returns {Document} - Das geparste HTML-Dokument
 */
async function fetchAndParseHTML(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    const html = await response.text();
    return new DOMParser().parseFromString(html, 'text/html');
}

/**
 * Fügt den geladenen Inhalt in den Popup-Container ein
 * @param {Element} content - Das zu ersetzende DOM-Element
 */
function insertAddTaskContent(content) {
    const popupContainer = document.getElementById('popup_container');
    popupContainer.replaceChildren(content.cloneNode(true));
}

/**
 * Lädt notwendige JS-Dateien für das AddTask-Formular
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
 * Lädt ein einzelnes Skript dynamisch
 * @param {string} src - Der Pfad zur JS-Datei
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
 * Öffnet das Overlay und lädt das Formular zur Erstellung einer neuen Aufgabe.
 * Ruft `openOverlay()` auf, um das Pop-up-Fenster sichtbar zu machen,
 * und lädt anschließend den Inhalt von `addTask.html` mit `loadAddTaskContent()`.
 */
function addTask() {
    openOverlay();
    loadAddTaskContent();
}

/**
 * Schließt das Overlay und das Pop-up-Fenster.
 * Fügt die CSS-Klasse 'd_none' hinzu, um die Elemente auszublenden,
 * und leert den Inhalt des Pop-up-Containers.
 */
function closeOverlay() {
    document.getElementById('overlay').classList.add('d_none');
    document.getElementById('popup_container').classList.add('d_none');
    document.getElementById('popup_container').innerHTML = '';
}

/** 
 * Speichert das aktuell gezogene (dragged) Element für die Drag-and-Drop-Funktionalität.
 * @type {HTMLElement | null}
 */
let currentDraggedElement;

/**
 * Enthält die Liste aller Aufgaben (Tasks).
 * @type {Array<Object>}
 */
let todos = [];

/**
 * Definiert die verschiedenen Phasen (Stages) einer Aufgabe im Workflow.
 * @type {Array<string>}
 * @constant
 */
const stages = ["todo", "progress", "feedback", "done"]; 

/**
 * Initialisiert die Anwendung, indem die Aufgaben geladen und die HTML-Anzeige aktualisiert wird.
 * @async
 * @function init
 * @returns {Promise<void>} Eine Promise, die nach der Initialisierung aufgelöst wird.
 */
async function init() {
    todosLoaded();
    updateHTML();
}

/**
 * Lädt die Aufgaben aus dem Speicher und aktualisiert die Anzeige.
 * Falls keine Daten vorhanden sind, wird `todos` als leeres Array gesetzt.
 * @async
 * @function todosLoaded
 * @returns {Promise<void>} Eine Promise, die nach dem Laden der Daten aufgelöst wird.
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
 * Aktualisiert die HTML-Darstellung der Aufgaben für jede Stage.
 */
function updateHTML() {
    const categoryMapping = getCategoryMapping();
    stages.forEach(stage => updateStageHTML(stage, categoryMapping));
}

/**
 * Gibt die Zuordnung von Kategorien zu Standard-Stages zurück.
 * @returns {Object} - Kategorie-zu-Stage-Zuordnung
 */
function getCategoryMapping() {
    return {
        "Technical Task": "todo",
        "User Story": "todo",
    };
}

/**
 * Aktualisiert die HTML-Darstellung für eine bestimmte Stage.
 * @param {string} stage - Der Name der Stage
 * @param {Object} categoryMapping - Die Zuordnung der Kategorien zu Stages
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
 * Speichert die ID des aktuell gezogenen (dragged) Elements.
 * @param {string} id - Die ID des zu ziehenden Elements.
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * Erstellt eine neue Aufgabe und speichert sie im Backend.
 * @async
 */
async function createTask(title, category, dueDate, priority, assignedContacts, subtasksArray) {
    const newTask = buildTaskObject(title, category, dueDate, priority, assignedContacts, subtasksArray);
    await postData("tasks", newTask);
    todos.push(newTask);
    updateHTML();
}

/**
 * Baut ein neues Aufgabenobjekt mit allen erforderlichen Eigenschaften.
 * @returns {Object} - Das neue Aufgabenobjekt
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
 * Wandelt ein Array von Subtask-Titeln in ein Objekt um.
 * @param {Array<string>} subtasksArray - Die Titel der Subtasks
 * @returns {Object} - Subtasks als Objekt mit Status
 */
function buildSubtasks(subtasksArray) {
    return subtasksArray.reduce((acc, title, index) => {
        acc[index] = { title, completed: false };
        return acc;
    }, {});
}


/**
 * Setzt das Formular zurück, indem alle Eingabefelder und Auswahlmöglichkeiten gelöscht werden.
 * Aktualisiert auch die Anzeige der zugewiesenen Kontakte und Unteraufgaben.
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
 * Ermöglicht das Ablegen von Elementen auf einem Zielbereich.
 * Verhindert die Standardaktionen des Browsers, die das Ablegen verhindern würden.
 * 
 * @param {DragEvent} ev - Das Drag-and-Drop-Ereignis.
 * @function allowDrop
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Verschiebt eine Aufgabe in eine neue Stage.
 * Aktualisiert die Aufgabe im Backend und ruft anschließend die Aufgaben erneut ab.
 * 
 * @async
 * @function moveToStage
 * @param {string} targetStage - Die Ziel-Stage, in die die Aufgabe verschoben werden soll (z.B. "todo", "progress").
 * @returns {Promise<void>} Eine Promise, die aufgelöst wird, wenn die Aufgabe erfolgreich verschoben wurde.
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
 * Hebt das Element mit der angegebenen ID hervor, um anzuzeigen, dass es ein Zielbereich für Drag-and-Drop ist.
 * 
 * @function highlight
 * @param {string} id - Die ID des Elements, das hervorgehoben werden soll.
 */
function highlight(id) {
    document.getElementById(id).classList.add("drag-area-highlight");
}

/**
 * Entfernt die Hervorhebung vom Element mit der angegebenen ID.
 * 
 * @function removeHighlight
 * @param {string} id - Die ID des Elements, von dem die Hervorhebung entfernt werden soll.
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove("drag-area-highlight");
}

/**
 * Lädt die Aufgaben aus dem Backend und aktualisiert das `todos` Array.
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
 * Wandelt die geladenen Aufgaben in ein Array um und korrigiert Subtasks bei Bedarf.
 * @param {Object} data - Die Daten aus dem Backend
 * @returns {Array<Object>} - Das formatierte Aufgaben-Array
 */
function parseTasks(data) {
    return Object.entries(data).map(([id, task]) => {
        if (task.subtasks) task.subtasks = fixSubtasks(task.subtasks);
        return { id, ...task };
    });
}

/**
 * Korrigiert die Subtasks, falls sie als Strings gespeichert sind.
 * @param {Object} subtasks - Die Subtasks im ursprünglichen Format
 * @returns {Object} - Die korrigierten Subtasks
 */
function fixSubtasks(subtasks) {
    const fixed = {};
    for (const [key, value] of Object.entries(subtasks)) {
        fixed[key] = typeof value === 'string' ? { title: value, completed: false } : value;
    }
    return fixed;
}

/**
 * Filtert Aufgaben basierend auf dem Suchbegriff, der im Eingabefeld 'find_task' eingegeben wurde.
 * Zeigt nur die Aufgaben an, deren Titel oder Beschreibung den Suchbegriff enthalten.
 * 
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
 * Überprüft, ob in jeder Spalte des Boards Aufgaben angezeigt werden.
 * Wenn keine Aufgaben angezeigt werden, wird eine entsprechende Nachricht angezeigt.
 * Andernfalls wird die Nachricht ausgeblendet.
 * 
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
 * Fügt Drag-and-Drop-Event-Listener zu jedem Stage-Container hinzu.
 * 
 * - Für jedes `.stage-container` werden Event-Listener für `dragenter`, `dragleave` und `drop` hinzugefügt.
 * - Wenn ein gezogenes Element in den Container eintritt, wird das Standardverhalten verhindert und der Container hervorgehoben.
 * - Wenn ein gezogenes Element den Container verlässt, wird die Hervorhebung entfernt.
 * - Beim Ablegen des Elements wird das Standardverhalten verhindert, die Hervorhebung entfernt und die Funktion `moveToStage`
 *   mit dem Ziel-Stage, das aus der ID des Containers abgeleitet wird, aufgerufen.
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

