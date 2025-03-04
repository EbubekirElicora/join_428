

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
            const script = document.createElement('script');
            script.src = '../js/addTask.js';
            script.onload = () => {
                if (typeof initAddTask === 'function') {
                    initAddTask();
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
let categories = ["todo", "progress", "feedback", "done"];


async function init() {
    let loadedTodos = await loadData("tasks");
    todos = loadedTodos ? Object.values(loadedTodos) : []; 
    updateHTML();
    fetchTasks();
}

function updateHTML() {
    let categoryMapping = {
        "Technical Task": "todo",
        "User Story": "todo"
    };
    categories.forEach(category => {
        let container = document.getElementById(`${category}_task`);
        if (container) {
            container.innerHTML = "";
            let filteredTasks = todos.filter(task => {
                let mappedCategory = categoryMapping[task.category] || task.category;
                return mappedCategory.toLowerCase() === category;
            });
            filteredTasks.forEach(task => {
                container.innerHTML += generateTodoHTML(task);
            });
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

async function createTask() {
    const newTask = {
        title: document.getElementById("taskTitle").value.trim(),
        description: document.getElementById("taskDescription").value.trim(),
        dueDate: document.getElementById("taskDueDate").value,
        category: "todo",
    };
    if (!newTask.title) {
        alert("Title required!");
        return;
    }
    try {
        await postData("tasks", newTask);
        await fetchTasks();
        closeOverlay();
    } catch (error) {
        console.error("Create error:", error);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(category) {
    if (!currentDraggedElement) return;
    
    try {
        const task = todos.find(t => t.id === currentDraggedElement);
        await updateData(`tasks/${currentDraggedElement}`, {...task, category});
        await fetchTasks();
    } catch (error) {
        console.error("Move error:", error);
    }
}

function highlight(id) {
    document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove("drag-area-highlight");
}

async function fetchTasks() {
    try {
        const data = await loadData("tasks");
        todos = data ? Object.entries(data).map(([id, task]) => ({ id, ...task })) : [];
        updateHTML();
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

let filteredTasks = todos.filter(task => {
    const taskCategory = task.category.toLowerCase();
    return taskCategory === category;
});