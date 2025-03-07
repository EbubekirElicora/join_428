

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
const stages = ["todo", "progress", "feedback", "done"]; 

async function init() {
    todosLoaded();
    updateHTML();
}

async function todosLoaded() {
    try {
        const loadedTodos = await loadData("tasks");
        todos = loadedTodos ? Object.entries(loadedTodos).map(([id, task]) => ({ id, ...task })) : [];
        updateHTML();
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

function updateHTML() {
    const categoryMapping = {
        "Technical Task": "todo",
        "User Story": "todo",
    };
    stages.forEach(stage => {
        const container = document.getElementById(`${stage}_task`);
        if (container) {
            const filteredTasks = todos.filter(task => {
                return task.stage 
                    ? task.stage === stage
                    : categoryMapping[task.category] === stage;
            });
            container.innerHTML = filteredTasks.length > 0 
                ? filteredTasks.map(task => generateTodoHTML(task)).join('')
                : `<div class="tasks">No tasks in ${stage}</div>`;
        }
    });
}

function startDragging(id) {
    currentDraggedElement = id;
}

async function createTask(title, category, dueDate, priority, assignedContacts, subtasksArray) {
    const newTask = {
      id: Date.now().toString(),
      title,
      category,
      dueDate,
      priority,
      assignedContacts,
      subtasks: subtasksArray.reduce((acc, title, index) => {
        acc[index] = {
          title: title,
          completed: false
        };
        return acc;
      }, {})
    };
    await postData("tasks", newTask);
    todos.push(newTask);
    updateHTML();
  }


function resetForm() {
    document.getElementById("taskTitle").value = '';
    document.getElementById("taskDescription").value = '';
    document.getElementById("taskDueDate").value = '';
    selectedContacts = [];
    subtasks = [];
    updateAssignedContactsDisplay();
    updateSubtasksDisplay();
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveToStage(targetStage) {
    if (!currentDraggedElement) return;
    try {
        const task = todos.find(t => t.id === currentDraggedElement);
        await updateData(`tasks/${currentDraggedElement}`, { 
            ...task, 
            stage: targetStage
        });
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
      todos = data ? Object.entries(data).map(([id, task]) => {
        if (task.subtasks) {
          const fixedSubtasks = {};
          Object.entries(task.subtasks).forEach(([key, value]) => {
            if (typeof value === 'string') {
              fixedSubtasks[key] = { title: value, completed: false };
            } else {
              fixedSubtasks[key] = value;
            }
          });
          task.subtasks = fixedSubtasks;
        }
        return { id, ...task };
      }) : [];
      updateHTML();
    } catch (error) {
      console.error("Task update error:", error);
    }
  }


let filteredTasks = todos.filter(task => {
    const taskCategory = task.category.toLowerCase();
    return taskCategory === category;
});

