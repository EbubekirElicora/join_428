function checkIfNavigatedFromSignup() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromSignup = urlParams.get("from") === "signup";

    console.log("Navigated from signup:", fromSignup);  // Log the navigation status

    if (fromSignup) {
        console.log("Navigated from signup, hiding sidebar items and header elements...");

        // Hide the help_user_container if it's found on page load
        const helpUserContainer = document.querySelector(".help_user_container");
        if (helpUserContainer) {
            helpUserContainer.style.display = "none";
            console.log("help_user_container hidden on page load.");
        } else {
            console.log("help_user_container not found on page load.");
        }

        // Hide the name_menu element on page load
        const nameMenu = document.getElementById("name_menu");
        if (nameMenu) {
            nameMenu.style.display = "none";  // Hide name_menu
            console.log("name_menu hidden on page load.");
        } else {
            console.log("name_menu not found on page load.");
        }

        // Watch for changes to the header to check for name_menu if it's added dynamically
        const headerObserver = new MutationObserver((mutations, observer) => {
            const nameMenu = document.getElementById("name_menu");
            if (nameMenu) {
                nameMenu.style.display = "none";  // Hide name_menu
                console.log("name_menu dynamically added! Hiding now.");
                observer.disconnect(); // Stop observing after it's found and hidden
            }
        });

        // Observe the header for changes (like dynamic addition of name_menu)
        const header = document.querySelector("header");
        if (header) {
            headerObserver.observe(header, { childList: true, subtree: true });
        } else {
            console.log("Header element not found for mutation observer.");
        }

        // Wait for sidebar to be added to the DOM
        const sidebarObserver = new MutationObserver((mutations, observer) => {
            const sidebar = document.getElementById("sidebar");
            if (sidebar) {
                observer.disconnect(); // Stop observing once sidebar is found
                modifySidebar();
            }
        });

        sidebarObserver.observe(document.body, { childList: true, subtree: true });
    }
}

function modifySidebar() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) {
        console.error("Sidebar not found!");
        return;
    }

    console.log("Sidebar found, modifying...");
    const widgets = document.querySelectorAll(".widget");
    const sidebarLinks = document.querySelectorAll(".menu_bar a");
    const sidebarLogoContainer = document.querySelector(".sidebar_img_container");
    const privacyLinks = document.querySelectorAll(".privacy_and_noticy_container a");

    // Hide all sidebar items except Privacy Policy and Legal Notice
    widgets.forEach(widget => widget.style.display = "none");
    sidebarLinks.forEach(link => {
        if (![...privacyLinks].includes(link)) {
            link.style.display = "none";
        }
    });

    // Add login link below the logo
    if (sidebarLogoContainer) {
        const loginLinkContainer = document.createElement('div');
        loginLinkContainer.innerHTML = `
            <a href="../html/log_in.html" class="login-link">
                <img src="../assets/login icon.svg" alt="Login Icon" class="login-icon">
                <span>Login</span>
            </a>
        `;
        loginLinkContainer.style.marginTop = "40px"; 
        loginLinkContainer.style.marginLeft = "-90px"; 
        sidebarLogoContainer.appendChild(loginLinkContainer);

        console.log("Login link added below the logo.");
    }
}

// Run the function after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");
    checkIfNavigatedFromSignup();
});
