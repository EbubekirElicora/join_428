
async function overlayBoard(taskId) {
    const overlayRef = document.getElementById('board_overlay');
    if (!taskId) {
        overlayRef.classList.add('d_none');
        document.body.classList.remove('no-scroll');
        return;
    }
    const task = todos.find(t => t.id === taskId);
    if (!task) return;
    overlayRef.classList.remove('d_none');
    overlayRef.innerHTML = getOverlayHtml(task);
    document.body.classList.add('no-scroll');
}

window.toggleSubtask = async function(taskId, subtaskId) {
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
        icon.src = `/assets/icons/contact_icon_${task.subtasks[subtaskId].completed ? 'check' : 'uncheck'}.png`;
      }
      updateHTML();
    } catch (error) {
      console.error("Error:", error);
    }
  };

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

function calculateProgress(task) {
    const subtasks = Object.values(task.subtasks || {});
    if (subtasks.length === 0) return 0;
    return (subtasks.filter(s => s.completed).length / subtasks.length) * 100;
}

function getSubtasksCounter(task) {
    const subtasks = Object.values(task.subtasks || {});
    return `${subtasks.filter(s => s.completed).length} of ${subtasks.length} done`;
}

function overlayProtection (event) {
    event.stopPropagation();
}

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

// chuk template//


function generateTodoHTML(task) {
    const priorityIcons = {
        urgent: '<img src="../assets/icons/prio_urgent_icon.png" alt="">',
        medium: '<img src="../assets/icons/prio_media.png" alt="">',
        low: '<img src="../assets/icons/prio_low_icon.png" alt="">'
    };
    const contactsHTML = task.assignedContacts?.slice(0, 5).map(contact => `
        <div class="contact-badge" style="background-color: ${contact.color}" title="${contact.name}">
            ${contact.initials}
        </div>
    `).join('') || '';
    
    const remainingContacts = task.assignedContacts?.length > 5 
        ? `<div class="remaining-contacts">+${task.assignedContacts.length - 5}</div>`
        : '';
    const subtasks = task.subtasks || {};
    const subtaskKeys = Object.keys(subtasks);
    const total = subtaskKeys.length;
    const done = subtaskKeys.filter(key => subtasks[key].completed).length;
    const progress = total > 0 ? (done / total) * 100 : 0;

    return `
        <div draggable="true" onclick="overlayBoard('${task.id}')" ondragstart="startDragging('${task.id}')" class="task">
            <div class="category bg_${task.category}">${task.category}</div>
            <h2>${task.title}</h2>
            <p>${task.description || ''}</p>
            <div class="progress_container">
                <div class="progress_bar">
                    <div class="progress_fill" style="width:${progress}%"></div>
                </div>
                <div class="subtasks_counter">${done}/${total} Subtasks</div>
            </div>
            <div class="priority_contact">
                ${task.assignedContacts?.length > 0 ? `
                    <div class="assigned-contacts">
                        ${contactsHTML}
                        ${remainingContacts}
                    </div>
                ` : ''}
                <span class="priority">${priorityIcons[task.priority]}</span>   
            </div>
        </div>
    `;
}




function getOverlayHtml(task) {
    const priorityIcons = {
        urgent: '<img src="../assets/icons/prio_urgent_icon.png" class="priority-icon" alt="Urgent">',
        medium: '<img src="../assets/icons/prio_media.png" class="priority-icon" alt="Medium">',
        low: '<img src="../assets/icons/prio_low_icon.png" class="priority-icon" alt="Low">'
    };

    const contactsHTML = task.assignedContacts?.map(contact => `
        <div class="contact_item ">
            <div class="contact-badge" style="background-color: ${contact.color}">
                ${contact.initials}
            </div>
            <p class="contact_name">${contact.name}</p>
        </div>
    `).join('') || '<div class="no-contacts">No contacts assigned</div>';
    const subtasksHTML = Object.entries(task.subtasks || {}).map(([subtaskId, subtask]) => {
        const normalizedSubtask = typeof subtask === 'string' 
          ? { title: subtask, completed: false } 
          : subtask;
        const title = normalizedSubtask.title || "Untitled";
        const completed = normalizedSubtask.completed;

        return `
            <div class="subtask_item" data-subtask-id="${subtaskId}" onclick="toggleSubtask('${task.id}', '${subtaskId}')">
                <img src="/assets/icons/contact_icon_${completed ? 'check' : 'uncheck'}.png" 
                     class="subtask-icon" 
                     alt="${completed ? 'Completed' : 'Uncompleted'}">
                <span>${title}</span>
            </div>
        `;
    }).join('') || '<div class="no-subtasks">No subtasks</div>';

    return `
        <div onclick="overlayProtection(event)" class="inner_content">
            <div class="header_board_overlay">
                <div class="header_category bg_${task.category}">${task.category}</div>
                <img onclick="overlayBoard()" src="../assets/icons/close.png" alt="">
            </div>
            <h1>${task.title}</h1>
            <p class="board_overlay_description">${task.description || ''}</p>
            <div class="date_olerlay">
                <p>Due Date:</p>
                <p>${task.dueDate}</p>
            </div>
            <div class="priority_overlay">
                <p>Priority:</p>
                <div class="priority_icons">
                    <p>${task.priority}</p>
                    <span> ${priorityIcons[task.priority]}</span>
                </div>
            </div>
            <div class="contact_overlay">
                <p>Assigned To:</p>
                <div class="contacts_list">
                    ${contactsHTML}
                </div>
            </div>

            <div class="subtasks_overlay">
                <p>Subtasks:</p>
                <div class="subtasks_list">
                    ${subtasksHTML}
                </div>
            </div>

            <div class="buttons">
                <button onclick="editOverlay('${task.id}')" class="img_p">
                    <img src="/assets/icons/edit.png" alt="">
                    <p>Edit</p>
                </button>
                <div class="shadow_box"></div>
                <button onclick="deleteTask('${task.id}')" class="img_p">
                    <img src="/assets/icons/delete.png" alt="">
                    <p>Delete</p>
                </button>
            </div>
        </div>
    `;
}
//chuks board JS//


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
//chuks board  edit//
async function editOverlay(taskId) {
    const overlayRef = document.getElementById('edit_overlay');
    if (!taskId) {
        overlayRef.classList.add('edit_none');
        document.body.classList.remove('no-scroll');
        return;
    }
    overlayBoard();
    const task = todos.find(t => t.id === taskId);
    if (!task) return;
    overlayRef.classList.remove('edit_none');
    overlayRef.innerHTML = getOverlayEdit(task);
    document.body.classList.add('no-scroll');
}

