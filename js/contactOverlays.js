/**
 * Displays an overlay and a backdrop when called.
 * 
 * - Creates a backdrop element that covers the screen.
 * - Adds a click event to the backdrop to close the overlay.
 * - Highlights the "add contact" button if present.
 * - Displays the overlay with a slight delay for animation effects.
 */
function showOverlay() {
    const overlay = document.getElementById('overlay');
    const addContactCircle = document.querySelector('.add-contact-circle');
    
    // Create and show backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'overlay-backdrop';
    backdrop.className = 'overlay-backdrop';
    backdrop.onclick = hideOverlay; // Close when clicking backdrop
    document.body.appendChild(backdrop);
    backdrop.style.display = 'block';

    if (addContactCircle) {
        addContactCircle.classList.add('clicked');
    }

    setTimeout(() => {
        if (overlay) {
            overlay.style.display = 'block';
            overlay.classList.add('active');
        }
    }, 200);
}

/**
 * Creates and appends a backdrop element to the document body.
 * 
 * - The backdrop is given an ID and a CSS class for styling.
 * - It is assigned an `onclick` event to hide the overlay when clicked.
 * - The backdrop is returned for further manipulation if needed.
 * 
 * @returns {HTMLDivElement} The created backdrop element.
 */
function createBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.id = 'overlay-backdrop';
    backdrop.className = 'overlay-backdrop';
    backdrop.onclick = hideOverlay;
    document.body.appendChild(backdrop);
    return backdrop;
}

/**
 * Hides the contact overlay and removes the backdrop.
 * 
 * - Hides the overlay by setting its display to 'none' and removing the 'active' class.
 * - Removes the backdrop element from the DOM if it exists.
 */
function hideContactOverlay() {
    const contactOverlay = document.getElementById('contact-overlay');
    const backdrop = document.getElementById('overlay-backdrop');
    
    if (contactOverlay) {
        contactOverlay.style.display = 'none';
        contactOverlay.classList.remove('active');
    }
    
    // Add this to remove the backdrop
    if (backdrop) {
        backdrop.remove();
    }
}

/**
 * Hides the main overlay, the contact overlay, and removes the backdrop.
 * 
 * - Checks if the main overlay or contact overlay is visible and hides them.
 * - Removes the 'active' class from hidden elements.
 * - Ensures the backdrop is removed from the DOM if it exists.
 */
function hideOverlay() {
    const overlay = document.getElementById('overlay');
    const contactOverlay = document.getElementById('contact-overlay');
    const backdrop = document.getElementById('overlay-backdrop'); // Add this line
    
    function hideElement(overlayElement) {
        if (overlayElement) {
            overlayElement.style.display = 'none'; 
            overlayElement.classList.remove('active'); 
        }
    }    
    
    if (overlay && overlay.style.display === 'block') {
        hideElement(overlay);
    }
    if (contactOverlay && contactOverlay.style.display === 'block') {
        hideElement(contactOverlay);
    }
    
    // Only add this backdrop removal part:
    if (backdrop) {
        backdrop.remove();
    }
}

/**
 * Adds a click event listener to the edit link to display the contact overlay.
 * 
 * - Prevents the default action of the link.
 * - Adds an 'active' class to the edit link for styling.
 * - After a short delay, displays the contact overlay and adds an 'active' class.
 */
const editLink = document.getElementById('editLinkOverlay');
if (editLink) {
    editLink.addEventListener('click', function (e) {
        e.preventDefault();
        editLink.classList.add('active');
        setTimeout(() => {
            const contactOverlay = document.getElementById('contact-overlay');
            if (contactOverlay) {
                contactOverlay.style.display = 'block';
                contactOverlay.classList.add('active');
            }
        }, 10);
    });
}

/**
 * Hides the mobile edit overlay when clicking outside of it.
 * 
 * - Listens for click events on the entire document.
 * - Checks if the click target is outside the overlay and not the three-dots button.
 * - If the click is outside, the 'active' class is removed from the overlay.
 */
document.addEventListener('click', function (event) {
    const overlay = document.getElementById('mobileEditOverlay');
    const threeDotsButton = document.querySelector('.mobileEdit-button img');
    if (!overlay.contains(event.target) && event.target !== threeDotsButton) {
        overlay.classList.remove('active');
    }
});

/**
 * Waits for the DOM to fully load, then defines a function to hide the contact overlay.
 * 
 * - `hideContactOverlay` hides the contact overlay if it exists.
 * - Removes the 'active' class and sets `display` to 'none'.
 */
