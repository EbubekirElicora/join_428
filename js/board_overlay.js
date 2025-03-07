
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
          <div class="subtask_item" onclick="toggleSubtask('${task.id}', '${subtaskId}')">
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
                <button onclick="editTask('${task.id}')" class="img_p">
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

