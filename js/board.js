
/**
 * Öffnet das Overlay und das Popup-Container, indem die Klasse 'd_none' entfernt wird.
 * 
 * @returns {void}
 */
function openOverlay() {
    document.getElementById('overlay').classList.remove('d_none');
    document.getElementById('popup_container').classList.remove('d_none');
    document.getElementById('close_img').classList.remove('d_none');
}

/**
 * Lädt den HTML-Inhalt aus addTask.html und fügt ihn in den Popup-Container ein.
 * 
 * @returns {Promise<void>} - Ein Promise, das aufgelöst wird, wenn der Inhalt geladen und eingefügt wurde.
 */
async function loadAddTaskContent() {
    try {
        const response = await fetch('../html/addTask.html');
        if (!response.ok) throw new Error('Failed to load addTask.html');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const addTaskContent = doc.querySelector('.content_container_size');
        if (addTaskContent) {
            document.getElementById('popup_container').innerHTML = addTaskContent.outerHTML;
        }
    } catch (error) {
        console.error('Error loading addTask.html:', error);
    }
}

/**
 * Öffnet das Overlay und lädt den Aufgabeninhalt in den Popup-Container.
 * 
 * @returns {void}
 */
function addTask() {
    openOverlay();
    loadAddTaskContent();
}

/**
 * Schließt das Overlay und das Popup-Fenster.
 * Fügt die "d_none"-Klassen zu Overlay und Popup-Container hinzu,
 * um sie unsichtbar zu machen, und leert den Inhalt des Popup-Containers.
 *
 * @function
 * @returns {void}
 */
function closeOverlay() {
    document.getElementById('overlay').classList.add('d_none');
    document.getElementById('popup_container').classList.add('d_none');
    document.getElementById('popup_container').innerHTML = '';
}


let currentDraggedElement;
let todos = [];

/**
 * Lädt Aufgaben aus Firebase und aktualisiert das HTML.
 */
async function init() {
    todos = (await loadData("tasks")) || [];
    updateHTML();
}

/**
 * Aktualisiert das HTML, indem es die Aufgaben in die entsprechenden Kategorien lädt.
 */
function updateHTML() {
    let categories = ["todo", "progress", "feetback", "done"];
    categories.forEach(category => {
        let container = document.getElementById(`${category}_task`);
        container.innerHTML = '';
        let filteredTasks = todos.filter(task => task.category === category);
        if (filteredTasks.length === 0) {
            let placeholderText = {
                todo: "No tasks To do",
                progress: "No tasks In Progress",
                feetback: "No tasks Await Feedback",
                done: "No tasks Done"
            };
            container.innerHTML = `<div class="tasks">${placeholderText[category]}</div>`;
        } else {
            filteredTasks.forEach(task => {
                container.innerHTML += generateTodoHTML(task);
            });
        }
    });
}

/**
 * Startet das Ziehen einer Aufgabe.
 * @param {number} id - Die ID der Aufgabe.
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * Erstellt das HTML für eine Aufgabe.
 * @param {Object} task - Das Aufgabenobjekt.
 * @returns {string} - Der generierte HTML-Code der Aufgabe.
 */
function generateTodoHTML(task) {
    return `
        <div draggable="true" ondragstart="startDragging(${task.id})" class="task">
            ${task.title}
        </div>`;
}

/**
 * Ermöglicht das Ablegen eines Elements in einem Bereich.
 * @param {Event} ev - Das Dragover-Event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Verschiebt eine Aufgabe in die angegebene Kategorie.
 * @param {string} category - Der Name der Kategorie.
 */
async function moveTo(category) {
    let task = todos.find(t => t.id === currentDraggedElement);
    if (task) {
        task.category = category;
        await updateData(`tasks/${task.id}`, task);
        updateHTML();
    }
}

/**
 * Hebt den Bereich beim Ziehen hervor.
 * @param {string} id - Die ID des Containers.
 */
function highlight(id) {
    document.getElementById(id).classList.add("drag-area-highlight");
}

/**
 * Entfernt die Hervorhebung des Bereichs.
 * @param {string} id - Die ID des Containers.
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove("drag-area-highlight");
}