document.addEventListener('DOMContentLoaded', function () {
    function hideContactOverlay() {
        const contactOverlay = document.getElementById('contact-overlay');
        if (contactOverlay) {
            contactOverlay.style.display = 'none';
            contactOverlay.classList.remove('active');
        } 
    }

    /**
     * Handles clicks outside overlays to close them.
     * 
     * @param {Event} event - The click event.
     */
    document.addEventListener('click', function (event) {
        const overlay = document.getElementById('overlay');
        const contactOverlay = document.getElementById('contact-overlay');
        const mobileEditOverlay = document.getElementById('mobileEditOverlay');
        if (overlay && overlay.style.display === 'block' && !overlay.contains(event.target)) {
            hideOverlay();
        }
        if (contactOverlay && contactOverlay.style.display === 'block' && !contactOverlay.contains(event.target)) {
            hideContactOverlay();
        }
        if (
            mobileEditOverlay &&
            !mobileEditOverlay.contains(event.target) &&
            !event.target.closest('.mobileEdit-button')
        ) {
            mobileEditOverlay.classList.remove('active');
        }
    });
});

/**
 * Toggles the visibility of the left and right columns based on screen width.
 * 
 * - If the viewport width is 1080px or smaller, toggles the 'hidden' class on the left column
 *   and the 'active' class on the right column.
 * - Listens for clicks on elements inside `#content` and triggers `toggleColumns`
 *   if the clicked element is a `.contact-item`.
 */
document.addEventListener('DOMContentLoaded', function () {    
    function toggleColumns() {
        const leftColumn = document.querySelector('.left-column');
        const rightColumn = document.querySelector('.right-column');

        if (window.innerWidth <= 1080) {
            leftColumn.classList.toggle('hidden');
            rightColumn.classList.toggle('active');
        }
    }

    const content = document.getElementById('content');
    if (content) {
        content.addEventListener('click', function (event) {
            if (event.target.closest('.contact-item')) {
                toggleColumns();
            }
        });
    } 
});

/**
 * Toggles the visibility of the mobile edit overlay and briefly changes the button's background color.
 * 
 * - Adds or removes the 'active' class from the `mobileEditOverlay` element.
 * - Changes the background color of the `mobileEditButton` to indicate activation.
 * - Resets the button's background color after 300 milliseconds.
 */
function toggleOverlay() {
    const mobileEditOverlay = document.getElementById('mobileEditOverlay');
    const mobileEditButton = document.querySelector('.mobileEdit-button');

    if (mobileEditOverlay) {
        mobileEditButton.style.backgroundColor = '#3498db';
        mobileEditOverlay.classList.toggle('active');
        setTimeout(() => {
            mobileEditButton.style.backgroundColor = '';
        }, 300);
    }
}

/**
 * Toggles visibility of the left and right columns.
 * Adds/removes the 'hidden' class to the left column and the 'active' class to the right column.
 */
function toggleColumns() {
    const leftColumn = document.querySelector('.left-column');
    const rightColumn = document.querySelector('.right-column'); 

    leftColumn.classList.toggle('hidden');
    rightColumn.classList.toggle('active');
}
/**
     * Handles click events on contact items in the content area.
     * Adds the 'active' class to the clicked contact item and removes it from others.
     * 
     * @param {Event} event - The click event.
     */
document.addEventListener('DOMContentLoaded', function () {
    const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";
    
    document.getElementById('content').addEventListener('click', function (event) {
        const contactItem = event.target.closest('.contact-item');
        if (contactItem) {
            document.querySelectorAll('.contact-item').forEach(item => {
                item.classList.remove('active');
            });
            contactItem.classList.add('active');
            
        }
    });
});


/**
 * Adds an event listener to the cancel button to hide the overlay when clicked.
 * 
 * - Waits for the DOM to be fully loaded before executing.
 * - Listens for a click on the element with ID `cancel`.
 * - Prevents the default button behavior.
 * - Calls `hideOverlay()` to close the overlay.
 */
document.addEventListener('DOMContentLoaded', function () {
    const cancelButton = document.getElementById('cancel');
    if (cancelButton) {
        cancelButton.addEventListener('click', function (event) {
            event.preventDefault();
            hideOverlay();
        });
    } 
});

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // ... your existing code ...
    
    // Restrict phone input to numbers only
    const phoneInput = document.getElementById('phone');
    const editPhoneInput = document.getElementById('edit-contact-phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', restrictToNumbers);
    }
    
    if (editPhoneInput) {
        editPhoneInput.addEventListener('input', restrictToNumbers);
    }
    });

/**
 * Restricts input to only numbers
 * @param {Event} event - The input event
 */
function restrictToNumbers(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
}

/**
 * Sets up the email validation for both the add contact and edit contact forms.
 * 
 * This function listens for input events on the email fields and ensures that the 
 * email contains both "@" and ".", clearing any custom validity messages once 
 * the email is valid.
 */
function showError(inputElement, message) {
    const container = inputElement.closest('.input-container, .contact-input-container');
    const errorElement = container.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.textContent = message;
        container.classList.add('error');
    }
}
// Add input event listeners to clear errors
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        const container = input.closest('.input-container, .contact-input-container');
        container.classList.remove('error');
        container.querySelector('.error-message').textContent = '';
    });
});

