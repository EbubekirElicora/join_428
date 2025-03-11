document.addEventListener('DOMContentLoaded', function () {
    updateSummary();
    const isGuest = localStorage.getItem("isGuest");
    const greetedUserElement = document.getElementById('greeted_user');
    const greetText = document.getElementById('greets_text');

    // Display the user's name or "Guest"
    if (isGuest === "true") {
        greetedUserElement.textContent = "Guest"; // Greet as Guest
    } else {
        const userName = localStorage.getItem('userName');
        if (userName) {
            greetedUserElement.textContent = userName; // Greet with the user's name
        }
    }

    // Display the time-based greeting
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

    // Handle the fade-out effect only for mobile screens
    const mobileGreetsContainer = document.querySelector('.mobile_greets_container');

    if (window.innerWidth < 760) { // Only for smaller screens
        // Hide the overlay after 3 seconds with a fade-out effect
        setTimeout(() => {
            mobileGreetsContainer.classList.add('hide');
        }, 2000); // Start fade-out after 2 seconds

        // Remove the overlay from the DOM after the fade-out completes
        setTimeout(() => {
            mobileGreetsContainer.style.display = 'none';
        }, 1000); // Remove after 3 seconds (1 second fade-out duration)
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

<<<<<<< HEAD
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
        console.log('Tasks:', tasks); // Debugging: Log tasks data

        if (!tasks) return;

        // Add the 'stage' property if it doesn't exist
        const todos = Object.values(tasks).map(task => {
            if (!task.stage) {
                task.stage = 'todo'; // Default to 'todo' if stage is missing
            }
            return task;
        });

        console.log('Todos:', todos); // Debugging: Log todos array

        // Count tasks in each category
        const todoTasks = todos.filter(task => task.stage?.toLowerCase() === 'todo');
        console.log('Todo Tasks:', todoTasks); // Debugging: Log filtered todo tasks
        const todoCount = todoTasks.length;
        console.log('Todo Count:', todoCount); // Debugging: Log todo count

        const doneCount = todos.filter(task => task.stage?.toLowerCase() === 'done').length;
        const urgentCount = todos.filter(task => task.priority === 'urgent').length;
        const totalTasks = todos.length;
        const inProgressCount = todos.filter(task => task.stage?.toLowerCase() === 'progress').length;
        const awaitingFeedbackCount = todos.filter(task => task.stage?.toLowerCase() === 'feedback').length;

        // Find the nearest upcoming deadline
        const upcomingDeadline = todos
            .filter(task => task.dueDate)
            .map(task => new Date(task.dueDate))
            .sort((a, b) => a - b)
            .find(date => date > new Date());

        // Update the summary page
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
=======
async function loadTasksFromFirebase() {
    try {
        const tasksData = await loadData("tasks");
        const tasks = Object.keys(tasksData).map((key) => {
            const task = tasksData[key];
            const dueDate = task.dueDate ? new Date(task.dueDate) : null;
            return {
                id: key,
                title: task.title,
                description: task.description,
                priority: task.prio,
                dueDate: dueDate,
                category: task.category,
                assignedTo: task.assignedTo || [],
                subtasks: task.subtasks || [],
            };
        });
        return tasks;
    } catch (error) {
        console.error("Error loading tasks from Firebase:", error);
        return [];
    }
}


/**
* Lädt die Positionen der Aufgaben aus Firebase.
* @returns {Promise<Object>} Positionen der Aufgaben.
*/

async function loadPositionsFromFirebase() {
    const positionsData = await loadData("newTaskPos");
    return positionsData || {};
}

/**
 * Calculates task statistics.
 * @returns {Promise<Object>} The calculated statistics.
 */

async function calculateStatistics() {
    const tasks = await loadTasksFromFirebase();
    const positions = await loadPositionsFromFirebase();

    let todoCount = 0;
    let doneCount = 0;
    let inProgressCount = 0;
    let feedbackCount = 0;
    let urgentCount = 0;
    let nearestDeadline = null;

    tasks.forEach((task) => {
        const position = positions[task.id] || "todo_task";
        if (position === "todo_task") {
            todoCount++;
        } else if (position === "done_task") {
            doneCount++;
        } else if (position === "progress_task") {
            inProgressCount++;
        } else if (position === "feedback_task") {
            feedbackCount++;
        }

        // „Dringende“ Aufgaben zählen
        if (task.priority === "urgent") {
            urgentCount++;
            // Fälligkeitsdatum prüfen
            if (task.dueDate) {
                if (!nearestDeadline || task.dueDate < nearestDeadline) {
                    nearestDeadline = task.dueDate;
                }
            }
        }
    });

    // Gesamtzahl der Aufgaben auf dem Board
    const boardTaskCount = tasks.length;

    return {
        todoCount,
        doneCount,
        inProgressCount,
        feedbackCount,
        urgentCount,
        nearestDeadline,
        boardTaskCount,
    };
}


/**
* Aktualisiert die zusammenfassenden Statistiken auf der Seite.
*/

async function updateSummary() {
    const stats = await calculateStatistics();

    // Updated DOM elemente
    document.querySelector(".todo_number").innerText = stats.todoCount;
    document.querySelector(".done_number").innerText = stats.doneCount;
    document.querySelector(".urgent_number").innerText = stats.urgentCount;
    document.querySelector(".board_number").innerText = stats.boardTaskCount;
    document.querySelector(".progress_number").innerText = stats.inProgressCount;
    document.querySelector(".feedback_number").innerText = stats.feedbackCount;


    //Nächste Deadline formatieren und anzeigen
    const datumElement = document.getElementById("date");
    if (stats.nearestDeadline) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = stats.nearestDeadline.toLocaleDateString('de-DE', options);
        datumElement.innerText = formattedDate;
    } else {
        datumElement.innerText = "No upcoming deadlines";
>>>>>>> a04f750541bea2d801ca803a82a6e93973683b52
    }
}