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

function createBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.id = 'overlay-backdrop';
    backdrop.className = 'overlay-backdrop';
    backdrop.onclick = hideOverlay;
    document.body.appendChild(backdrop);
    return backdrop;
}
/**
     * Hides the contact overlay.
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
 * Hides the overlay and contact overlay.
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
 * Adds a click event listener to the edit link to open the contact overlay after a delay.
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

document.addEventListener('click', function (event) {
    const overlay = document.getElementById('mobileEditOverlay');
    const threeDotsButton = document.querySelector('.mobileEdit-button img');
    if (!overlay.contains(event.target) && event.target !== threeDotsButton) {
        overlay.classList.remove('active');
    }
});
document.addEventListener('DOMContentLoaded', function () {
    /**
     * Hides the contact overlay.
     */
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
* Toggles visibility of the left and right columns on small screens.
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
 * Toggles the mobile edit overlay and changes the button color temporarily.
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
// Modify toggleColumns() function
function toggleColumns() {
    const leftColumn = document.querySelector('.left-column');
    const rightColumn = document.querySelector('.right-column');
    const mobileEditButton = document.querySelector('.mobileEdit-button');

    // Toggle column visibility
    leftColumn.classList.toggle('hidden');
    rightColumn.classList.toggle('active');

    // Mobile-specific handling
    if (window.innerWidth <= 1080) {
        if (rightColumn.classList.contains('active')) {
            // Show in right column
            rightColumn.appendChild(mobileEditButton);
            mobileEditButton.style.display = 'flex';
        } else {
            // Hide completely when left column is shown
            mobileEditButton.style.display = 'none';
        }
    } else {
        // Desktop handling
        mobileEditButton.style.display = 'none';
    }
}

// Add resize handler
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
    
    // ... rest of your existing code ...
});

/**
 * Restricts input to only numbers
 * @param {Event} event - The input event
 */
function restrictToNumbers(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
}

