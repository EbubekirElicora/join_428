// Function to show/hide mobile navigation
function HeaderMenu() {
    const menu = document.getElementById('mobileMenu');
    const userIcon = document.getElementById('user-initial');
    menu.classList.toggle('active');

    // Add an event listener to close the menu when clicking outside of it
    document.addEventListener('click', function closeClickOutside(event) {
        if (!menu.contains(event.target) && !userIcon.contains(event.target)) {
            menu.classList.remove('active'); // Close the menu if clicked outside
            document.removeEventListener('click', closeClickOutside); // Remove listener once the menu is closed
        }
    });
}


function logout(){
    window.location.href="../html/log_in.html"
}
function pageBack(){
    window.history.back();
}