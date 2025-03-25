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
    }
}

/**
 * This function updates the color of the date input
 * 
 */
function updateDateColor() {
    this.style.color = this.value && this.value !== "yyyy-mm-dd" ? 'black' : '#D1D1D1';
}
