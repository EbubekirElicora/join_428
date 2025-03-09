function isUserLoggedIn() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    console.log('isUserLoggedIn() returned:', isLoggedIn);
    console.log('localStorage isLoggedIn value:', localStorage.getItem('isLoggedIn'));
    return isLoggedIn;
}

function checkIfNavigatedFromSignup() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromSignup = urlParams.get("from") === "signup";
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    console.log("Navigated from signup:", fromSignup);
    console.log("Is user logged in?", isLoggedIn);
    console.log("localStorage isLoggedIn value:", localStorage.getItem("isLoggedIn"));

    if (fromSignup && !isLoggedIn) {
        console.log("User is not logged in and navigated from signup, showing privacy/legal notice links on mobile...");

        const sidebar = document.getElementById("sidebar");
        if (sidebar) {
            sidebar.classList.add("show-privacy-links-mobile");
            console.log("Added class to show privacy/legal notice links on mobile.");
            console.log("Sidebar classes:", sidebar.classList);
        } else {
            console.log("Sidebar not found.");
        }

        const hideElements = () => {
            const helpUserContainer = document.querySelector(".help_user_container");
            const nameMenu = document.getElementById("name_menu");
            const pageBackButton = document.getElementById("pageBackButton");

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
                pageBackButton.style.display = "none";
                console.log("pageBackButton found and hidden.");
            } else {
                console.log("pageBackButton not found.");
            }
        };

        hideElements();

        const globalObserver = new MutationObserver((mutations) => {
            console.log("DOM changes detected:", mutations);

            const sidebar = document.getElementById("sidebar");
            if (sidebar) {
                console.log("Sidebar found dynamically!");
                sidebar.classList.add("show-privacy-links-mobile");
                console.log("Added class to show privacy/legal notice links on mobile.");
                globalObserver.disconnect();
            }

            hideElements();
        });

        globalObserver.observe(document.body, { childList: true, subtree: true });
        console.log("Global mutation observer started on document body.");

        const sidebarObserver = new MutationObserver((mutations, observer) => {
            const sidebar = document.getElementById("sidebar");
            if (sidebar) {
                observer.disconnect();
                modifySidebar();
            }
        });

        sidebarObserver.observe(document.body, { childList: true, subtree: true });
    } else {
        console.log("User is logged in or not from signup, skipping showing privacy/legal notice links.");
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



