/**
 * Displays the overlay by creating the backdrop,
 * highlighting the "add" button, and activating the overlay panel.
 */
function showOverlay() {
    createOverlayBackdrop();
    highlightAddButton();
    activateAddOverlay();
}

/**
 * Creates and displays the semi-transparent backdrop behind the overlay.
 * Adds an event listener to hide the overlay when the backdrop is clicked.
 */
function createOverlayBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.id = 'overlay-backdrop';
    backdrop.className = 'overlay-backdrop';
    backdrop.onclick = hideOverlay;
    document.body.appendChild(backdrop);
    backdrop.style.display = 'block';
}

/**
 * Highlights the "add" button visually by adding the 'clicked' class.
 * This may trigger a CSS animation or styling effect.
 */
function highlightAddButton() {
    const addBtn = document.querySelector('.add-contact-circle');
    if (addBtn) addBtn.classList.add('clicked');
}

/**
 * Activates and displays the main overlay panel after a short delay.
 * The delay ensures any transition effects can be properly applied.
 */
function activateAddOverlay() {
    const overlay = document.getElementById('overlay');
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
    const backdrop = document.getElementById('overlay-backdrop');
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
// document.addEventListener('DOMContentLoaded', function () {
//     function hideContactOverlay() {
//         const contactOverlay = document.getElementById('contact-overlay');
//         if (contactOverlay) {
//             contactOverlay.style.display = 'none';
//             contactOverlay.classList.remove('active');
//         }
//     }
//     document.addEventListener('click', function (event) {
//         const overlay = document.getElementById('overlay');
//         const contactOverlay = document.getElementById('contact-overlay');
//         const mobileEditOverlay = document.getElementById('mobileEditOverlay');
//         if (overlay && overlay.style.display === 'block' && !overlay.contains(event.target)) {
//             hideOverlay();
//         }
//         if (contactOverlay && contactOverlay.style.display === 'block' && !contactOverlay.contains(event.target)) {
//             hideContactOverlay();
//         }
//         if (
//             mobileEditOverlay &&
//             !mobileEditOverlay.contains(event.target) &&
//             !event.target.closest('.mobileEdit-button')
//         ) {
//             mobileEditOverlay.classList.remove('active');
//         }
//     });
// });

document.addEventListener('DOMContentLoaded', function () {
    function hideContactOverlay() {
        const contactOverlay = document.getElementById('contact-overlay');
        if (contactOverlay) {
            contactOverlay.style.display = 'none';
            contactOverlay.classList.remove('active');
        }
    }

    function handleOverlayClick(event) {
        const overlay = document.getElementById('overlay');
        if (overlay && overlay.style.display === 'block' && !overlay.contains(event.target)) {
            hideOverlay();
        }
    }

    function handleContactOverlayClick(event) {
        const contactOverlay = document.getElementById('contact-overlay');
        if (contactOverlay && contactOverlay.style.display === 'block' && !contactOverlay.contains(event.target)) {
            hideContactOverlay();
        }
    }

    function handleMobileEditClick(event) {
        const mobileEditOverlay = document.getElementById('mobileEditOverlay');
        if (mobileEditOverlay && !mobileEditOverlay.contains(event.target) && !event.target.closest('.mobileEdit-button')) {
            mobileEditOverlay.classList.remove('active');
        }
    }

    document.addEventListener('click', function (event) {
        handleOverlayClick(event);
        handleContactOverlayClick(event);
        handleMobileEditClick(event);
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
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        const container = input.closest('.input-container, .contact-input-container');
        container.classList.remove('error');
        container.querySelector('.error-message').textContent = '';
    });
    window.openEditOverlay = openEditOverlay;

});

/**
 * Opens the contact edit overlay and initializes it with the provided contact data.
 *
 * @param {Object} contact - The contact object containing details to pre-fill the overlay.
 */
window.openEditOverlay = function (contact) {
    prepareOverlayBackdrop();
    fillOverlayFields(contact);
    activateOverlay(contact);
    setOverlayEventHandlers(contact);
};

/**
 * Creates and displays a semi-transparent backdrop behind the overlay.
 * Clicking the backdrop will trigger hiding the overlay.
 */
function prepareOverlayBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.id = 'overlay-backdrop';
    backdrop.className = 'overlay-backdrop';
    backdrop.onclick = hideOverlay;
    document.body.appendChild(backdrop);
    backdrop.style.display = 'block';
}

/**
 * Fills the overlay fields with the contact's existing information.
 *
 * @param {Object} contact - The contact object containing initials, name, email, phone, and color.
 */
function fillOverlayFields(contact) {
    const initials = document.getElementById('contact-initials-overlay');
    const name = document.getElementById('edit-contact-name');
    const email = document.getElementById('edit-contact-email');
    const phone = document.getElementById('edit-contact-phone');
    if (initials) {
        initials.textContent = contact.initials;
        initials.style.backgroundColor = contact.color;
    }
    if (name) name.value = contact.name;
    if (email) email.value = contact.email;
    if (phone) phone.value = contact.phone;
}

/**
 * Activates and displays the contact overlay with a short delay.
 * Temporarily adds and removes an "active" class on the edit link for visual effect.
 *
 * @param {Object} contact - The contact being edited (not directly used here but passed for context).
 */
function activateOverlay(contact) {
    const overlay = document.getElementById('contact-overlay');
    const editLink = document.getElementById('editLinkOverlay');
    if (editLink) editLink.classList.add('active');
    setTimeout(() => {
        if (overlay) {
            overlay.style.display = 'block';
            overlay.classList.add('active');
        }
        if (editLink) editLink.classList.remove('active');
    }, 100);
}

/**
 * Assigns click event handlers for saving or deleting the contact.
 *
 * @param {Object} contact - The contact object passed to the event handlers.
 */
function setOverlayEventHandlers(contact) {
    const saveBtn = document.getElementById('save-contact-button');
    const deleteBtn = document.getElementById('delete-contact-button');
    if (saveBtn) saveBtn.onclick = () => window.saveEditedContact(contact);
    if (deleteBtn) deleteBtn.onclick = () => window.deleteContact(contact);
}