function getOverlayEdit(task) {
    const contactsHTML = task.assignedContacts?.slice(0, 5).map(contact => `
        <div class="contact-badge" style="background-color: ${contact.color}" title="${contact.name}">
            ${contact.initials}
        </div>
    `).join('') || '';
    
    const remainingContacts = task.assignedContacts?.length > 5 
        ? `<div class="remaining-contacts">+${task.assignedContacts.length - 5}</div>`
        : '';

    // Priority icons (reuse the same structure as in addTask HTML)
    const priorityIcons = {
        urgent: '<img src="../assets/icons/prio_urgent_icon.png">',
        medium: '<img src="../assets/icons/prio_medium_icon.png">',
        low: '<img src="../assets/icons/prio_low_icon.png">'
    };

    // Priority options (reuse the same structure as in addTask HTML)
    const priorityHTML = `
        <section class="prio_container">
            <label for="prio">Priority</label>
            <div class="prio_btn_container">
                <button onclick="setPrio('urgent')" type="button" id="prioUrgent" class="prioBtnUrgent ${task.priority === 'urgent' ? 'active' : ''}">
                    <span>Urgent</span>
                    ${priorityIcons['urgent']}
                </button>
                <button onclick="setPrio('medium')" type="button" id="prioMedium" class="prioBtnMedium ${task.priority === 'medium' ? 'active' : ''}">
                    <span>Medium</span>
                    ${priorityIcons['medium']}
                </button>
                <button onclick="setPrio('low')" type="button" id="prioLow" class="prioBtnLow ${task.priority === 'low' ? 'active' : ''}">
                    <span>Low</span>
                    ${priorityIcons['low']}
                </button>
            </div>
        </section>
    `;

    const subtasksHTML = Object.entries(task.subtasks || {}).map(([id, subtask]) => {
        const title = (typeof subtask === 'string') ? subtask : (subtask.title || '');
        const isEditing = editSubtasks[id]?.isEditing || false;
    
        if (isEditing) {
            
            return `
                <div class="subTaskEdit" data-subtask-id="${id}">
                    <div class="leftContainerSubTask left_container_overlay">
                        <input type="text" id="edit_input${id}" value="${title}" class="subTaskEditInput subtask_input_overlay">
                    </div>
                    <div class="rightContainerSubTask">
                        <div>
                            <img class="subTaskDeleteButtonInput" onclick="deleteSubTaskOverlay('${id}')" src="../assets/icons/delete.png" alt="Delete">
                        </div>
                        <div class="partingLine"></div>
                        <div>
                            <img class="subTaskSaveButton" onclick="saveSubTask('${id}')" src="../assets/icons/check.png" alt="Save">
                        </div>
                    </div>
                </div>
            `;
        } else {
            
            return `
                <div class="subTask" data-subtask-id="${id}">
                    <div class="leftContainerSubTask">
                        <ul class="subTaskListContainer">
                            <li class="listSubTask"><span>${title}</span></li>
                        </ul>
                    </div>
                    <div class="rightContainerSubTask">
                        <div class="subTaskButtons">
                            <img class="subTaskEditButton" onclick="editSubTask('${id}')" src="../assets/icons/edit.png" alt="Edit">
                            <div class="partingLine"></div>
                            <img class="subTaskDeleteButton" onclick="deleteSubTaskOverlay('${id}')" src="../assets/icons/delete.png" alt="Delete">
                        </div>
                    </div>
                </div>
            `;
        }
    }).join('');
    
    return `
        <div onclick="editProtection(event)" class="inner_content">
            <div class="edit_close">
                <h2>Bearbeiten der Aufgabe</h2>
                <img onclick="editOverlay()" src="/assets/icons/close.png" alt="">
            </div>

            <form id="edit_form">
                <label for="edit_title">Title</label>
                <input id="edit_title" value="${task.title}" type="text" required>

                <label for="edit_description">Description</label>
                <textarea id="edit_description">${task.description || ''}</textarea>

                <label for="edit_due_date">Due Date</label>
                <input value="${task.dueDate}" id="edit_due_date" type="date" required>

                ${priorityHTML}

                <div class="assigned_container">
                    <div class="dropdown">
                        <div class="input-container">
                            <input type="text" id="editContactInput" placeholder="Select contacts..." readonly>
                            <div class="icons">
                                <img onclick="toggleEditDropdown()" 
                                     src="../assets/icons/arrow_drop_down_icon.png"
                                     id="editDropdownIcon" 
                                     class="cursorPointer dropdownimg">
                                <img onclick="toggleEditDropdown()" src="../assets/icons/arrow_drop_up_icon.png" 
                                     id="editDropdownIconUp"
                                     class="cursorPointer dropdownimg d-none">
                            </div>
                        </div>
                        <div class="dropdown-content" id="editDropdownContent">
                            <div class="dropdown-item">
                                <div class="contact-info">
                                    <div class="contact-initials-container">${task.initials}</div>
                                    <span class="contact-name">${task.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="selectedContactsInitials" class="selected-contacts-initials">
                        ${task.assignedContacts?.length > 0 ? `
                            <div class="assigned-contacts">
                                ${contactsHTML}
                                ${remainingContacts}
                            </div>
                        ` : ''}
                    </div>
                </div>  


                
                
                <section class="subtask_container">
                    <div class="subtask_input_container">
                        <span class="subtasks_headline">Subtasks</span>
                        <div class="subtask_input">
                            <div style="width: 100%;">
                                <input onclick="showEditSubtaskContainerOverlay()"
                                onkeydown="if(event.key == 'Enter') addNewEditSubtaskOverlay()" 
                                id="edit_subtask_input"
                                class="input_subtask" 
                                type="text" 
                                placeholder="Add new subtask">
                            </div>
                            <div id="edit_add_subtask_container" class="add_subtask_container no-hover">
                                <img onclick="showEditSubtaskContainerOverlay()" 
                                id="edit_show_subtask_container"
                                class="add_subtask_img" 
                                src="../assets/icons/Subtasks_add.png">
                                <div id="edit_add_delete_container" class="add_delete_container">
                                    <div class="delete_btn">
                                        <img onclick="deleteEditText()" 
                                        src="../assets/icons/subtask=close.png">
                                    </div>
                                    <div class="divider_line_subtask"></div>
                                        <div class="add_btn">
                                            <img onclick="addNewEditText(event)" 
                                            id="edit_add_new_text_button"
                                            src="../assets/icons/subtask=check.png">
                                    </div>
                                </div>
                            </div>
                        </div>
                <div class="added_text" id="edit_added_text">
                    ${subtasksHTML}
                </div>
            </div>
        </section>

                
                <div class="edit_buttons">
                    <button type="button" class="ok_button">OK</button>
                </div>
            </form>
        </div>
    `;
}
// ich habe die folgenden fuctionen rein gemacht:
function handlePrioritySelection(event, priority) {
    event.stopPropagation(); // Prevent event bubbling to avoid conflicts
    currentTask.priority = priority;

    // Update the UI to reflect the selected priority
    const priorityOptions = document.querySelectorAll('.priority-option');
    priorityOptions.forEach(option => {
        if (option.getAttribute('onclick').includes(priority)) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}
function setPrio(priority) {
    // Update the currentTask priority
    currentTask.priority = priority;

    // Update the UI to reflect the selected priority
    const priorityButtons = document.querySelectorAll('.prio_btn_container button');
    priorityButtons.forEach(button => {
        if (button.getAttribute('onclick').includes(priority)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}
async function fetchContacts() {
    try {
        const response = await fetch(`${BASE_URL}/contacts.json`);
        if (!response.ok) throw new Error("Failed to fetch contacts");

        const data = await response.json();
        contacts = [];
        for (const key in data) {
            contacts.push({ id: key, ...data[key] });
        }
        return contacts;
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return [];
    }
}

async function populateDropdown() {
    await fetchContacts();
    const dropdownContent = document.getElementById('editDropdownContent');

    if (dropdownContent) {
        const dropdownContentHTML = contacts.map(contact => `
            <div class="dropdown-item" onclick="selectEditContact('${contact.name}')">
                <div class="contact-info">
                    <div class="contact-initials-container" style="background-color: ${contact.color}">
                        ${contact.initials}
                    </div>
                    <span class="contact-name">${contact.name}</span>
                    <input type="checkbox" id="contact-${contact.name}" class="contact-checkbox" 
                           ${currentTask.assignedContacts?.some(c => c.name === contact.name) ? 'checked' : ''}>
                </div>
            </div>
        `).join('') || '';

        dropdownContent.innerHTML = dropdownContentHTML;
    }
}

function selectEditContact(contactName) {
    const selectedContactsInitials = document.getElementById('selectedContactsInitials');
    const contactInput = document.getElementById('editContactInput');
    const contact = contacts.find(c => c.name === contactName);

    if (contact && selectedContactsInitials && contactInput) {
        const checkbox = document.getElementById(`contact-${contact.name}`);
        if (checkbox.checked) {
            if (!currentTask.assignedContacts) currentTask.assignedContacts = [];
            currentTask.assignedContacts.push(contact);

            const contactBadge = `
                <div class="contact-badge" style="background-color: ${contact.color}" title="${contact.name}">
                    ${contact.initials}
                </div>
            `;
            selectedContactsInitials.insertAdjacentHTML('beforeend', contactBadge);
        } else {
            currentTask.assignedContacts = currentTask.assignedContacts.filter(c => c.name !== contact.name);

            const contactBadge = document.querySelector(`.contact-badge[title="${contact.name}"]`);
            if (contactBadge) {
                contactBadge.remove();
            }
        }

        const selectedNames = currentTask.assignedContacts.map(c => c.name).join(', ');
        contactInput.value = selectedNames;
    }
}

function toggleEditDropdown() {
    const dropdownContent = document.getElementById('editDropdownContent');
    const iconDown = document.getElementById('editDropdownIcon');
    const iconUp = document.getElementById('editDropdownIconUp');

    if (!dropdownContent || !iconDown || !iconUp) return;

    const isOpen = dropdownContent.style.display === 'block';
    
    dropdownContent.style.display = isOpen ? 'none' : 'block';
    iconDown.classList.toggle('d-none', isOpen);
    iconUp.classList.toggle('d-none', !isOpen);
}

async function editOverlay(taskId) {
    const overlayRef = document.getElementById('edit_overlay');
    if (!taskId) {
        overlayRef.classList.add('edit_none');
        document.body.classList.remove('no-scroll');
        return;
    }

    overlayBoard();
    currentTask = todos.find(t => t.id === taskId);
    if (!currentTask) return;

    overlayRef.classList.remove('edit_none');
    overlayRef.innerHTML = getOverlayEdit(currentTask);
    document.body.classList.add('no-scroll');

    const contactInput = document.getElementById('editContactInput');
    if (contactInput && currentTask.assignedContacts) {
        const selectedNames = currentTask.assignedContacts.map(c => c.name).join(', ');
        contactInput.value = selectedNames;
    }

    await populateDropdown();

    const okButton = overlayRef.querySelector('.ok_button');
    if (okButton) {
        okButton.addEventListener('click', saveChanges);
    }
}
async function saveChanges() {
    // Get the updated values from the edit form
    const title = document.getElementById('edit_title').value;
    const description = document.getElementById('edit_description').value;
    const dueDate = document.getElementById('edit_due_date').value;
    // Update the currentTask object
    currentTask.title = title;
    currentTask.description = description;
    currentTask.dueDate = dueDate;
    // Update the todos array
    const taskIndex = todos.findIndex(t => t.id === currentTask.id);
    if (taskIndex !== -1) {
        todos[taskIndex] = currentTask;
    }

    // Save changes to Firebase
    try {
        const response = await fetch(`${BASE_URL}/tasks/${currentTask.id}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentTask),
        });
        if (!response.ok) throw new Error("Failed to save changes to Firebase");
        // Re-render the UI to reflect the changes
        updateHTML();
        // Close the edit overlay
        editOverlay();
    } catch (error) {
        console.error("Error saving changes to Firebase:", error);
    }
}

function renderTasks() {
    const taskContainer = document.getElementById('task_main'); 
    if (!taskContainer) return;
    taskContainer.innerHTML = '';
    todos.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description || 'No description'}</p>
            <p>Due: ${task.dueDate}</p>
            <div class="assigned-contacts">
                ${task.assignedContacts?.map(contact => `
                    <div class="contact-badge" style="background-color: ${contact.color}" title="${contact.name}">
                        ${contact.initials}
                    </div>
                `).join('') || ''}
            </div>
        `;
        taskContainer.appendChild(taskElement);
    });
}

async function editOverlay(taskId) {
    const overlayRef = document.getElementById('edit_overlay');
    if (!taskId) {
        overlayRef.classList.add('edit_none');
        document.body.classList.remove('no-scroll');
        updateHTML(); // Re-render the UI when the overlay is closed
        return;
    }
    overlayBoard();
    currentTask = todos.find(t => t.id === taskId);
    if (!currentTask) return;
    overlayRef.classList.remove('edit_none');
    overlayRef.innerHTML = getOverlayEdit(currentTask);
    document.body.classList.add('no-scroll');
    const contactInput = document.getElementById('editContactInput');
    if (contactInput && currentTask.assignedContacts) {
        const selectedNames = currentTask.assignedContacts.map(c => c.name).join(', ');
        contactInput.value = selectedNames;
    }
    await populateDropdown();
    const okButton = overlayRef.querySelector('.ok_button');
    if (okButton) {
        okButton.addEventListener('click', saveChanges);
    }
}

function editProtection (event) {
    event.stopPropagation();
}







let editSubtasks = {};

function showEditSubtaskContainerOverlay() {
    let edit_show_subtask_container = document.getElementById('edit_show_subtask_container');
    let edit_add_delete_container = document.getElementById('edit_add_delete_container');
    let edit_add_subtask_container = document.querySelector('.add_subtask_container');
    let edit_subtask_input = document.getElementById('edit_subtask_input');
    if (!edit_add_delete_container || !edit_add_subtask_container) return;
    edit_add_delete_container.classList.add('visible');
    edit_show_subtask_container.style.display = 'none';
    edit_add_subtask_container.classList.add('no-hover');
    edit_subtask_input.addEventListener('click', edit_show_subtask_container);
}

function deleteEditText() {
    document.getElementById('edit_subtask_input').value = '';
}

  function addNewEditText(event) {
    const input = document.getElementById('edit_subtask_input');
    const title = input.value.trim();
    if (!title) return;
    const subtaskId = `subtask-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    editSubtasks[subtaskId] = {
        title: title,
        completed: false
    };
    input.value = '';
    renderSubtasksOverlay();
    if (event && event.type === 'click') {
        document.getElementById('edit_add_delete_container').classList.remove('visible');
        document.getElementById('edit_show_subtask_container').style.display = 'block';
        document.querySelector('.add_subtask_container').classList.remove('no-hover');
    }
}

function editSubTask(id) {
    if (editSubtasks[id]) {
        editSubtasks[id].isEditing = true;
        renderSubtasksOverlay();
    }
}
function addNewEditText(event) {
    const input = document.getElementById('edit_subtask_input');
    const title = input.value.trim();
    if (!title) return;
    const subtaskId = `subtask-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    editSubtasks[subtaskId] = {
        title: title,
        completed: false,
        isEditing: false
    };

    // Sync with currentTask
    currentTask.subtasks = { ...editSubtasks };

    input.value = '';
    renderSubtasksOverlay();
    if (event && event.type === 'click') {
        document.getElementById('edit_add_delete_container').classList.remove('visible');
        document.getElementById('edit_show_subtask_container').style.display = 'block';
        document.querySelector('.add_subtask_container').classList.remove('no-hover');
    }
}
/*
function addNewEditText(event) {
    const input = document.getElementById('edit_subtask_input');
    const title = input.value.trim();
    if (!title) return;
    const subtaskId = `subtask-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    editSubtasks[subtaskId] = {
        title: title,
        completed: false,
        isEditing: false
    };
    input.value = '';
    renderSubtasksOverlay();
    if (event && event.type === 'click') {
        document.getElementById('edit_add_delete_container').classList.remove('visible');
        document.getElementById('edit_show_subtask_container').style.display = 'block';
        document.querySelector('.add_subtask_container').classList.remove('no-hover');
    }
}*/

function renderEditMode(id, subtask) {
    return `
        <div class="subTaskEdit" data-subtask-id="${id}">
            <div class="leftContainerSubTask left_container_overlay">
                <input type="text" id="edit_input${id}" value="${subtask.title}" class="subTaskEditInput subtask_input_overlay">
            </div>
            <div class="rightContainerSubTask">
                <div>
                    <img class="subTaskDeleteButtonInput" onclick="deleteSubTaskOverlay('${id}')" src="../assets/icons/delete.png" alt="Delete">
                </div>
                <div class="partingLine"></div>
                <div>
                    <img class="subTaskSaveButton" onclick="saveSubTask('${id}')" src="../assets/icons/check.png" alt="Save">
                </div>
            </div>
        </div>
    `;
}

function renderViewMode(id, subtask) {
    return `
        <div class="subTask" data-subtask-id="${id}">
            <div class="leftContainerSubTask">
                <ul class="subTaskListContainer">
                    <li class="listSubTask"><span>${subtask.title}</span></li>
                </ul>
            </div>
            <div class="rightContainerSubTask">
                <div class="subTaskButtons">
                    <img class="subTaskEditButton" onclick="editSubTask('${id}')" src="../assets/icons/edit.png" alt="Edit">
                    <div class="partingLine"></div>
                    <img class="subTaskDeleteButton" onclick="deleteSubTaskOverlay('${id}')" src="../assets/icons/delete.png" alt="Delete">
                </div>
            </div>
        </div>
    `;
}

function renderSubtasksOverlay() {
    const container = document.getElementById('edit_added_text');
    if (!container) return;
    container.innerHTML = Object.entries(editSubtasks).map(([id, subtask]) => {
        return subtask.isEditing ? renderEditMode(id, subtask) : renderViewMode(id, subtask);
    }).join('');
}
function deleteSubTaskOverlay(subtaskId) {
    const subtaskElement = document.querySelector(`.subTask[data-subtask-id="${subtaskId}"]`);
    if (subtaskElement) {
        subtaskElement.classList.add('deleting');
        setTimeout(() => {
            delete editSubtasks[subtaskId];

            // Sync with currentTask
            currentTask.subtasks = { ...editSubtasks };

            renderSubtasksOverlay();
        }, 300);
    } else {
        console.error(`Subtask with ID ${subtaskId} not found.`);
    }
}


/*function deleteSubTaskOverlay(subtaskId) {
    const subtaskElement = document.querySelector(`.subTask[data-subtask-id="${subtaskId}"]`);
    if (subtaskElement) {
        subtaskElement.classList.add('deleting');
        setTimeout(() => {
            delete editSubtasks[subtaskId];
            renderSubtasksOverlay();
        }, 300);
    } else {
        console.error(`Subtask with ID ${subtaskId} not found.`);
    }
}*/

async function saveEditedTask(taskId) {
    const updatedTask = {
        ...currentTask,
        subtasks: editSubtasks
    };
    await updateData(`tasks/${taskId}`, updatedTask);
    fetchTasks();
}

function loadTaskForEdit(task) {
    editSubtasks = {};
    if (Array.isArray(task.subtasks)) {
        task.subtasks.forEach((subtask, index) => {
            const id = subtask.id || `subtask-${index}-${Date.now()}`;
            editSubtasks[id] = {
                title: subtask.title || subtask.name,
                completed: subtask.completed || false,
                isEditing: false
            };
        });
    } else if (task.subtasks && typeof task.subtasks === 'object') {
        Object.entries(task.subtasks).forEach(([id, subtask]) => {
            editSubtasks[id] = { ...subtask, isEditing: false };
        });
    }
    renderSubtasksOverlay();
}

function saveSubTask(id) {
    const input = document.getElementById(`edit_input${id}`);
    const newTitle = input.value.trim();

    if (newTitle) {
        editSubtasks[id].title = newTitle;
        editSubtasks[id].isEditing = false;

        // Sync with currentTask
        currentTask.subtasks = { ...editSubtasks };
        renderSubtasksOverlay();
    }
}

//chuks board script//

// Initialize the "Add Task" form
function initAddTask() {
    getDateToday();
    initializeDropdown();
    initializeCategorySelector();
    initializeTaskForm();
    hideInputSubTaksClickContainerOnOutsideClick();
    loadContacts();
}

// Set priority for the task
function setPrio(prio) {
    document.querySelectorAll('.prioBtnUrgent, .prioBtnMedium, .prioBtnLow').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.prioBtn${prio.charAt(0).toUpperCase() + prio.slice(1)}`).classList.add('active');
}

// Set today's date as the minimum date for the date input
function getDateToday() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }
}


// Initialize the contacts dropdown
function initializeDropdown() {
    const dropdownIcon = document.getElementById('dropdownIcon');
    const dropdownIconUp = document.getElementById('dropdownIconUp');
    const dropdownContent = document.getElementById('dropdownContent');
    if (dropdownIcon && dropdownIconUp && dropdownContent) {
        dropdownIcon.addEventListener('click', toggleDropdown);
        dropdownIconUp.addEventListener('click', toggleDropdown);

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!dropdownContent.contains(event.target) &&
                !dropdownIcon.contains(event.target) &&
                !dropdownIconUp.contains(event.target)) {
                dropdownContent.style.display = 'none';
                dropdownIcon.classList.remove('d-none');
                dropdownIconUp.classList.add('d-none');
            }
        });
    } else {
        console.error('Dropdown elements not found!');
    }
}

// Toggle the contacts dropdown
function toggleDropdown() {
    const dropdownContent = document.getElementById('dropdownContent');
    const dropdownIcon = document.getElementById('dropdownIcon');
    const dropdownIconUp = document.getElementById('dropdownIconUp');

    if (!dropdownContent || !dropdownIcon || !dropdownIconUp) return;

    if (dropdownContent.style.display === 'block') {
        dropdownContent.style.display = 'none';
        dropdownIcon.classList.remove('d-none');
        dropdownIconUp.classList.add('d-none');
    } else {
        dropdownContent.style.display = 'block';
        dropdownIcon.classList.add('d-none');
        dropdownIconUp.classList.remove('d-none');
    }
}

// Initialize the category selector dropdown
function initializeCategorySelector() {
    const categorySelect = document.getElementById('category_select');
    if (categorySelect) {
        categorySelect.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleCategoryDropdown();
        });
    }
}

// Toggle the category dropdown
function toggleCategoryDropdown() {
    let dropdown = document.getElementById("category_dropdown");
    if (dropdown) {
        if (dropdown.style.display === "none" || dropdown.style.display === "") {
            if (dropdown.innerHTML.trim() === "") {
                dropdown.innerHTML = `
                    <div class="select_category" onclick="selectCategory('Technical Task')">Technical Task</div>
                    <div class="select_category" onclick="selectCategory('User Story')">User Story</div>
                `;
            }
            dropdown.style.display = "block";
        } else {
            dropdown.style.display = "none";
        }
    }
}

// Select a category
function selectCategory(category) {
    document.getElementById("select_txt").innerText = category;
    document.getElementById("category_dropdown").style.display = "none";
}

// Open the category dropdown
function to_open_category_dropdown() {
    let dropdown = document.getElementById("category_dropdown");
    if (dropdown) {
        dropdown.classList.toggle("visible");
    } else {
        console.error("Dropdown element with id 'category_dropdown' not found!");
    }
}

// Initialize the task form
document.addEventListener('DOMContentLoaded', () => {
    initializeTaskForm();
});

function initializeTaskForm() {
    const createTaskBtn = document.getElementById('createTaskBtn');
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            const taskData = collectTaskData();
            if (validateTaskData(taskData)) {
                const savedTask = await saveTaskToFirebase(taskData);
                if (savedTask) {
                    alert('Task created successfully!');
                    resetForm();
                    if (typeof init === 'function') {
                        init(); // Refresh the board or summary page
                    }
                } else {
                    alert('Failed to create task. Please try again.');
                }
            }
        });
    }
}

function collectTaskData() {
    const title = document.getElementById('title')?.value.trim();
    const category = document.getElementById('select_txt')?.textContent.trim();
    const dueDate = document.getElementById('date')?.value.trim();
    const priority = getSelectedPriority(); // Ensure you have a function to get the selected priority
    const assignedContacts = selectedContacts;
    const subtasksArray = subtasks;
    const stage = 'todo'; // Or get the stage from a dropdown/input if needed

    return createTask(title, category, dueDate, priority, assignedContacts, subtasksArray, stage);
}

function createTask(title, category, dueDate, priority, assignedContacts, subtasksArray, stage = 'todo') {
    const newTask = {
        id: Date.now().toString(),
        title,
        category,
        dueDate,
        priority,
        stage, // Default to 'todo' if not provided
        assignedContacts,
        subtasks: subtasksArray.reduce((acc, title, index) => {
            acc[index] = {
                title: title,
                completed: false
            };
            return acc;
        }, {})
    };
    return newTask;
}// Validate task data
function validateTaskData(taskData) {
    if (!taskData.title) {
        alert('Please fill in the Title');
        return false;
    }
    if (!taskData.dueDate) {
        alert('Please fill in the Due Date');
        return false;
    }
    if (!taskData.category || taskData.category === 'Select task category') {
        alert('Please fill in the Category');
        return false;
    }
    return true;
}

// Reset the form
function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    document.getElementById('select_txt').textContent = 'Select task category';
    document.getElementById('added_text').innerHTML = '';
    
    document.getElementById('contactInput').value = '';
    document.getElementById('selectedContactsInitials').innerHTML = '';
    subtasks = [];
}

// Save task to Firebase
async function saveTaskToFirebase(taskData) {
    const BASE_URL = 'https://join-428-default-rtdb.europe-west1.firebasedatabase.app/';
    const TASKS_ENDPOINT = 'tasks.json';
    try {
        const response = await fetch(`${BASE_URL}${TASKS_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        if (!response.ok) {
            throw new Error('Failed to save task to Firebase');
        }
        const data = await response.json();
        console.log('Task saved successfully:', data);
        return data;
    } catch (error) {
        console.error('Error saving task:', error);
        return null;
    }
}

// Load contacts from Firebase
async function loadContacts() {
    const dropdownContent = document.getElementById('dropdownContent');
    if (!dropdownContent) {
        console.error('Dropdown content element not found!');
        return;
    }
    const contactsData = await loadData('contacts');
    if (contactsData) {
        const contactsArray = Object.values(contactsData);
        dropdownContent.innerHTML = '';

        contactsArray.forEach(contact => {
            const contactDiv = document.createElement('div');
            contactDiv.classList.add('dropdown-item');

            contactDiv.innerHTML = `
                <div class="contact-info">
                    <div class="contact-initials-container" style="background-color: ${getRandomColor()}">
                        <div class="contact-initials">${getInitials(contact.name)}</div>
                    </div>
                    <span class="contact-name">${contact.name}</span>
                </div>
                <input type="checkbox" class="contact-checkbox">
            `;

            const checkbox = contactDiv.querySelector('.contact-checkbox');

            checkbox.addEventListener('change', (event) => {
                if (checkbox.checked) {
                    // Add the selected-contact-item class
                    contactDiv.classList.add('selected-contact-item');
                    if (!selectedContacts.find(c => c.name === contact.name)) {
                        selectedContacts.push(contact);
                    }
                } else {
                    // Remove the selected-contact-item class
                    contactDiv.classList.remove('selected-contact-item');
                    selectedContacts = selectedContacts.filter(c => c.name !== contact.name);
                }

                updateSelectedContacts();
            });

            dropdownContent.appendChild(contactDiv);
        });
    } else {
        dropdownContent.innerHTML = '<div class="dropdown-item">No contacts available</div>';
    }
}
// Select a contact

function selectContact(contact) {
    if (!selectedContacts.find(c => c.name === contact.name)) {
        selectedContacts.push(contact);
        updateSelectedContacts();
        console.log('Contact selected:', contact.name);
    } else {
        console.log('Contact already selected:', contact.name);
    }
   
}

function updateSelectedContacts() {
    const inputField = document.getElementById('contactInput');
    const initialsContainer = document.getElementById('selectedContactsInitials');

    if (!inputField || !initialsContainer) {
        console.error('Input field or initials container not found!');
        return;
    }

    // Update the input field with selected contact names
    const selectedNames = selectedContacts.map(contact => contact.name).join(', ');
    inputField.value = selectedNames;

    // Update the initials container
    initialsContainer.innerHTML = '';
    selectedContacts.forEach(contact => {
        const span = document.createElement('span');
        span.classList.add('contact-initial');

        span.innerHTML = `
            <div class="contact-initials-container" style="background-color: ${getRandomColor()}">
                <div class="contact-initials">${getInitials(contact.name)}</div>
            </div>
        `;

        initialsContainer.appendChild(span);
    });
}

function getInitials(name) {
    if (!name) return ''; // Handle undefined or empty names
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
}
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



// Close the "Add Task" pop-up
function closeOverlay() {
    const overlay = document.getElementById('overlay');
    const popupContainer = document.getElementById('popup_container');

    // Hide the overlay and pop-up
    overlay.classList.add('d_none');
    popupContainer.classList.add('d_none');
}

// Show the subtask container
function show_subtask_container() {
    let add_delete_container = document.getElementById('add_delete_container');
    let show_subtask_container = document.getElementById('show_subtask_container');
    let add_subtask_container = document.querySelector('.add_subtask_container');
    let subtask_input = document.getElementById('subtask_input');
    add_delete_container.classList.add('visible');
    show_subtask_container.style.display = 'none';
    add_subtask_container.classList.add('no-hover');
    subtask_input.addEventListener('click', show_subtask_container);
}

// Delete text from the subtask input
function delete_text() {
    let add_delete_container = document.getElementById('add_delete_container');
    let show_subtask_container = document.getElementById('show_subtask_container');
    let add_subtask_container = document.querySelector('.add_subtask_container');
    let subtask_input = document.getElementById('subtask_input');
    subtask_input.value = '';
    show_subtask_container.style.display = 'block';
    add_delete_container.classList.remove('visible');
    add_subtask_container.classList.remove('no-hover');
    subtask_input.removeEventListener('click', show_subtask_container);
}

// Add a new subtask
function add_new_text(event) {
    let newSubTask = document.getElementById('subtask_input');
    if (newSubTask.value == 0) {
        return false;
    }
    subtasks.push(newSubTask.value);
    newSubTask.value = '';
    renderSubtasks();
    if (event && event.type === 'click') {
        document.getElementById('add_delete_container').classList.remove('visible');
        document.getElementById('show_subtask_container').style.display = 'block';
        document.querySelector('.add_subtask_container').classList.remove('no-hover');
    }
}

// Render subtasks
function renderSubtasks(editIndex = -1) {
    let subtask_list = document.getElementById('added_text');
    subtask_list.innerHTML = '';
    subtasks.forEach((subtask, index) => {
        if (index === editIndex) {
            subtask_list.innerHTML += subTaskProgressTemplate(index, subtask);
        } else {
            subtask_list.innerHTML += subTaskCreatedTemplate(index, subtask);
        }
    });
}

// Edit a subtask
function editSubTask(index) {
    renderSubtasks(index);
}

// Save a subtask
function saveSubTask(index) {
    let editedText = document.getElementById(`editInput${index}`).value;
    if (editedText.trim() !== '') {
        subtasks[index] = editedText;
    }
    renderSubtasks();
}

// Delete a subtask
function deleteSubTask(index) {
    subtasks.splice(index, 1);
    renderSubtasks();
}

// Hide subtask input container on outside click
function hideInputSubTaksClickContainerOnOutsideClick() {
    document.addEventListener('click', function (event) {
        let add_delete_container = document.getElementById('add_delete_container');
        let show_subtask_container = document.getElementById('show_subtask_container');
        let add_subtask_container = document.querySelector('.add_subtask_container');
        let subtask_input = document.getElementById('subtask_input');

        if (
            add_delete_container &&
            show_subtask_container &&
            add_subtask_container &&
            subtask_input
        ) {
            if (
                !add_delete_container.contains(event.target) &&
                !subtask_input.contains(event.target) &&
                !show_subtask_container.contains(event.target)
            ) {
                add_delete_container.classList.remove('visible');
                show_subtask_container.style.display = 'block';
                add_subtask_container.classList.remove('no-hover');
            }
        }
    });
}







