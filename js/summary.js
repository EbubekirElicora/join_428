document.addEventListener('DOMContentLoaded', initPage);

/**
 * Initializes the page after DOM content is loaded.
 * Calls all necessary setup functions.
 */
function initPage() {
    updateSummary();
    greetUser();
    setGreetingText();
    hideMobileGreeting();
}

/**
 * Retrieves user info from localStorage and updates the UI
 * to greet either the guest or the saved user by name.
 */
function greetUser() {
    const isGuest = localStorage.getItem("isGuest");
    const greetedUserElement = document.getElementById('greeted_user');
    if (isGuest === "true") {
        greetedUserElement.textContent = "Guest";
    } else {
        const userName = localStorage.getItem('userName');
        if (userName) {
            greetedUserElement.textContent = userName;
        }
    }
}

/**
 * Sets the greeting text based on the current time of day.
 * Updates the DOM element with an appropriate greeting.
 */
function setGreetingText() {
    const hour = new Date().getHours();
    const greetText = document.getElementById('greets_text');
    let greeting;
    if (hour < 12) {
        greeting = 'Good morning,';
    } else if (hour < 18) {
        greeting = 'Good afternoon,';
    } else {
        greeting = 'Good evening,';
    }
    greetText.textContent = greeting;
}

/**
 * Hides the mobile greeting container after a short delay
 * if the window width is below a certain threshold.
 */
function hideMobileGreeting() {
    const mobileGreetsContainer = document.querySelector('.mobile_greets_container');
    if (window.innerWidth < 760) {
        setTimeout(() => {
            mobileGreetsContainer.classList.add('hide');
        }, 2000);
        setTimeout(() => {
            mobileGreetsContainer.style.display = 'none';
        }, 1000);
    }
}

/**
 * Loads the user's name from localStorage and updates the UI to greet the user. 
 * If no name is found, it defaults to "Guest".
 * 
 * This function updates the text content of an element with the ID 'greeted_user'.
 * 
 * @returns {void} This function does not return any value. It updates the UI element with the user's name.
 */
function loadUserInfo() {
    const userName = localStorage.getItem("userName") || "Guest";
    document.getElementById("greeted_user").textContent = userName;
}
document.addEventListener("DOMContentLoaded", loadUserInfo);


/**
 * Event listener that triggers when the DOM content is fully loaded.
 * It calls the `updateSummary` function to update the page's summary when the content is ready.
 * 
 * @returns {void} This function does not return any value.
 */
document.addEventListener('DOMContentLoaded', () => {
    updateSummary();
});

/**
 * Asynchronously loads data from a specified Firebase endpoint.
 * 
 * @param {string} endpoint - The endpoint of the Firebase database to fetch data from (e.g., 'tasks').
 * 
 * @returns {Promise<Object|null>} Returns a promise that resolves to the fetched data in JSON format if successful, or `null` if an error occurs.
 * 
 * @throws {Error} Throws an error if the fetch operation fails or the response is not OK.
 */
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

/**
 * Updates the text content of an HTML element with the specified ID.
 * If the element is found, it updates its text content with the provided value.
 * If the element is not found, it logs an error message to the console.
 * 
 * @param {string} id - The ID of the HTML element to update.
 * @param {string} value - The new text content to set for the element.
 * 
 * @returns {void} This function does not return any value.
 */
function updateElementText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    } else {
        console.error(`Element with ID '${id}' not found.`);
    }
}

/**
 * Main function to update all task summary data in the UI.
 */
async function updateSummary() {
    try {
        const tasks = await loadData("tasks");
        if (!tasks) return;

        const normalizedTasks = normalizeTasks(tasks);
        const summary = calculateSummary(normalizedTasks);
        updateSummaryUI(summary);
    } catch (error) {
        console.error('Error updating summary:', error);
    }
}

/**
 * Ensures each task has a 'stage' and converts tasks to an array.
 * @param {Object} tasks - Task object from storage
 * @returns {Array} Array of task objects with normalized stage
 */
function normalizeTasks(tasks) {
    return Object.values(tasks).map(task => {
        if (!task.stage) {
            task.stage = 'todo';
        }
        return task;
    });
}

/**
 * Calculates task counts and the nearest upcoming deadline.
 * @param {Array} tasks - Array of task objects
 * @returns {Object} Summary data
 */
function calculateSummary(tasks) {
    const toStage = stage => stage?.toLowerCase();
    return {
        todoCount: tasks.filter(t => toStage(t.stage) === 'todo').length,
        doneCount: tasks.filter(t => toStage(t.stage) === 'done').length,
        urgentCount: tasks.filter(t => t.priority === 'urgent').length,
        totalCount: tasks.length,
        inProgressCount: tasks.filter(t => toStage(t.stage) === 'progress').length,
        feedbackCount: tasks.filter(t => toStage(t.stage) === 'feedback').length,
        nextDeadline: getNextUpcomingDeadline(tasks)
    };
}

/**
 * Finds the next upcoming deadline from tasks.
 * @param {Array} tasks - Array of task objects
 * @returns {Date|null} Nearest upcoming deadline or null
 */
function getNextUpcomingDeadline(tasks) {
    const futureDates = tasks
        .filter(task => task.dueDate)
        .map(task => new Date(task.dueDate))
        .filter(date => date > new Date())
        .sort((a, b) => a - b);
    return futureDates[0] || null;
}

/**
 * Updates DOM elements with summary data.
 * @param {Object} summary - Summary object from calculateSummary()
 */
function updateSummaryUI(summary) {
    updateElementText('todo_number', summary.todoCount);
    updateElementText('done_number', summary.doneCount);
    updateElementText('urgent_number', summary.urgentCount);
    updateElementText('board_number', summary.totalCount);
    updateElementText('progress_number', summary.inProgressCount);
    updateElementText('feedback_number', summary.feedbackCount);
    if (summary.nextDeadline) {
        updateElementText('date', summary.nextDeadline.toLocaleDateString());
    } else {
        updateElementText('date', 'No upcoming deadlines');
    }
}