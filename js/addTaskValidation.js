/**
* This function validates the title field
* 
*/
function validateTitleField() {
    let errorMessage = this.nextElementSibling;
    if (!this.value) {
        this.classList.add('inputError');
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'This field is required';
    } else {
        this.classList.remove('inputError');
        errorMessage.style.display = 'none';
    }
}

/**
* This function sets up validation for the date field
* 
*/
function fieldRequiredDate() {
    let dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.onchange = updateDateColor;
        dateInput.onfocus = validateDateField;
        dateInput.oninput = validateDateField;
        dateInput.onblur = validateDateField;
        updateDateColor.call(dateInput);
        validateDateField.call(dateInput);
    }
}

/**
/ This function sets up validation for the title field
* 
*/
function fieldRequiredTitle() {
    let titleInput = document.getElementById('title');
    if (titleInput) {
        titleInput.onfocus = validateTitleField;
        titleInput.oninput = validateTitleField;
        titleInput.onblur = validateTitleField;
        validateTitleField.call(titleInput);
    }
}

/**
 * This function validates the title field
 * 
 */
function validateDateField() {
    let errorMessage = this.nextElementSibling;
    if (!this.value) {
        this.classList.add('inputError');
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'This field is required';
    } else {
        this.classList.remove('inputError');
        errorMessage.style.display = 'none';
    }
}

/**
 * - This function sets up validation for the category field
 * 
 */
function fieldRequiredCategory() {
    let categorySelector = document.getElementById('category_select');
    let selectedText = document.getElementById('select_txt');
    let errorMessage = document.querySelector('.category_container .errorMessage');
    if (!selectedText || !errorMessage) return;
    if (selectedText.textContent === 'Select task category') {
        categorySelector.classList.add('inputError');
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'This field is required';
    } else {
        categorySelector.classList.remove('inputError');
        errorMessage.style.display = 'none';
    }
}

/**
 * This function validates the task form inputs
 * 
 * @param {string} title - The task title
 * @param {string} dueDate - The task due date 
 * @param {string} category - The task category
 * @returns {boolean} True if the form is valid, false otherwise
 */
function validateTaskForm(title, dueDate, category) {
    let isValid = true;
    if (!title) {
        fieldRequiredTitle();
        isValid = false;
    }
    if (!dueDate) {
        fieldRequiredDate();
        isValid = false;
    }
    if (category === 'Select task category') {
        fieldRequiredCategory();
        isValid = false;
    }
    return isValid;
}

/**
 * This function validates the category field
 * 
 */
function validateCategoryField() {
    let selectedText = document.getElementById('select_txt');
    let errorMessage = document.querySelector('.category_container .errorMessage');
    if (selectedText.textContent === 'Select task category') {
        this.classList.add('inputError');
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'This field is required';
        }
    } else {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }
}

