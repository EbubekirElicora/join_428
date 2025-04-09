
const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Handles the sign-up process when the user submits the registration form.
 * Validates the form fields and stores the user data in localStorage if valid.
 * Redirects the user to a welcome page upon successful sign-up.
 *
 * @function
 */
document.addEventListener("DOMContentLoaded", function () {
    const signUpForm = document.getElementById("join-form");
    signUpForm.addEventListener("submit", function (event) {
        event.preventDefault();
        signUp();
    });
});

/**
 * Toggles the checkbox icon for the terms and conditions agreement.
 * 
 * This function switches the icon between a checked and unchecked state
 * by toggling the relevant Font Awesome classes. If the icon is checked,
 * it becomes unchecked, and vice versa. When the checkbox is checked,
 * any existing error message with the ID "terms-error" is removed from the DOM.
 *
 * @function toggleTermsCheckbox
 */
function toggleTermsCheckbox() {
    const termsIcon = document.getElementById('terms-icon');
    const isChecked = termsIcon.classList.contains('fa-square-check');
    if (isChecked) {
        termsIcon.classList.remove('fa-square-check');
        termsIcon.classList.add('fa-square');
    } else {
        termsIcon.classList.remove('fa-square');
        termsIcon.classList.add('fa-square-check');
        const error = document.getElementById("terms-error");
        if (error) error.remove(); // Clear error when checked
    }
}

/**
 * Displays an error message below the terms and conditions checkbox.
 *
 * If an error message element doesn't already exist, it creates one and appends it
 * to the checkbox container. The message content is then updated with the provided text.
 *
 * @function showCheckboxError
 * @param {string} message - The error message to display.
 */
function showCheckboxError(message) {
    let error = document.getElementById("terms-error");
    if (!error) {
        error = document.createElement("div");
        error.id = "terms-error";
        error.className = "error-message";
        const checkboxContainer = document.getElementById("terms-checkbox-wrapper");
        checkboxContainer.appendChild(error);
    }
    error.textContent = message;
}

/**
 * Checks whether the terms and conditions checkbox is currently marked as accepted.
 *
 * Determines acceptance by checking if the checkbox icon contains the
 * 'fa-square-check' class.
 *
 * @function isTermsAccepted
 * @returns {boolean} True if the checkbox is checked (terms accepted), false otherwise.
 */
function isTermsAccepted() {
    const termsIcon = document.getElementById('terms-icon');
    return termsIcon.classList.contains('fa-square-check');
}

/**
 * Handles the complete sign-up process: validation, user creation, and navigation.
 */
async function signUp() {
    const { name, email, password, confirmPassword } = getFormInputValues();
    clearError();
    const validationErrors = await validateSignupForm(name, email, password, confirmPassword);
    if (validationErrors.length > 0) {
        showErrors(validationErrors);
        return;
    }
    try {
        await registerNewUser(name, email, password);
        redirectToLoginWithSuccessMessage();
    } catch (error) {
        console.error("Error signing up:", error);
        showError("Error signing up. Try again later.", "confirm-password");
    }
}

/**
 * Retrieves and trims all signup input values from the DOM.
 * @returns {{ name: string, email: string, password: string, confirmPassword: string }}
 */
function getFormInputValues() {
    return {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
        confirmPassword: document.getElementById("confirm-password").value.trim()
    };
}

/**
 * Validates the sign-up form data and returns any validation errors.
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 * @param {string} confirmPassword 
 * @returns {Promise<Array<{message: string, inputId: string}>>}
 */
async function validateSignupForm(name, email, password, confirmPassword) {
    const errors = [];
    if (!name) errors.push({ message: "Name cannot be empty.", inputId: "name" });
    if (!email) {
        errors.push({ message: "Email cannot be empty.", inputId: "email" });
    } else if (!validateEmail(email)) {
        errors.push({ message: "Invalid email format.", inputId: "email" });
    } if (!password) {
        errors.push({ message: "Password cannot be empty.", inputId: "password" });
    } else {
        if (!hasUppercase(password)) { errors.push({ message: "Password must contain at least one uppercase letter.", inputId: "password" }); }
        if (password.length < 6) {
            errors.push({ message: "Password must be at least 6 characters long.", inputId: "password" });
        }
    }
    if (password && !confirmPassword) {
        errors.push({ message: "Please confirm your password.", inputId: "confirm-password" });
    } else if (password && confirmPassword && password !== confirmPassword) {
        errors.push({ message: "Passwords do not match.", inputId: "confirm-password" });
    }
    if (email && await userExists(email)) { errors.push({ message: "Email already registered.", inputId: "email" }); }
    if (!isTermsAccepted()) { errors.push({ message: "You must accept the Privacy Policy.", inputId: "terms" }); }
    return errors;
}

/**
 * Displays all error messages on the form.
 * @param {Array<{message: string, inputId: string}>} errors 
 */
function showErrors(errors) {
    errors.forEach(error => showError(error.message, error.inputId));
}

/**
 * Saves the user to the database and creates a contact.
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 */
async function registerNewUser(name, email, password) {
    const newUser = { name, email, password };
    await saveUserToFirebase(newUser);
    const newContact = {
        name: name,
        email: email,
        initials: getInitials(name),
        color: getRandomColor()
    };
    await saveContact(newContact);
}

/**
 * Shows a success toast and redirects to the login page after a delay.
 */
function redirectToLoginWithSuccessMessage() {
    showToast("You signed up successfully", "success");
    setTimeout(() => {
        window.location.href = "./log_in.html";
    }, 2000);
}

