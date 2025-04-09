/**
 * Checks if user is logged in by verifying localStorage flag
 * @returns {boolean} True if user is logged in, false otherwise
 */
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

/**
 * Checks if the user navigated from the signup page and is not logged in.
 * If so, it triggers UI changes to customize the interface accordingly.
 */
function checkIfNavigatedFromSignup() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromSignup = urlParams.get("from") === "signup";
    const isLoggedIn = isUserLoggedIn();
    if (fromSignup && !isLoggedIn) {
        addPrivacyLinksToSidebar();
        hideCertainElements();
        observeForSidebarChanges();
    }
}

/**
 * Adds a CSS class to the sidebar to show privacy-related links for mobile view.
 */
function addPrivacyLinksToSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
        sidebar.classList.add("show-privacy-links-mobile");
    }
}

/**
 * Hides various UI elements that should not be visible 
 * to users who just signed up and are not yet logged in.
 * Also sets up a MutationObserver to hide dynamic elements.
 */
function hideCertainElements() {
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
}

/**
 * Observes the DOM for sidebar or content changes and re-applies
 * the sidebar class or hides elements when necessary.
 */
function observeForSidebarChanges() {
    const globalObserver = new MutationObserver(() => {
        addPrivacyLinksToSidebar();
        hideCertainElements();
        globalObserver.disconnect();
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

/**
 * Modifies the sidebar for users who navigated from the signup page.
 * Hides unrelated widgets and links, and adds a login link to the sidebar.
 */
function modifySidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    hideSidebarWidgets();
    filterSidebarLinks();
    addLoginLinkToSidebar();
}

/**
 * Hides all widgets inside the sidebar.
 */
function hideSidebarWidgets() {
    document.querySelectorAll('.widget').forEach(widget => {
        widget.style.display = 'none';
    });
}

/**
 * Hides all menu bar links except for the ones that match the privacy links.
 */
function filterSidebarLinks() {
    const privacyLinks = document.querySelectorAll('.privacy_and_noticy_container a');
    const privacyLinkSet = new Set([...privacyLinks]);
    document.querySelectorAll('.menu_bar a').forEach(link => {
        if (!privacyLinkSet.has(link)) {
            link.style.display = 'none';
        }
    });
}

/**
 * Adds a login link with icon to the sidebar's logo container.
 */
function addLoginLinkToSidebar() {
    const sidebarLogoContainer = document.querySelector('.sidebar_img_container');
    const sidefoot = document.getElementById('sidefoot');
    if (!sidebarLogoContainer || !sidefoot) return;
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

/**
 * INITIALIZATION
 * Runs when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    checkIfNavigatedFromSignup();
});