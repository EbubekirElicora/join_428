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




                <div class="assigned_container">
                    <div>
                        <label for="contactInput">Assigned to</label>
                    </div>
                    <div class="dropdown">
                        <div class="input-container">
                            <input type="text" id="contactInput" placeholder="Select contacts to assign" readonly>
                            <div class="icons">
                                <img src="../assets/icons/arrow_drop_down_icon.png"
                                     id="dropdownIcon" class="cursorPointer dropdownimg">
                                <img src="../assets/icons/arrow_drop_up_icon.png" id="dropdownIconUp"
                                        class="cursorPointer dropdownimg d-none">
                             </div>
                        </div>
                        <div class="dropdown-content" id="dropdownContent"></div>
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






            </form>
        </div>
    `;
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






            </form>
        </div>
    `;
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



function editProtection (event) {
    event.stopPropagation();
}