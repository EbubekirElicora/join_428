document.addEventListener('DOMContentLoaded', function () {
    updateSummary();
    const isGuest = localStorage.getItem("isGuest");
    const greetedUserElement = document.getElementById('greeted_user');
    const greetText = document.getElementById('greets_text');
    if (isGuest === "true") {
        greetedUserElement.textContent = "Guest";
    } else {
        const userName = localStorage.getItem('userName');
        if (userName) {
            greetedUserElement.textContent = userName;
        }
    }
    const hour = new Date().getHours();
    let greeting;
    if (hour < 12) {
        greeting = 'Good morning,';
    } else if (hour < 18) {
        greeting = 'Good afternoon,';
    } else {
        greeting = 'Good evening,';
    }
    greetText.textContent = greeting;
    const mobileGreetsContainer = document.querySelector('.mobile_greets_container');

    if (window.innerWidth < 760) {
        setTimeout(() => {
            mobileGreetsContainer.classList.add('hide');
        }, 2000); 
        setTimeout(() => {
            mobileGreetsContainer.style.display = 'none';
        }, 1000);
    }
});

function loadUserInfo() {
    const userName = localStorage.getItem("userName") || "Guest";
    document.getElementById("greeted_user").textContent = userName;
}
document.addEventListener("DOMContentLoaded", loadUserInfo);


/**
* Lädt Aufgaben von Firebase.
* @returns {Promise<Array>} Liste der Aufgaben.
*/
document.addEventListener('DOMContentLoaded', () => {
    updateSummary();
});
async function loadData(endpoint) {
    const BASE_URL = 'https://join-428-default-rtdb.europe-west1.firebasedatabase.app/';
    try {
        const response = await fetch(`${BASE_URL}${endpoint}.json`);
        if (!response.ok) throw new Error('Failed to load data');
        return await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

function updateElementText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    } else {
        console.error(`Element with ID '${id}' not found.`);
    }
}

async function updateSummary() {
    try {
        const tasks = await loadData("tasks");
        if (!tasks) return;
        const todos = Object.values(tasks).map(task => {
            if (!task.stage) {
                task.stage = 'todo';
            }
            return task;
        });

        const todoTasks = todos.filter(task => task.stage?.toLowerCase() === 'todo');
        const todoCount = todoTasks.length;
        const doneCount = todos.filter(task => task.stage?.toLowerCase() === 'done').length;
        const urgentCount = todos.filter(task => task.priority === 'urgent').length;
        const totalTasks = todos.length;
        const inProgressCount = todos.filter(task => task.stage?.toLowerCase() === 'progress').length;
        const awaitingFeedbackCount = todos.filter(task => task.stage?.toLowerCase() === 'feedback').length;
        const upcomingDeadline = todos
            .filter(task => task.dueDate)
            .map(task => new Date(task.dueDate))
            .sort((a, b) => a - b)
            .find(date => date > new Date());

        updateElementText('todo_number', todoCount);
        updateElementText('done_number', doneCount);
        updateElementText('urgent_number', urgentCount);
        updateElementText('board_number', totalTasks);
        updateElementText('progress_number', inProgressCount);
        updateElementText('feedback_number', awaitingFeedbackCount);

        if (upcomingDeadline) {
            updateElementText('date', upcomingDeadline.toLocaleDateString());
        } else {
            updateElementText('date', 'No upcoming deadlines');
        }
    } catch (error) {
        console.error('Error updating summary:', error);
    }
}