/**
 * Checks if the password contains at least one uppercase letter.
 * 
 * @param {string} password The password to check.
 * @returns {boolean} True if the password contains at least one uppercase letter, false otherwise.
 */
function hasUppercase(password) {
    const uppercaseRegex = /[A-Z]/;
    return uppercaseRegex.test(password);
}

/**
 * Displays an error message below the specified input field.
 * 
 * @param {string} message - The error message to display.
 * @param {string} inputId - The ID of the input field to display the error under.
 */
function showError(message, inputId) {
    const inputField = document.getElementById(inputId);
    if (!inputField) return;
    const existingError = inputField.nextElementSibling;
    if (existingError && existingError.classList.contains("error-message")) {
        existingError.remove();
    }
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.textContent = message;
    inputField.insertAdjacentElement("afterend", errorMessage);
}

/**
 * Clears all error messages.
 */
function clearError() {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach(error => error.remove());

    const termsError = document.getElementById("terms-error");
    if (termsError) {
        termsError.textContent = "";
    }
}

/**
 * Validates if the provided email address is in a valid format.
 * 
 * @param {string} email The email address to be validated.
 * @returns {boolean} Returns true if the email is valid, otherwise false.
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Checks if a user with the given email already exists in the database.
 * 
 * @param {string} email The email address of the user to check.
 * @returns {Promise<boolean>} A Promise that resolves to `true` if the user exists, otherwise `false`.
 */
async function userExists(email) {
    try {
        const response = await fetch(`${BASE_URL}users.json`);
        if (!response.ok) throw new Error("Failed to fetch users");

        const users = await response.json();
        return users && Object.values(users).some(user => user.email === email);
    } catch (error) {
        console.error("Error checking existing user:", error);
        return false;
    }
}

/**
 * Saves a new user to the Firebase database.
 * 
 * @param {Object} user The user object to save.
 * @param {string} user.email The email address of the user.
 * @param {string} user.name The name of the user.
 * @returns {Promise<void>} A Promise that resolves when the user is saved successfully.
 */
async function saveUserToFirebase(user) {
    try {
        const response = await fetch(`${BASE_URL}users.json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        if (!response.ok) throw new Error("Failed to save user");
    } catch (error) {
        console.error("Error saving user:", error);
        throw error;
    }
}

/**
 * Saves a contact to the Firebase database.
 * 
 * @param {Object} contact The contact object to save.
 * @param {string} contact.name The name of the contact.
 * @param {string} contact.email The email address of the contact.
 * @param {string} contact.phone The phone number of the contact.
 * @returns {Promise<void>} A Promise that resolves when the contact is saved successfully.
 */
async function saveContact(contact) {
    try {
        const response = await fetch(`${BASE_URL}contacts.json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact),
        });

        if (!response.ok) throw new Error("Failed to save contact");
    } catch (error) {
        console.error("Error saving contact:", error);
        throw error;
    }
}

/**
 * Generates initials from a full name.
 * 
 * @param {string} name The full name to extract initials from.
 * @returns {string} A string containing the initials of the name.
 */
function getInitials(name) {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
}

/**
 * Generates a random color in hexadecimal format.
 * 
 * @returns {string} A random color in hexadecimal format (e.g., "#A1B2C3").
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Clears the form by resetting all the fields within it.
 * 
 * This function targets the form with the ID "join-form" and resets its contents to 
 * their default values, effectively clearing any user inputs.
 * 
 * @function clearForm
 */
function clearForm() {
    document.getElementById("join-form").reset();
}

/**
 * Displays a toast message to the user.
 * 
 * @param {string} message The message to display in the toast.
 * @param {string} type The type of toast (e.g., 'success', 'error').
 */
function showToast(message, type) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
        toast.classList.add("hide");
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

/**
 * Toggles the visibility of a password input field and updates the icon.
 * @param {string} inputId - The ID of the password input element.
 * @param {string} toggleIconId - The ID of the icon container element.
 */
function togglePasswordVisibility(inputId, toggleIconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIconElement = document.getElementById(toggleIconId);
    if (!validateElements(passwordInput, toggleIconElement)) return;
    const toggleIcon = getToggleIconImage(toggleIconElement);
    if (!toggleIcon) return;
    const isHidden = passwordInput.type === 'password';
    updatePasswordVisibility(passwordInput, toggleIcon, isHidden);
}

/**
 * Validates whether the required elements exist.
 * @param {HTMLElement} input 
 * @param {HTMLElement} iconContainer 
 * @returns {boolean}
 */
function validateElements(input, iconContainer) {
    if (!input || !iconContainer) {
        console.error('Element not found');
        return false;
    }
    return true;
}

/**
 * Retrieves the image element inside the toggle icon container.
 * @param {HTMLElement} toggleIconElement 
 * @returns {HTMLImageElement|null}
 */
function getToggleIconImage(toggleIconElement) {
    const img = toggleIconElement.getElementsByTagName('img')[0];
    if (!img) {
        console.error('Image element not found inside toggleIconId:', toggleIconElement.id);
        return null;
    }
    return img;
}

/**
 * Updates the input type and icon based on visibility state.
 * @param {HTMLInputElement} input 
 * @param {HTMLImageElement} icon 
 * @param {boolean} show - Whether to show the password.
 */
function updatePasswordVisibility(input, icon, show) {
    input.type = show ? 'text' : 'password';
    icon.src = show ? '../assets/visibility.svg' : '../assets/visibility_off - Copy.svg';
    icon.alt = show ? 'Hide Password' : 'Show Password';
}