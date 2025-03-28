/**
 * Displays the overlay and adds a backdrop element to the body.
 * 
 * This function creates a backdrop that covers the screen, then shows 
 * the overlay and makes it visible with a smooth transition. It also adds
 * a 'clicked' class to the add contact circle button to indicate it's been pressed.
 */
function showOverlay() {
    const overlay = document.getElementById('overlay');
    const addContactCircle = document.querySelector('.add-contact-circle');
    const backdrop = document.createElement('div');
    backdrop.id = 'overlay-backdrop';
    backdrop.className = 'overlay-backdrop';
    backdrop.onclick = hideOverlay;
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
 * Creates and returns a backdrop element that covers the screen.
 * 
 * This function creates a new backdrop element, attaches it to the body, 
 * and sets up an event listener for clicking to hide the overlay.
 * 
 * @returns {HTMLElement} The created backdrop element.
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
 * Hides the contact overlay and removes the backdrop from the page.
 * 
 * This function hides the contact overlay by setting its display style to 'none' 
 * and removing its active class. It also removes the backdrop from the DOM.
 */
function hideContactOverlay() {
    const contactOverlay = document.getElementById('contact-overlay');
    const backdrop = document.getElementById('overlay-backdrop');
    if (contactOverlay) {
        contactOverlay.style.display = 'none';
        contactOverlay.classList.remove('active');
    }
    if (backdrop) {
        backdrop.remove();
    }
}

/**
 * Hides the overlay and contact overlay, and removes the backdrop from the page.
 * 
 * This function hides both the general overlay and the contact overlay if they are visible, 
 * and removes the backdrop element from the DOM. It also checks for any visible overlay
 * and hides it with a smooth transition.
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
 * Handles the edit link click, displays the contact overlay with a smooth transition.
 * 
 * This function listens for a click event on the edit link, preventing the default
 * behavior and then activating the contact overlay with a smooth transition.
 * 
 * @param {Event} e - The event object for the click event.
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
 * Closes the mobile edit overlay if clicked outside of it.
 * 
 * This function listens for a click event and closes the mobile edit overlay
 * if the user clicks outside the overlay or on a specific button.
 * 
 * @param {Event} event - The event object for the click event.
 */
document.addEventListener('click', function (event) {
    const overlay = document.getElementById('mobileEditOverlay');
    const threeDotsButton = document.querySelector('.mobileEdit-button img');
    if (!overlay.contains(event.target) && event.target !== threeDotsButton) {
        overlay.classList.remove('active');
    }
});

/**
 * Hides the contact overlay by setting its display style to 'none' and removing the 'active' class.
 * 
 * This function is used to hide the contact overlay when the user interacts with the page in such 
 * a way that the overlay should no longer be visible (e.g., clicking outside of the overlay).
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
     * Listens for click events and hides specific overlays if the user clicks outside of them.
     * 
     * This event listener is added to the document and checks whether the user clicks outside any 
     * of the overlays on the page (the general overlay, the contact overlay, or the mobile edit overlay). 
     * If the user clicks outside any of these, the corresponding overlay will be hidden.
     * 
     * @param {Event} event - The event object representing the click event.
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
 * Toggles the visibility of columns on smaller screen sizes.
 * 
 * This function toggles the visibility of the left and right columns based on the screen width. 
 * On smaller screens (<= 1080px), it hides the left column and shows the right column, making 
 * the right column active.
 * 
 * @param {Event} event - The event object for the click event.
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
 * Toggles the active state of the mobile edit overlay.
 * 
 * This function toggles the visibility of the mobile edit overlay and also changes the background 
 * color of the mobile edit button for a short period of time when the overlay is activated.
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
 * Toggles the visibility and layout of the left and right columns.
 * 
 * This function toggles the visibility of the left and right columns depending on the screen size.
 * It also adjusts the display of the mobile edit button. On small screens, the button is displayed 
 * when the right column is active, and hidden when the right column is not active.
 */
function toggleColumns() {
    const leftColumn = document.querySelector('.left-column');
    const rightColumn = document.querySelector('.right-column');
    const mobileEditButton = document.querySelector('.mobileEdit-button');
    leftColumn.classList.toggle('hidden');
    rightColumn.classList.toggle('active');

    if (window.innerWidth <= 1080) {
        if (rightColumn.classList.contains('active')) {
            rightColumn.appendChild(mobileEditButton);
            mobileEditButton.style.display = 'flex';
        } else {
            mobileEditButton.style.display = 'none';
        }
    } else {
        mobileEditButton.style.display = 'none';
    }
}

window.addEventListener('resize', () => {
    const mobileEditButton = document.querySelector('.mobileEdit-button');
    if (window.innerWidth > 1080) {
        mobileEditButton.style.display = 'none';
    }
});
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
 * Listens for the 'DOMContentLoaded' event and sets up a click event listener on the cancel button.
 * When the cancel button is clicked, it prevents the default action and hides the overlay.
 * 
 * This function is executed when the document is fully loaded and ensures that the cancel button 
 * correctly hides the overlay when clicked.
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

/**
 * Listens for the 'DOMContentLoaded' event and sets up input event listeners for phone number fields.
 * The event listeners are used to restrict the input to numeric values only for both the add and 
 * edit phone number fields.
 * 
 * This function is executed when the document is fully loaded, ensuring that any phone number inputs
 * only accept numeric values.
 */
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
 * Restricts the input value to numbers only. Any non-numeric characters will be removed.
 * 
 * This function is called whenever the user types into a phone number input field. It removes any 
 * character that is not a number using a regular expression.
 * 
 * @param {Event} event - The input event triggered by the user typing into the input field.
 */
function restrictToNumbers(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
}

