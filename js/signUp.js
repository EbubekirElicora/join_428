const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";

document.addEventListener("DOMContentLoaded", function () {
    const signUpForm = document.getElementById("join-form");

    // Attach event listener to form submission
    signUpForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form reload
        signUp();
    });
});

/**
 * Toggles the terms checkbox icon and enables/disables the signup button.
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
 * Handles the signup process.
 */
async function signUp() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    // Clear any existing error messages
    clearError();

    // Validate input fields
    if (!name || !email || !password || !confirmPassword) {
        showError("Please fill in all fields.", "name");
        return;
    }

    // Validate email format
    if (!validateEmail(email)) {
        showError("Invalid email format.", "email");
        return;
    }

    // Validate password match
    if (password !== confirmPassword) {
        showError("Passwords do not match.", "confirm-password");
        return;
    }

    // Check if user already exists
    if (await userExists(email)) {
        showError("Email already registered.", "email");
        return;
    }

    // Save user to Firebase
    try {
        const newUser = { name, email, password };
        await saveUserToFirebase(newUser);

        // Save user to contacts list (without phone number)
        const newContact = {
            name: name,
            email: email,
            initials: getInitials(name),
            color: getRandomColor(),
        };
        await saveContact(newContact);

        showToast("You signed up successfully", "success");

        setTimeout(() => {
            window.location.href = "./log_in.html"; // Redirect to login page
        }, 2000);
    } catch (error) {
        console.error("Error signing up:", error);
        showError("Error signing up. Try again later.", "confirm-password");
    }
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

    // Remove any existing error message
    const existingError = inputField.nextElementSibling;
    if (existingError && existingError.classList.contains("error-message")) {
        existingError.remove();
    }

    // Create and insert the error message
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

// Helper functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

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

function getInitials(name) {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function clearForm() {
    document.getElementById("join-form").reset();
}

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

// Toggle password visibility
function togglePasswordVisibility(inputId, toggleIconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIconElement = document.getElementById(toggleIconId);

    // Check if elements are found
    if (!passwordInput || !toggleIconElement) {
        console.error('Element not found');
        return;
    }

    const toggleIcon = toggleIconElement.getElementsByTagName('img')[0];

    // Check if image element is found
    if (!toggleIcon) {
        console.error('Image element not found inside toggleIconId:', toggleIconId);
        return;
    }

    // Toggle password visibility
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
