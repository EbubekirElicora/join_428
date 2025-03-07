document.addEventListener('DOMContentLoaded', function () {
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