
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

