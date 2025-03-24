/**
 * Checks if the user is logged in by verifying the 'isLoggedIn' value in localStorage.
 * 
 * @returns {boolean} - True if the user is logged in, otherwise false.
 */
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

/**
 * Checks if the user navigated from the signup page and modifies the DOM accordingly.
 * Hides specific elements and adds privacy/legal notice links if the user is not logged in.
 */
function checkIfNavigatedFromSignup() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromSignup = urlParams.get("from") === "signup";
    const isLoggedIn = isUserLoggedIn();

    if (fromSignup && !isLoggedIn) {
        const sidebar = document.getElementById("sidebar");

        // If sidebar is not found, skip and let the MutationObserver handle it
        if (!sidebar) {
            console.log("Sidebar not found yet. Waiting for DOM update...");
        } else {
            sidebar.classList.add("show-privacy-links-mobile");
        }

        hideElements();

        const globalObserver = new MutationObserver(() => {
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
        console.log("User is logged in or not from signup, skipping showing privacy/legal notice links.");
    }
}

/**
 * Hides specific elements in the DOM that are not needed when the user navigates from the signup page.
 */
function hideElements() {
    const helpUserContainer = document.querySelector(".help_user_container");
    const nameMenu = document.getElementById("name_menu");
    const pageBackButton = document.getElementById("pageBackButton");
    const helpIcon = document.querySelector(".help_icon");
    const posContHeadRight = document.querySelector(".pos_cont_head_right");
    const navPositionButton = document.getElementsByClassName("nav_position_button")

    if (helpUserContainer) helpUserContainer.style.display = "none";
    if (nameMenu) nameMenu.style.display = "none";
    if (pageBackButton) pageBackButton.style.display = "none";
    if (helpIcon) helpIcon.style.display = "none";
    if (navPositionButton) navPositionButton.style.paddingLeft = "0";
    if (posContHeadRight) {
        posContHeadRight.style.display = "none";
    } else {
        const observer = new MutationObserver(() => {
            const posContHeadRight = document.querySelector(".pos_cont_head_right");
            if (posContHeadRight) {
                posContHeadRight.style.display = "none";
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

/**
 * Modifies the sidebar to hide all elements except privacy/legal notice links and adds a login link.
 */
function modifySidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
        console.error('Sidebar not found!');
        return;
    }

    const widgets = document.querySelectorAll('.widget');
    const sidebarLinks = document.querySelectorAll('.menu_bar a');
    const sidebarLogoContainer = document.querySelector('.sidebar_img_container');
    const privacyLinks = document.querySelectorAll('.privacy_and_noticy_container a');
    widgets.forEach(widget => widget.style.display = 'none');
    sidebarLinks.forEach(link => {
        if (![...privacyLinks].includes(link)) {
            link.style.display = 'none';
        }
    });
    if (sidebarLogoContainer) {
        const loginLinkContainer = document.createElement('div');
        loginLinkContainer.innerHTML = `
            <a href="../html/log_in.html" class="login-link">
                <img src="../assets/login icon.svg" alt="Login Icon" class="login-icon">
                <span>Login</span>
            </a>`;
        loginLinkContainer.style.display = 'flex'
        loginLinkContainer.style.justifyContent = 'center'
        loginLinkContainer.style.alignItems = 'center'
        loginLinkContainer.style.marginTop = '40px'; 
        loginLinkContainer.style.marginLeft = '-50px'; 
        sidebarLogoContainer.appendChild(loginLinkContainer);
    }
}

// Run the function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    checkIfNavigatedFromSignup();
});