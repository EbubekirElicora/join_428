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
    // Clear any previous user data
    localStorage.removeItem("userInitials");
    localStorage.removeItem("userName");

    // Set the user as a guest
    localStorage.setItem("isGuest", "true");

    // Redirect to the summary page
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
async function logIn(event) {
    event.preventDefault(); // Prevent default form submission
    console.log("Log in function called"); // Debugging

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showToast("Please fill in all fields.", "error");
        return;
    }

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            const initials = getInitials(user.name);
            localStorage.setItem("userInitials", initials);
            localStorage.setItem("userName", user.name);
            localStorage.removeItem("isGuest"); // Clear the isGuest flag
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
function getInitials(name) {
    return name
        .split(" ") // Split the name into an array of words
        .map((word) => word[0]) // Get the first letter of each word
        .join("") // Join the letters into a single string
        .toUpperCase(); // Convert to uppercase
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
    toast.className = `toast toast-${type}`; // Add the type class (e.g., toast-success)
    toast.innerText = message;
    document.body.appendChild(toast);

    // Trigger reflow to apply the initial styles
    toast.offsetHeight;

    // Slide the toast in
    toast.style.bottom = "20px"; // Move it up to 20px from the bottom

    // Slide the toast out after 2.5 seconds
    setTimeout(() => {
        toast.style.bottom = "-100px"; // Move it back off-screen

        // Remove the toast from the DOM after the slide-out animation completes
        setTimeout(() => {
            toast.remove();
        }, 500); // Match this duration with the CSS transition duration
    }, 2500);
}
function togglePasswordVisibility(inputId, toggleIconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(toggleIconId);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.src = '/Assets/visibility.svg'; // Show password icon
    } else {
        passwordInput.type = 'password';
        toggleIcon.src = '/Assets/visibility_off - Copy.svg'; // Hide password icon
    }
}