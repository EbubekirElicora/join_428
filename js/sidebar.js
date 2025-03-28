/**
 * AUTHENTICATION HELPER FUNCTIONS
 */

/**
 * Checks if user is logged in by verifying localStorage flag
 * @returns {boolean} True if user is logged in, false otherwise
 */
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

/**
 * SIGNUP NAVIGATION HANDLER
 * Handles special case when user arrives from signup page but isn't logged in
 */
function checkIfNavigatedFromSignup() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromSignup = urlParams.get("from") === "signup";
    const isLoggedIn = isUserLoggedIn();

    if (fromSignup && !isLoggedIn) {
        // Show privacy/legal links in mobile sidebar
        const sidebar = document.getElementById("sidebar");
        if (sidebar) {
            sidebar.classList.add("show-privacy-links-mobile");
        }

        /**
         * Hides various UI elements that shouldn't be visible in this state
         */
        const hideElements = () => {
            const elementsToHide = [
                ".help_user_container",
                "#name_menu",
                "#pageBackButton",
                ".help_icon",
                ".pos_cont_head_right"
            ];

            elementsToHide.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) element.style.display = "none";
            });

            
            const observer = new MutationObserver(() => {
                const posContHeadRight = document.querySelector(".pos_cont_head_right");
                if (posContHeadRight) {
                    posContHeadRight.style.display = "none";
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        };

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

        
        const sidebarObserver = new MutationObserver((_, observer) => {
            const sidebar = document.getElementById("sidebar");
            if (sidebar) {
                observer.disconnect();
                modifySidebar();
            }
        });
        sidebarObserver.observe(document.body, { childList: true, subtree: true });
    }
}

/**
 * SIDEBAR MODIFICATION FUNCTION
 * Modifies the sidebar to show only privacy links and login option
 */
function modifySidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    // Hide all regular sidebar content
    document.querySelectorAll('.widget').forEach(widget => widget.style.display = 'none');
    
    // Hide all menu links except privacy/legal notices
    const privacyLinks = document.querySelectorAll('.privacy_and_noticy_container a');
    document.querySelectorAll('.menu_bar a').forEach(link => {
        if (![...privacyLinks].includes(link)) {
            link.style.display = 'none';
        }
    });

    // Add login link below logo
    const sidebarLogoContainer = document.querySelector('.sidebar_img_container');
    const sidefoot = document.getElementById('sidefoot');
    if (sidebarLogoContainer) {
        const loginLinkContainer = document.createElement('div');
        loginLinkContainer.innerHTML = `
            <a href="../html/log_in.html" class="login-link">
                <img src="../assets/login icon.svg" alt="Login Icon" class="login-icon">
                <span>Login</span>
            </a>`;
        loginLinkContainer.style.marginTop = '40px'; 
        loginLinkContainer.style.marginLeft = '-50px'; 
        sidefoot.style.paddingRight = '56px';
        sidebarLogoContainer.appendChild(loginLinkContainer);
    }
}

/**
 * INITIALIZATION
 * Runs when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    checkIfNavigatedFromSignup();
});