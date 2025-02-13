// Function to show the overlay
function showOverlay() {
    let overlay = document.getElementById('overlay');
    overlay.classList.add('active'); // Add the 'active' class
}

// Function to hide the overlay
function hideOverlay() {
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('active'); // Remove the 'active' class
}