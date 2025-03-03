document.addEventListener('DOMContentLoaded', () => {
    getDateToday();
    initializeCategorySelector();
    initializeTaskForm();
    init();
});

function openOverlay() {
    document.getElementById('overlay').classList.remove('d_none');
    document.getElementById('popup_container').classList.remove('d_none');
    document.getElementById('close_img').classList.remove('d_none');
}

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

            // Dynamically load addTask.js
            const script = document.createElement('script');
            script.src = '../js/addTask.js';
            script.onload = () => {
                // Re-initialize all necessary functionality
                if (typeof initAddTask === 'function') {
                    initAddTask(); // Initialize dropdowns, contacts, etc.
                    console.log('Add Task content and script loaded successfully.');
                } else {
                    console.error('initAddTask is not defined!');
                }
            };
            document.body.appendChild(script);
        }
    } catch (error) {
        console.error('Error loading addTask.html:', error);
    }
}

function addTask() {
    openOverlay();
    loadAddTaskContent();
}

function closeOverlay() {
    document.getElementById('overlay').classList.add('d_none');
    document.getElementById('popup_container').classList.add('d_none');
    document.getElementById('popup_container').innerHTML = '';
}

let currentDraggedElement;
let todos = [];

async function init() {
    let loadedTodos = await loadData("tasks");
    todos = loadedTodos ? Object.values(loadedTodos) : [];
    updateHTML();
}

function updateHTML() {
    let categories = ["todo", "progress", "feetback", "done"];
    categories.forEach(category => {
        let container = document.getElementById(`${category}_task`);
        if (container) {
            container.innerHTML = '';
            let filteredTasks = todos.filter(task => {
                return task.category && task.category.toLowerCase() === category;
            });
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
        }
    });
}

function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(task) {
    return `<div draggable="true" ondragstart="startDragging('${task.id}')" class="task">
                <h3>${task.title}</h3>
                <p>${task.description || ''}</p>
                <p>Due: ${task.dueDate}</p>
                <p>Category: ${task.category}</p>
            </div>`;
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(category) {
    let task = todos.find(t => t.id === currentDraggedElement);
    if (task) {
        task.category = category;
        await updateData(`tasks/${task.id}`, task);
        init();
    }
}

function highlight(id) {
    document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove("drag-area-highlight");
}
