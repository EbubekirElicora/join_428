


function generateTodoHTML(task) {
    const priorityIcons = {
        urgent: '<img src="../assets/icons/prio_urgent_icon.png" alt="">',
        medium: '<img src="../assets/icons/prio_media.png" alt="">',
        low: '<img src="../assets/icons/prio_low_icon.png" alt="">'
    };
    const contactsHTML = task.assignedContacts?.map(contact => `
        <div class="contact-badge" style="background-color: ${contact.color}">
            ${contact.initials}
        </div>
    `).join('') || '';

    return `
        <div draggable="true" ondragstart="startDragging('${task.id}')" class="task">
            <div class="category bg_${task.category}">${task.category}</div>
            <h2>${task.title}</h2>
            <p>${task.description || ''}</p>
            <div class="priority_contact">
                ${task.assignedContacts?.length > 0 ? `
                    <div class="assigned-contacts">
                        ${contactsHTML}
                    </div>
                ` : ''}
                <span class="priority">${priorityIcons[task.priority]}</span>   
            </div>
        </div>
    `;
}