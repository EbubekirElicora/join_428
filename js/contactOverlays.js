/**
 * OVERLAY MANAGEMENT FUNCTIONS
 */

/**
 * Shows the main overlay with animation
 */
function showOverlay() {
    const overlay = document.getElementById('overlay');
    const addContactCircle = document.querySelector('.add-contact-circle');

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
 * Hides the contact overlay
 */
function hideContactOverlay() {
    const contactOverlay = document.getElementById('contact-overlay');
    if (contactOverlay) {
        contactOverlay.style.display = 'none';
        contactOverlay.classList.remove('active');
    }
}

/**
 * Hides both main overlay and contact overlay
 */
function hideOverlay() {
    const overlay = document.getElementById('overlay');
    const contactOverlay = document.getElementById('contact-overlay');
    
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
}

/**
 * Toggles the mobile edit overlay with button animation
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
 * COLUMN TOGGLE FUNCTIONS
 */

/**
 * Toggles visibility of left and right columns on small screens
 */
function toggleColumns() {
    const leftColumn = document.querySelector('.left-column');
    const rightColumn = document.querySelector('.right-column');

    leftColumn.classList.toggle('hidden');
    rightColumn.classList.toggle('active');
}

/**
 * INPUT VALIDATION
 */

/**
 * Restricts phone input to numbers only
 * @param {Event} event - The input event
 */
function restrictToNumbers(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
}

/**
 * EVENT LISTENERS
 */
document.addEventListener('DOMContentLoaded', function () {
    // Edit link overlay handler
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
            }, 2000);
        });
    }

    // Click outside overlay handler
    document.addEventListener('click', function (event) {
        const overlay = document.getElementById('mobileEditOverlay');
        const threeDotsButton = document.querySelector('.mobileEdit-button img');
        if (overlay && !overlay.contains(event.target) && event.target !== threeDotsButton) {
            overlay.classList.remove('active');
        }
    });

    // Contact item click handler
    const content = document.getElementById('content');
    if (content) {
        content.addEventListener('click', function (event) {
            const contactItem = event.target.closest('.contact-item');
            if (contactItem) {
                document.querySelectorAll('.contact-item').forEach(item => {
                    item.classList.remove('active');
                });
                contactItem.classList.add('active');
                
                if (window.innerWidth <= 1080) {
                    toggleColumns();
                }
            }
        });
    }

    // Cancel button handler
    const cancelButton = document.getElementById('cancel');
    if (cancelButton) {
        cancelButton.addEventListener('click', function (event) {
            event.preventDefault();
            hideOverlay();
        });
    }

    // Phone number input restriction
    const phoneInput = document.getElementById('phone');
    const editPhoneInput = document.getElementById('edit-contact-phone');
    
    if (phoneInput) phoneInput.addEventListener('input', restrictToNumbers);
    if (editPhoneInput) editPhoneInput.addEventListener('input', restrictToNumbers);
});