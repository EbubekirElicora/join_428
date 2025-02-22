// Function to show/hide mobile navigation
function HeaderMenu() {
    const menu = document.getElementById('mobileMenu');
    const userIcon = document.getElementById('user-initial');
    menu.classList.toggle('active');

    // Add an event listener to close the menu when clicking outside of it
}

function logout() {
    localStorage.removeItem("userInitials");
    window.location.href = "../html/log_in.html";
}

function pageBack() {
    window.history.back();
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded"); // Debugging

    const observer = new MutationObserver(function (mutationsList, observer) {
        console.log("DOM changed"); // Debugging

        const nameMenuElement = document.getElementById("name_menu");
        if (nameMenuElement) {
            console.log("Element with id 'name_menu' found!"); // Debugging
            observer.disconnect();
            displayInitials();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});

function displayInitials() {
    const nameMenuElement = document.getElementById("name_menu");
    if (nameMenuElement) {
        const initials = localStorage.getItem("userInitials");
        console.log("Initials from localStorage:", initials); // Debugging
        if (initials) {
            nameMenuElement.textContent = initials;
            console.log("Updated name_menu with initials:", initials); // Debugging
        } else {
            console.error("No initials found in localStorage!"); // Debugging
        }
    } else {
        console.error("Element with id 'name_menu' not found!");
    }
}