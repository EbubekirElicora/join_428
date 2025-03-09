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




async function loadTasksFromFirebase() {
    try {
        const tasksData = await loadData("tasks");
        const tasks = Object.keys(tasksData).map((key) => {
            const task = tasksData[key];
            const dueDate = task.dueDate ? new Date(task.dueDate) : null;
            return {
                id: key,
                title: task.title || "Untitled",
                description: task.description || "No description",
                priority: task.prio || "low",
                dueDate: dueDate,
                category: task.category || "todo",
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



async function loadPositionsFromFirebase() {
    const positionsData = await loadData("positionDropArea");
    return positionsData || {};
}

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
        const position = positions[task.id] || "todo";
        if (position === "todo") {
            todoCount++;
        } else if (position === "done") {
            doneCount++;
        } else if (position === "inProgress") {
            inProgressCount++;
        } else if (position === "awaitFeedback") {
            feedbackCount++;
        }

        // Count "Urgent" tasks
        if (task.priority === "urgent") {
            urgentCount++;
            // Check due date
            if (task.dueDate) {
                if (!nearestDeadline || task.dueDate < nearestDeadline) {
                    nearestDeadline = task.dueDate;
                }
            }
        }
    });

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

async function updateSummary() {
    const stats = await calculateStatistics();

    // Update DOM elements
    document.querySelector(".todo_number").innerText = stats.todoCount;
    document.querySelector(".done_number").innerText = stats.doneCount;
    document.querySelector(".urgent_number").innerText = stats.urgentCount;
    document.querySelector(".board_number").innerText = stats.boardTaskCount;
    document.querySelector(".progress_number").innerText = stats.inProgressCount;
    document.querySelector(".feedback_number").innerText = stats.feedbackCount;

    // Format and display the nearest deadline
    const datumElement = document.getElementById("date");
    if (stats.nearestDeadline) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = stats.nearestDeadline.toLocaleDateString('de-DE', options);
        datumElement.innerText = formattedDate;
    } else {
        datumElement.innerText = "No upcoming deadlines";
    }
}