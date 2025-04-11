/**
 * Initializes the application.
 * Calls the logoMuve function to control the animation.
 * 
 * @returns {void}
 */
function init() {
    logoMuve();
}

/**
 * Redirects the user to the sign-up page.
 * 
 * @returns {void}
 */
function toSignUp() {
    window.location.href = "./sign_up.html";
}

/**
 * Logs the user in as a guest and redirects to the summary page.
 * 
 * @returns {void}
 */
function guestLogIn() {
    localStorage.removeItem("userInitials");
    localStorage.removeItem("userName");
    localStorage.setItem("isGuest", "true");
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "../html/summary.html";
}

/**
 * Controls the display of the logo after the animation.
 * Hides the animation and shows the logo after a delay of 1.5 seconds.
 * 
 * @returns {void}
 */
function logoMuve() {
    setTimeout(() => {
        document.getElementById('animation').style.display = "none";
        document.getElementById('logo').style.display = "block";
    }, 1500);
}

/**
 * Starts the login process and validates user input.
 * 
 * @async
 * @returns {Promise<void>}
 */
async function logIn() {
    let email = getInputValue("email");
    let password = getInputValue("password");
    let alertBox = getAlertBox();
    let emailLabel = document.getElementById("label_input");
    let passwordLabel = document.getElementById("label_password");
    resetErrorStyles(emailLabel, passwordLabel, alertBox);
    if (!email || !password) {
        showError(emailLabel, passwordLabel, alertBox);
        return;
    }
    let users = await fetchUsers(alertBox);
    if (!users) return;
    validateUser(users, email, password, alertBox, emailLabel, passwordLabel);
}

/**
 * Retrieves the value of an input field and trims whitespace.
 * 
 * @param {string} id - The ID of the input field.
 * @returns {string} The trimmed value of the input field.
 */
function getInputValue(id) {
    return document.getElementById(id).value.trim();
}

/**
 * Retrieves the alert element.
 * 
 * @returns {HTMLElement} The alert element.
 */
function getAlertBox() {
    return document.getElementById("alert");
}

/**
 * Loads user data from the database.
 * 
 * @async
 * @param {HTMLElement} alertBox - The alert element to display errors.
 * @returns {Promise<Object|null>} The user data or `null` if an error occurs.
 */
async function fetchUsers(alertBox) {
    let users = await loadData("users");
    if (!users) {
        showAlert(alertBox, "Database error. Please try again later.");
    }
    return users;
}

/**
 * Validates whether the entered user credentials are correct.
 * @param {Object} users - The list of all users.
 * @param {string} email - The entered email address.
 * @param {string} password - The entered password.
 * @param {HTMLElement} alertBox - The alert element for displaying errors.
 * @param {HTMLElement} emailLabel - The label for the email input field.
 * @param {HTMLElement} passwordLabel - The label for the password input field.
 */
function validateUser(users, email, password, alertBox, emailLabel, passwordLabel) {
    let user = Object.values(users).find(u => u.email === email && u.password === password);
    if (user) {
        saveUserData(user);
        redirectToSummary();
    } else {
        showError(emailLabel, passwordLabel, alertBox);
    }
}

/**
 * Displays an error message and highlights the input fields.
 * @param {HTMLElement} emailLabel - The label for the email input field.
 * @param {HTMLElement} passwordLabel - The label for the password input field.
 * @param {HTMLElement} alertBox - The alert element for displaying the error.
 */
function showError(emailLabel, passwordLabel, alertBox) {
    let errorMessage = "Check your email and password. Please try again.";
    showAlert(alertBox, errorMessage);
    emailLabel.classList.add("label_user_red");
    passwordLabel.classList.add("label_user_red");
}

/**
 * Resets the error styles for input fields.
 * @param {HTMLElement} emailLabel - The label for the email input field.
 * @param {HTMLElement} passwordLabel - The label for the password input field.
 * @param {HTMLElement} alertBox - The alert element.
 */
function resetErrorStyles(emailLabel, passwordLabel, alertBox) {
    emailLabel.classList.remove("label_user_red");
    passwordLabel.classList.remove("label_user_red");
    alertBox.style.display = "none";
}

/**
 * Saves user data to local storage.
 * 
 * @param {Object} user - The user object.
 */
function saveUserData(user) {
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userInitials", getInitials(user.name));
    localStorage.setItem("isLoggedIn", "true");
}

/**
 * Redirects the user to the summary page.
 */
function redirectToSummary() {
    window.location.href = "../html/summary.html";
}

/**
 * Displays an error message inside the alert box.
 * 
 * @param {HTMLElement} alertBox - The alert element.
 * @param {string} message - The message to display.
 */
function showAlert(alertBox, message) {
    alertBox.textContent = message;
    alertBox.style.display = "block";
}

/**
 * Generates initials from a full name.
 * 
 * @param {string} name - The full name of the user.
 * @returns {string} The user's initials.
 */
function getInitials(name) {
    let words = name.split(" ");  
    return words[0][0].toUpperCase() + (words[1] ? words[1][0].toUpperCase() : "");
}
document.addEventListener("DOMContentLoaded", function () {
    const togglePassword = document.getElementById("togglePassword");
    if (togglePassword) {
        togglePassword.addEventListener("click", togglePasswordVisibility);
    } else {
        console.error("Element with ID 'togglePassword' not found!");
    }
});

/**
 * Toggles the visibility of the password input field.
 * If the password is currently hidden, it changes the input type to "text" to show the password,
 * and updates the toggle icon to a visibility icon.
 * If the password is visible, it changes the input type back to "password" and updates the toggle icon to a lock icon.
 * 
 * @returns {void} This function does not return any value.
 */
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.getElementById("togglePassword");
    if (passwordInput && toggleIcon) {
        if (passwordInput.type === "password") {
            passwordInput.type = "text"; 
            toggleIcon.src = "../assets/visibility.svg"; 
        } else {
            passwordInput.type = "password"; 
            toggleIcon.src = "../assets/icons/lock.png"; 
        }
    } else {
        console.error("Password input or toggle icon not found!");
    }
}