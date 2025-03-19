function isUserLoggedIn() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return isLoggedIn;
}

function checkIfNavigatedFromSignup() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromSignup = urlParams.get("from") === "signup";
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (fromSignup && !isLoggedIn) {
        const sidebar = document.getElementById("sidebar");
        if (sidebar) {
            sidebar.classList.add("show-privacy-links-mobile");
        } else {
            console.error("Sidebar not found.");
        }

        const hideElements = () => {
            const helpUserContainer = document.querySelector(".help_user_container");
            const nameMenu = document.getElementById("name_menu");
            const pageBackButton = document.getElementById("pageBackButton");
            const helpIcon = document.querySelector(".help_icon"); // Select the help icon
        
            if (helpUserContainer) {
                helpUserContainer.style.display = "none";
            } else {
                console.error("help_user_container not found.");
            }
        
            if (nameMenu) {
                nameMenu.style.visibility = "hidden";
                nameMenu.style.opacity = "0";
            } else {
                console.error("name_menu not found.");
            }
        
            if (pageBackButton) {
                pageBackButton.style.display = "none";
            } else {
                console.error("pageBackButton not found.");
            }
        
            if (helpIcon) {
                helpIcon.style.display = "none"; // Hide the help icon
            } else {
                console.error("help_icon not found.");
            }
        };

        hideElements();

        const globalObserver = new MutationObserver((mutations) => {
            console.log("DOM changes detected:", mutations);

            const sidebar = document.getElementById("sidebar");
            if (sidebar) {
                sidebar.classList.add("show-privacy-links-mobile");
                globalObserver.disconnect();
            }

            hideElements();
        });

        globalObserver.observe(document.body, { childList: true, subtree: true });
        const sidebarObserver = new MutationObserver((mutations, observer) => {
            const sidebar = document.getElementById("sidebar");
            if (sidebar) {
                observer.disconnect();
                modifySidebar();
            }
        });

        sidebarObserver.observe(document.body, { childList: true, subtree: true });
    } else {
        console.error("User is logged in or not from signup, skipping showing privacy/legal notice links.");
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

    }
}

// Run the function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    checkIfNavigatedFromSignup();
});



