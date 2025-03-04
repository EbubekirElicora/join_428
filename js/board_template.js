


// async function createTask() {
//     const title = document.getElementById("taskTitle").value.trim();
//     const description = document.getElementById("taskDescription").value.trim();
//     const dueDate = document.getElementById("taskDueDate").value;
//     const priority = document.querySelector('.prioBtnUrgent.active') ? 'urgent' :
//                     document.querySelector('.prioBtnMedium.active') ? 'medium' :
//                     document.querySelector('.prioBtnLow.active') ? 'low' : 'medium';
//     const categoryElement = document.getElementById('select_txt');
//     const category = categoryElement ? categoryElement.textContent.toLowerCase() : 'todo';
//     const newTask = {
//         title,
//         description,
//         dueDate,
//         priority,
//         category: categories.includes(category) ? category : 'todo',
//         assignedContacts: selectedContacts || [],
//         subtasks: subtasks || [],
//         createdAt: new Date().toISOString()
//     };
//     if (!newTask.title) {
//         alert("Title is required!");
//         return;
//     }
//     try {
//         await postData("tasks", newTask);
//         await fetchTasks();
//         closeOverlay();
//         resetForm();
//     } catch (error) {
//         console.error("Error creating task:", error);
//     }
// }




function generateTodoHTML(task) {
    return `<div draggable="true" ondragstart="startDragging('${task.id}')" class="task">
                <h3>${task.title}</h3>
                <p>${task.description || ''}</p>
                <p>Due: ${task.dueDate}</p>
                <p>Category: ${task.category}</p>
                <p>priority: ${task.priority}</p>

            </div>`;
}