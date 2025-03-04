


function generateTodoHTML(task) {
    return `<div draggable="true" ondragstart="startDragging('${task.id}')" class="task">
                <h3>${task.category}</h3>
                <p>${task.title}</p>
                <p>${task.description || ''}</p>
                <p>Due: ${task.dueDate}</p>
                <p>priority: ${task.priority}</p>

            </div>`;
}