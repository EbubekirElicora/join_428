/**
 * This function sets the date input to today's date
 * 
 */
function getDateToday() {
    let dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
        dateInput.onclick = function () {
            if (this.value === "yyyy-mm-dd") {
                this.value = new Date().toISOString().split('T')[0];
            }
            updateDateColor.call(this);
        };
        dateInput.onchange = function () {
            validateDate(this);
            updateDateColor.call(this);
        };
    }
}

/**
 * This function validates the selected date
 * 
 * @param {HTMLInputElement} input - The date input element
 */
function validateDate(input) {
    let selectedDate = new Date(input.value);
    let currentDate = new Date();
    let maxYear = 2999;
    if (selectedDate < currentDate) {
        input.value = currentDate.toISOString().split('T')[0];
    } else if (selectedDate.getFullYear() > maxYear) {
        input.value = `${maxYear}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
    }
}


/**
 * This function updates the color of the date input
 * 
 */
function updateDateColor() {
    this.style.color = this.value && this.value !== "yyyy-mm-dd" ? 'black' : '#D1D1D1';
}
