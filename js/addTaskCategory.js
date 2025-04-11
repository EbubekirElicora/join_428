/**
 * Opens the category dropdown and populates it with options if it's not already open.
 * If the dropdown is already open, it closes the dropdown.
 * 
 * This function checks if the task category is already selected, and if not, resets the category selector.
 * It also listens for clicks outside the dropdown to close it when clicked elsewhere.
 * 
 * @returns {void} 
 */
// function to_open_category_dropdown() {
//     let elements = getCategoryElements();
//     if (elements.category_dropdown.classList.contains('show')) {
//         closeCategoryDropdown(elements);
//         return;
//     }
//     elements.category_dropdown.innerHTML = '';
//     addCategoryOptions(elements.category_dropdown);
//     toggleCategoryDropdown(elements);
//     function closeDropdown(event) {
//         if (!elements.category_select.contains(event.target) && !elements.category_dropdown.contains(event.target)) {
//             closeCategoryDropdown(elements);
//             document.removeEventListener('click', closeDropdown);
//         }
//     }
//     document.addEventListener('click', closeDropdown);
//     elements.category_select.addEventListener('click', function (event) {
//         event.stopPropagation();
//     });
// }

function to_open_category_dropdown() {
    let elements = getCategoryElements();
    if (elements.category_dropdown.classList.contains('show')) {
        closeCategoryDropdown(elements);
        return;
    }
    prepareCategoryDropdown(elements);
    addClickListenerForClosing(elements);
}

function prepareCategoryDropdown(elements) {
    elements.category_dropdown.innerHTML = '';
    addCategoryOptions(elements.category_dropdown);
    toggleCategoryDropdown(elements);
}

function addClickListenerForClosing(elements) {
    function closeDropdown(event) {
        if (!elements.category_select.contains(event.target) && !elements.category_dropdown.contains(event.target)) {
            closeCategoryDropdown(elements);
            document.removeEventListener('click', closeDropdown);
        }
    }
    document.addEventListener('click', closeDropdown);
    elements.category_select.addEventListener('click', event => event.stopPropagation());
}


/**
 * This function initializes the category selector with event listeners
 * 
 */
function initializeCategorySelector() {
    let category_select = document.getElementById('category_select');
    category_select.addEventListener('click', function (event) {
        let selected_category = document.getElementById('select_txt');
        if (selected_category && selected_category.textContent !== 'Select task category') {
            event.stopPropagation();
            resetCategorySelector();
        }
    });
}

/**
 * This function retrieves the necessary DOM elements for the category dropdown
 * 
 *@returns {Object} An object containing references to the category-related DOM elements
 */
function getCategoryElements() {
    return {
        category_select: document.getElementById('category_select'),
        category_dropdown: document.getElementById('category_dropdown'),
        drop_down_image: document.getElementById('drop_down_img_category'),
        selected_txt: document.getElementById('select_txt')
    };
}

/**
 * This function sets up event listeners for the category dropdown
 * 
 * @param {Object} elements - The object containing references to category-related DOM elements 
 */
function setupCategoryEventListeners(elements) {
    elements.category_select.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleCategoryDropdown(elements);
    });
}

/**
 * This function toggles the visibility of the category dropdown
 * 
 * @param {Object} elements - The object containing references to category-related DOM elements
 */
function toggleCategoryDropdown(elements) {
    let isOpen = elements.category_dropdown.classList.toggle('show');
    elements.drop_down_image.classList.toggle('rotate180', isOpen);
}

/**
 * This function toggles the rotation of the dropdown image
 * 
 */
function toggleRotationDownImage() {
    let down_image = document.getElementById('drop_down_img_category');
    down_image.classList.add('rotate180');
}

/**
 * This function selects a category and updates the UI
 * 
 * @param {string} category - The selected category 
 * @param {Object} elements - The object containing references to category-related DOM elements
 */
function selectCategory(category, elements) {
    elements.selected_txt.textContent = category;
    let errorMessage = document.querySelector('.category_container .errorMessage');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
    elements.category_select.classList.remove('inputError');
    closeCategoryDropdown(elements);
}

/**
 * This function closes the category dropdown
 * 
 * @param {Object} elements - The object containing references to category-related DOM elements
 */
function closeCategoryDropdown(elements) {
    elements.category_dropdown.classList.remove('show');
    elements.drop_down_image.classList.remove('rotate180');
}

/**
 * This function adds category options to the dropdown
 * 
 * @param {HTMLElement} category_dropdown - The dropdown element to populate with options 
 */
function addCategoryOptions(category_dropdown) {
    const categories = ['Technical Task', 'User Story'];
    categories.forEach(category => {
        let category_item = document.createElement('div');
        category_item.className = 'select_category';
        category_item.textContent = category;
        category_item.addEventListener('click', function (event) {
            event.stopPropagation();
            selectCategory(category, getCategoryElements()); // Hier wird die Funktion aufgerufen!
        });
        category_dropdown.appendChild(category_item);
    });
}

/**
 * This function resets the category selector to its default state
 * 
 */
function resetCategorySelector() {
    let selected_txt = document.getElementById('select_txt');
    selected_txt.textContent = 'Select task category';
    let category_dropdown = document.getElementById('category_dropdown');
    category_dropdown.classList.add('show');
    let drop_down_image = document.getElementById('drop_down_img_category');
    drop_down_image.classList.add('rotate180');
}
document.addEventListener('DOMContentLoaded', function () {
    if (typeof initializeCategorySelector === 'function') {
        initializeCategorySelector();
    }
});
