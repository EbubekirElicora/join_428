
/**
 * Firebase-link
 */
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
 * Toggles the state of the terms checkbox and enables/disables the signup button accordingly.
 * 
 * This function checks whether the terms checkbox is checked or not by inspecting
 * the icon's classes, and based on that:
 * 1. It updates the checkbox icon (from unchecked to checked, or vice versa).
 * 2. It enables or disables the signup button.
 * 
 * @function toggleTermsCheckbox
 */
function toggleTermsCheckbox() {
    const termsIcon = document.getElementById('terms-icon');
    const signupButton = document.getElementById('signup-btn');
    const isChecked = termsIcon.classList.contains('fa-square-check');

    if (isChecked) {
        termsIcon.classList.remove('fa-square-check');
        termsIcon.classList.add('fa-square');
        signupButton.disabled = true; // Disable the button if unchecked
    } else {
        termsIcon.classList.remove('fa-square');
        termsIcon.classList.add('fa-square-check');
        signupButton.disabled = false; // Enable the button if checked
    }
}

/**
 * Handles the user signup process.
 * 
 * 1. Collects and validates form data (name, email, password, confirm password).
 * 2. Checks if the email is already registered.
 * 3. Saves the user information to Firebase if the input is valid.
 * 4. Creates a new contact in the database for the user.
 * 5. Displays success or error messages based on the outcome.
 * 
 * @async
 * @function signUp
 */
async function signUp() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    clearError(); // Remove any existing errors
    let errors = []; // Array to collect errors

    // Validate name field
    if (!name) errors.push({ message: "Name cannot be empty.", inputId: "name" });

    // Validate email
    if (!email) {
        errors.push({ message: "Email cannot be empty.", inputId: "email" });
    } else if (!validateEmail(email)) {
        errors.push({ message: "Invalid email format.", inputId: "email" });
    }

    // Validate password fields
    if (!password) errors.push({ message: "Password cannot be empty.", inputId: "password" });
    else if (!hasUppercase(password)) errors.push({ message: "Password must contain at least one uppercase letter.", inputId: "password" });
    else if (password.length < 6) errors.push({ message: "Password must be at least 6 characters long.", inputId: "password" });

    if (!confirmPassword) errors.push({ message: "Please confirm your password.", inputId: "confirm-password" });
    if (password && confirmPassword && password !== confirmPassword) {
        errors.push({ message: "Passwords do not match.", inputId: "confirm-password" });
    }

    // Check if email is already registered
    if (email && await userExists(email)) {
        errors.push({ message: "Email already registered.", inputId: "email" });
    }

    // Display all errors at once
    if (errors.length > 0) {
        errors.forEach(error => showError(error.message, error.inputId));
        return; // Stop execution if there are errors
    }

    // Proceed with signup if no errors
    try {
        const newUser = { name, email, password };
        await saveUserToFirebase(newUser);

        const newContact = {
            name: name,
            email: email,
            initials: getInitials(name),
            color: getRandomColor(),
        };
        await saveContact(newContact);

        showToast("You signed up successfully", "success");
        setTimeout(() => {
            window.location.href = "./log_in.html";
        }, 2000);
    } catch (error) {
        console.error("Error signing up:", error);
        showError("Error signing up. Try again later.", "confirm-password");
    }
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
 * Toggles the visibility of a password input field and updates the corresponding icon.
 * 
 * @param {string} inputId The ID of the password input field.
 * @param {string} toggleIconId The ID of the element containing the toggle icon.
 */
function togglePasswordVisibility(inputId, toggleIconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIconElement = document.getElementById(toggleIconId);
    if (!passwordInput || !toggleIconElement) {
        console.error('Element not found');
        return;
    }
    const toggleIcon = toggleIconElement.getElementsByTagName('img')[0];
    if (!toggleIcon) {
        console.error('Image element not found inside toggleIconId:', toggleIconId);
        return;
    }
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.src = '/Assets/visibility.svg';
        toggleIcon.alt = 'Hide Password';
        console.log('Password is now visible.');
    } else {
        passwordInput.type = 'password';
        toggleIcon.src = '/Assets/visibility_off - Copy.svg';
        toggleIcon.alt = 'Show Password';
        console.log('Password is now hidden.');
    }
}
