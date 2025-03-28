/**
 * Toggles the active state of the mobile menu and changes the visibility of the user icon.
 * This function adds/removes the 'active' class on the `mobileMenu` element, 
 * controlling the display of the menu.
 */
function HeaderMenu() {
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
 * Displays the user's initials in the `name_menu` element if the user is logged in.
 * If the user is not logged in, the initials are hidden. 
 * If no initials are stored, a default value of "G" is used.
 * 
 * @returns {void} This function does not return any value.
 */
function displayInitials() {
    const nameMenuElement = document.getElementById("name_menu");
    if (nameMenuElement) {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const urlParams = new URLSearchParams(window.location.search);
        const fromSignup = urlParams.get("from") === "signup";
        if (isLoggedIn || !fromSignup) {
            let initials = localStorage.getItem("userInitials");
            if (!initials) {
                initials = "G"; 
                localStorage.setItem("userInitials", initials);
            }
            nameMenuElement.textContent = initials;
            nameMenuElement.style.visibility = "visible"; 
            nameMenuElement.style.opacity = "1"; 
            nameMenuElement.style.display = "flex"; 
        } else {
            nameMenuElement.style.visibility = "hidden";
            nameMenuElement.style.opacity = "0";
        }
    } else {
        console.error("Element with id 'name_menu' not found!");
    }
}
