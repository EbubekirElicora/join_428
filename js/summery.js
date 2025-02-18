
document.addEventListener('DOMContentLoaded', function () {
    const isGuest = localStorage.getItem("isGuest");

    // Display the user's name or "Guest"
    const greetedUserElement = document.getElementById('greeted_user');
    if (isGuest === "true") {
        greetedUserElement.textContent = "Guest"; // Greet as Guest
    } else {
        const userName = localStorage.getItem('userName');
        if (userName) {
            greetedUserElement.textContent = userName; // Greet with the user's name
        }
    }

    // Display the time-based greeting
    const greetText = document.getElementById('greets_text');
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
});