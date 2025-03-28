/**
 * Event listener for the DOMContentLoaded event. This function performs various updates 
 * when the page is fully loaded, including greeting the user based on the time of day 
 * and displaying user-specific data from localStorage.
 * It also handles the visibility of mobile greetings based on screen size.
 * 
 * @returns {void} This function does not return any value. It updates UI elements upon page load.
 */
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
 * Asynchronously loads the task data and updates various summary statistics 
 * including counts of tasks in different stages and with certain priorities.
 * The statistics include the number of tasks in the 'todo', 'done', 'in progress', 
 * and 'awaiting feedback' stages, as well as the total number of tasks and the 
 * number of urgent tasks. It also checks for the next upcoming deadline.
 * 
 * @returns {Promise<void>} This function does not return any value. It handles 
 * the process asynchronously and updates the DOM elements with the gathered statistics.
 * 
 * @throws {Error} If there is an error while loading the data or processing the tasks.
 */
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