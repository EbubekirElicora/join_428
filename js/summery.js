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

    // Show the greeting overlay on smaller screens
    const mobileGreetsContainer = document.querySelector('.mobile_greets_container');

    if (window.innerWidth < 960) { // Only for smaller screens
        // Ensure the greeting text and user name are updated in the overlay
        const greetsTextOverlay = document.getElementById('greets_text');
        const greetedUserOverlay = document.getElementById('greeted_user');

        greetsTextOverlay.textContent = greeting;
        greetedUserOverlay.textContent = isGuest === "true" ? "Guest" : localStorage.getItem('userName');

        // Show the overlay
        mobileGreetsContainer.style.display = 'flex';

        // Hide the overlay after 3 seconds
        setTimeout(() => {
            mobileGreetsContainer.classList.add('hide');
        }, 2000); // 3 seconds
    }
});



function loadUserInfo() {
    const userName = localStorage.getItem("userName") || "Guest";
    document.getElementById("greeted_user").textContent = userName;
}
document.addEventListener("DOMContentLoaded", loadUserInfo);