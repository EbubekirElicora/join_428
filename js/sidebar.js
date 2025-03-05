function isUserLoggedIn() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    console.log('isUserLoggedIn() returned:', isLoggedIn);
    console.log('localStorage isLoggedIn value:', localStorage.getItem('isLoggedIn'));
    return isLoggedIn;
}

function checkIfNavigatedFromSignup() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromSignup = urlParams.get("from") === "signup";

    console.log("Navigated from signup:", fromSignup);
    console.log("Is user logged in?", isUserLoggedIn());
    console.log("localStorage isLoggedIn value:", localStorage.getItem("isLoggedIn"));

    if (fromSignup && !isUserLoggedIn()) {
        console.log("User is not logged in, hiding sidebar items, header elements, and pageBack button...");

        // Function to hide elements
        const hideElements = () => {
            const helpUserContainer = document.querySelector(".help_user_container");
            const nameMenu = document.getElementById("name_menu");
            const pageBackButton = document.getElementById("pageBackButton"); // Assuming the button has ID "pageBackButton"

            if (helpUserContainer) {
                helpUserContainer.style.display = "none";
                console.log("help_user_container found and hidden.");
            } else {
                console.log("help_user_container not found.");
            }

            if (nameMenu) {
                nameMenu.style.visibility = "hidden";
                nameMenu.style.opacity = "0";

                console.log("name_menu found and hidden.");
            } else {
                console.log("name_menu not found.");
            }

            if (pageBackButton) {
                pageBackButton.style.display = "none"; // Hide the pageBack button
                console.log("pageBackButton found and hidden.");
            } else {
                console.log("pageBackButton not found.");
            }
        };

        // Hide elements on initial load
        hideElements();

        // Watch for changes to the entire document body
        const globalObserver = new MutationObserver((mutations) => {
            console.log("DOM changes detected:", mutations);
            hideElements(); // Re-run the hide function whenever the DOM changes
        });

        globalObserver.observe(document.body, { childList: true, subtree: true });
        console.log("Global mutation observer started on document body.");

        // Wait for sidebar to be added to the DOM
        const sidebarObserver = new MutationObserver((mutations, observer) => {
            const sidebar = document.getElementById("sidebar");
            if (sidebar) {
                observer.disconnect(); // Stop observing once sidebar is found
                modifySidebar();
            }
        });

        sidebarObserver.observe(document.body, { childList: true, subtree: true });
    } else {
        console.log("User is logged in or not from signup, skipping hiding elements.");
    }
}

function modifySidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
        console.error('Sidebar not found!');
        return;
    }

    console.log('Sidebar found, modifying...');
    const widgets = document.querySelectorAll('.widget');
    const sidebarLinks = document.querySelectorAll('.menu_bar a');
    const sidebarLogoContainer = document.querySelector('.sidebar_img_container');
    const privacyLinks = document.querySelectorAll('.privacy_and_noticy_container a');

    // Hide all sidebar items except Privacy Policy and Legal Notice
    widgets.forEach(widget => widget.style.display = 'none');
    sidebarLinks.forEach(link => {
        if (![...privacyLinks].includes(link)) {
            link.style.display = 'none';
        }
    });

    // Add login link below the logo
    if (sidebarLogoContainer) {
        const loginLinkContainer = document.createElement('div');
        loginLinkContainer.innerHTML = `
            <a href="../html/log_in.html" class="login-link">
                <img src="../assets/login icon.svg" alt="Login Icon" class="login-icon">
                <span>Login</span>
            </a>`;
        loginLinkContainer.style.marginTop = '40px'; 
        loginLinkContainer.style.marginLeft = '-90px'; 
        sidebarLogoContainer.appendChild(loginLinkContainer);

        console.log('Login link added below the logo.');
    }
}

// Run the function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    checkIfNavigatedFromSignup();
});