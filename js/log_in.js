/**
 * Initialisiert die Anwendung.
 * Ruft die Funktion logoMuve auf, um die Animation zu steuern.
 * 
 * @returns {void} - Keine Rückgabe.
 */
function init () {
    logoMuve();
}

/**
 * Leitet den Benutzer zur Anmeldeseite weiter.
 * 
 * @returns {void} - Keine Rückgabe.
 */
function toSignUp() {
    window.location.href = "./sign_up.html";
}

/**
 * Leitet den Benutzer zur Zusammenfassungsseite weiter, wenn er als Gast einloggt.
 * 
 * @returns {void} - Keine Rückgabe.
 */
function guestLogIn() {
    window.location.href = "./summary.html";
}

/**
 * Steuert die Anzeige des Logos nach der Animation.
 * Versteckt die Animation und zeigt das Logo nach einer Verzögerung von 1,5 Sekunden.
 * 
 * @returns {void} - Keine Rückgabe.
 */
function logoMuve() {
    setTimeout(() => {
        document.getElementById('animation').style.display = "none";
        document.getElementById('logo').style.display = "block";
    }, 1500);
}
const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";

document.addEventListener("DOMContentLoaded", function () {
    const logInButton = document.querySelector(".btn_log_in button");
    logInButton.addEventListener("click", logIn);
});

async function logIn() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showToast("Please fill in all fields.", "error");
        return;
    }

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            showToast("Login successful!", "success");
            setTimeout(() => {
                window.location.href = "./summary.html";
            }, 2000);
        } else {
            showToast("Invalid email or password.", "error");
        }
    } catch (error) {
        console.error("Error during login:", error);
        showToast("An error occurred. Please try again later.", "error");
    }
}
// Function to authenticate user
async function authenticateUser(email, password) {
    try {
        const response = await fetch(`${BASE_URL}users.json`);
        if (!response.ok) throw new Error("Failed to fetch users");

        const users = await response.json();
        if (!users) return null;

        // Find the user with matching email and password
        const user = Object.values(users).find(
            (user) => user.email === email && user.password === password
        );
        return user || null;
    } catch (error) {
        console.error("Error authenticating user:", error);
        throw error;
    }
}

// Function to validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to show alert message
function showAlert(message) {
    const alertDiv = document.getElementById("alert");
    alertDiv.textContent = message;
    alertDiv.style.display = "block";
    setTimeout(() => {
        alertDiv.style.display = "none";
    }, 3000);
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