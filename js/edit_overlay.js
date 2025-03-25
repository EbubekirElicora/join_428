

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
    // Prüfe, ob currentTask existiert
    if (!currentTask) {
        console.error("❌ Fehler: currentTask ist nicht definiert!");
        return;
    }
    if (!currentTask.id) {
        console.error("❌ Fehler: currentTask hat keine ID!");
        return;
    }

    // Aktualisierte Werte aus dem Formular holen
    const title = document.getElementById('edit_title')?.value || "";
    const description = document.getElementById('edit_description')?.value || "";
    const dueDate = document.getElementById('edit_due_date')?.value || "";

    // Update currentTask-Objekt
    currentTask.title = title;
    currentTask.description = description;
    currentTask.dueDate = dueDate;

    // Update todos-Array
    const taskIndex = todos.findIndex(t => t.id === currentTask.id);
    if (taskIndex !== -1) {
        todos[taskIndex] = { ...currentTask };
    } else {
        console.warn("⚠️ Warnung: Task wurde in todos nicht gefunden!");
    }

    // Änderungen in Firebase speichern
    try {
        const response = await fetch(`${BASE_URL}/tasks/${currentTask.id}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentTask),
        });

        if (!response.ok) throw new Error("Fehler beim Speichern in Firebase");

        console.log("✅ Änderungen erfolgreich gespeichert!");

        // UI aktualisieren
        if (typeof updateHTML === "function") updateHTML();
        if (typeof editOverlay === "function") editOverlay();

    } catch (error) {
        console.error("❌ Fehler beim Speichern in Firebase:", error);
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

function editProtection(event) {
    event.stopPropagation();
}

