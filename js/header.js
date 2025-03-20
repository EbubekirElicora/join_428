// Function to show/hide mobile navigation
function HeaderMenu() {
    const menu = document.getElementById('mobileMenu');
    const userIcon = document.getElementById('user-initial');
    menu.classList.toggle('active');   
}

function logout() {
    
    localStorage.removeItem("userName");
    localStorage.removeItem("userInitials"); 
    localStorage.removeItem("isGuest"); 
    localStorage.setItem("isLoggedIn", "false");
    window.location.href = "../html/log_in.html";
}

function pageBack() {
    window.history.back();
}

document.addEventListener("DOMContentLoaded", function () {
    const observer = new MutationObserver(function (mutationsList, observer) {
        const nameMenuElement = document.getElementById("name_menu");
        if (nameMenuElement) {
            observer.disconnect();
            displayInitials();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});

function displayInitials() {
    const nameMenuElement = document.getElementById("name_menu");

    if (nameMenuElement) {
        // Check if the user is logged in and not navigating from signup/login
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const urlParams = new URLSearchParams(window.location.search);
        const fromSignup = urlParams.get("from") === "signup";

        if (isLoggedIn || !fromSignup) {
            // Only display initials if the user is logged in or not navigating from signup/login
            let initials = localStorage.getItem("userInitials");

            if (!initials) {
                initials = "G"; // Default to "G" for guests
                localStorage.setItem("userInitials", initials);
            }

            nameMenuElement.textContent = initials;
            nameMenuElement.style.visibility = "visible"; // Restore visibility
            nameMenuElement.style.opacity = "1"; // Restore opacity
            nameMenuElement.style.display = "flex"; // Ensure display: flex is applied
        } else {
            // Hide the name_menu if navigating from signup/login and the user is not logged in
            nameMenuElement.style.visibility = "hidden";
            nameMenuElement.style.opacity = "0";
        }
    } else {
        console.error("Element with id 'name_menu' not found!");
    }
}
