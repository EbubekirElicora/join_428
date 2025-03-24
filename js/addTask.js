// Function to save task to Firebase
async function saveTaskToFirebase(taskData) {
    const TASKS_ENDPOINT = "tasks.json";
    const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";
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
        return data;
    } catch (error) {
        console.error('Error saving task:', error);
        return null;
    }
}

// Function to collect task data
function collectTaskData() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('date').value;
    const priority = document.querySelector('.prioBtnUrgent.active') ? 'urgent' :
        document.querySelector('.prioBtnMedium.active') ? 'medium' :
            document.querySelector('.prioBtnLow.active') ? 'low' : 'medium';
    const category = document.getElementById('select_txt').textContent;
    if (!validateTaskForm(title, dueDate, category)) {
        return null;
    }
    const assignedContacts = selectedContacts.map(contact => {
        const contactName = typeof contact === 'string' ? contact : contact.name;
        return {
            name: contactName,
            color: getRandomColor(),
            initials: getInitials(contactName)
        };
    });
    const subtasksList = subtasks;
    return {
        title,
        description,
        dueDate,
        priority,
        category,
        assignedContacts,
        subtasks: subtasksList
    };
}

function getInitials(name) {
    if (typeof name !== 'string') {
        console.error("Invalid name:", name);
        return '';
    }
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
}


