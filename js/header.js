/**
 * Toggles the active state of the mobile menu and changes the visibility of the user icon.
 * This function adds/removes the 'active' class on the `mobileMenu` element, 
 * controlling the display of the menu.
 */
function headerMenu() {
    const menu = document.getElementById('mobileMenu');
    const userIcon = document.getElementById('user-initial');
    menu.classList.toggle('active');
}

/**
 * Logs the user out by removing their information from `localStorage` and redirecting them to the login page.
 * It sets `isLoggedIn` to "false" in `localStorage` and clears the user's stored data.
 * 
 * @returns {void} This function does not return any value.
 */
function logout() {
    localStorage.removeItem("userName");
    localStorage.removeItem("userInitials");
    localStorage.removeItem("isGuest");
    localStorage.setItem("isLoggedIn", "false");
    window.location.href = "../html/log_in.html";
}

/**
 * Navigates the browser one step back in the history.
 * It simulates the user pressing the back button in the browser.
 * 
 * @returns {void} This function does not return any value.
 */
function pageBack() {
    window.history.back();
}

/**
 * Initializes a MutationObserver to wait until the `name_menu` element is available in the DOM. 
 * Once available, it calls the `displayInitials()` function to update the name menu with the user's initials.
 * 
 * @listens DOMContentLoaded
 */
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

/**
 * Displays the user's initials in the name menu element,
 * or hides the element depending on login status and origin.
 */
function displayInitials() {
    const nameMenuElement = document.getElementById("name_menu");
    if (!nameMenuElement) {
        console.error("Element with id 'name_menu' not found!");
        return;
    }
    const isLoggedIn = getLoginStatus();
    const fromSignup = navigatedFromSignup();
    if (isLoggedIn || !fromSignup) {
        const initials = getUserInitials();
        showInitials(nameMenuElement, initials);
    } else {
        hideNameMenu(nameMenuElement);
    }
}

/**
 * Checks if the user is currently logged in.
 * @returns {boolean}
 */
function getLoginStatus() {
    return localStorage.getItem("isLoggedIn") === "true";
}

/**
 * Checks whether the user navigated from the signup page.
 * @returns {boolean}
 */
function navigatedFromSignup() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("from") === "signup";
}

/**
 * Retrieves the user's initials from localStorage or sets a default.
 * @returns {string}
 */
function getUserInitials() {
    let initials = localStorage.getItem("userInitials");
    if (!initials) {
        initials = "G"; // Default value
        localStorage.setItem("userInitials", initials);
    }
    return initials;
}

/**
 * Displays the initials in the name menu element.
 * @param {HTMLElement} element 
 * @param {string} initials 
 */
function showInitials(element, initials) {
    element.textContent = initials;
    element.style.visibility = "visible";
    element.style.opacity = "1";
    element.style.display = "flex";
}

/**
 * Hides the name menu element (used when not logged in after signup).
 * @param {HTMLElement} element 
 */
function hideNameMenu(element) {
    element.style.visibility = "hidden";
    element.style.opacity = "0";
}