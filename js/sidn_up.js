const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";

document.addEventListener("DOMContentLoaded", function () {
    const signUpButton = document.getElementById("signup-btn");
    const termsCheckbox = document.getElementById("terms-checkbox");
    const signUpForm = document.getElementById("join-form");

    // Enable signup button only when checkbox is checked
    termsCheckbox.addEventListener("change", function () {
        signUpButton.disabled = !this.checked;
    });

    // Attach event listener to form submission
    signUpForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form reload
        signUp();
    });
});

async function signUp() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    // Validate input fields
    if (!name || !email || !password || !confirmPassword) {
        
        return;
    }

    // Validate email format
    if (!validateEmail(email)) {
        showToast("Invalid email format.", "error");
        clearForm();
        return;
    }

    // Validate password match
    if (password !== confirmPassword) {
        showToast("Passwords do not match.", "error");
        return;
    }

    // Check if user already exists
    if (await userExists(email)) {
        showToast("Email already registered.", "error");
        clearForm();
        return;
    }

    // Save user to Firebase
    try {
        const newUser = { name, email, password };
        await saveUserToFirebase(newUser);
        showToast("You signed up successfully", "success");

        setTimeout(() => {
            window.location.href = "./log_in.html"; // Redirect to login page
        }, 2000);
    } catch (error) {
        console.error("Error signing up:", error);
        showToast("Error signing up. Try again later.", "error");
    }
}

// Function to validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to check if user exists
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

// Function to save user to Firebase
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

// Function to clear form
function clearForm() {
    document.getElementById("join-form").reset();
}

// Function to show toast notification
function showToast(message, type) {
    // Create toast container
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    // Apply 'show' class after a short delay to trigger animation
    setTimeout(() => toast.classList.add("show"), 100);

    // Hide toast after 2.5 seconds
    setTimeout(() => {
        toast.classList.add("hide"); // Slide up slightly
        setTimeout(() => toast.remove(), 500); // Remove from DOM
    }, 2500);
}


// Toggle password visibility
function togglePasswordVisibility(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const icon = document.getElementById(iconId).querySelector("img");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.src = "../assets/visibility_on.svg";
    } else {
        passwordInput.type = "password";
        icon.src = "../assets/visibility_off - Copy.svg";
    }
}
