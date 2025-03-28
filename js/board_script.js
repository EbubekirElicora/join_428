/**
 * Lädt die Kontakte und zeigt sie im Dropdown an.
 * Diese Funktion lädt die Kontaktdaten von einer externen Quelle und zeigt sie im Dropdown-Menü an.
 * Für jeden Kontakt wird ein Kontrollkästchen zum Auswählen angezeigt.
 * Wenn ein Kontakt ausgewählt oder abgewählt wird, wird die Liste der ausgewählten Kontakte aktualisiert.
 * 
 * @async
 * @function loadContacts
 */
async function loadContacts() {
    const dropdownContent = document.getElementById('dropdownContent');
    if (!dropdownContent) {
        console.error('Dropdown content element not found!');
        return;
    }
    const contactsData = await loadData('contacts');
    if (contactsData) {
        const contactsArray = Object.values(contactsData);
        dropdownContent.innerHTML = '';
        contactsArray.forEach(contact => {
            const contactDiv = document.createElement('div');
            contactDiv.classList.add('dropdown-item');
            contactDiv.innerHTML = `
                <div class="contact-info">
                    <div class="contact-initials-container" style="background-color: ${getRandomColor()}">
                        <div class="contact-initials">${getInitials(contact.name)}</div>
                    </div>
                    <span class="contact-name">${contact.name}</span>
                </div>
                <input type="checkbox" class="contact-checkbox">
            `;
            const checkbox = contactDiv.querySelector('.contact-checkbox');
            checkbox.addEventListener('change', (event) => {
                if (checkbox.checked) {
                    contactDiv.classList.add('selected-contact-item');
                    if (!selectedContacts.find(c => c.name === contact.name)) {
                        selectedContacts.push(contact);
                    }
                } else {
                    contactDiv.classList.remove('selected-contact-item');
                    selectedContacts = selectedContacts.filter(c => c.name !== contact.name);
                }
                updateSelectedContacts();
            });
            dropdownContent.appendChild(contactDiv);
        });
    } else {
        dropdownContent.innerHTML = '<div class="dropdown-item">No contacts available</div>';
    }
}

/**
 * Wählt einen Kontakt aus und fügt ihn zur Liste der ausgewählten Kontakte hinzu.
 * Wenn der Kontakt bereits ausgewählt ist, wird keine Änderung vorgenommen.
 * 
 * @param {Object} contact - Der Kontakt, der ausgewählt werden soll.
 * @param {string} contact.name - Der Name des Kontakts.
 * @function selectContact
 */
function selectContact(contact) {
    if (!selectedContacts.find(c => c.name === contact.name)) {
        selectedContacts.push(contact);
        updateSelectedContacts();
        console.log('Contact selected:', contact.name);
    } else {
        console.log('Contact already selected:', contact.name);
    }
   
}

/**
 * Aktualisiert die angezeigten ausgewählten Kontakte im Eingabefeld und im Container für Initialen.
 * Diese Funktion nimmt die Liste der ausgewählten Kontakte, zeigt ihre Namen im Eingabefeld an 
 * und erstellt für jeden Kontakt ein Initialen-Element im Container.
 * 
 * @function updateSelectedContacts
 */
function updateSelectedContacts() {
    const inputField = document.getElementById('contactInput');
    const initialsContainer = document.getElementById('selectedContactsInitials');
    if (!inputField || !initialsContainer) {
        console.error('Input field or initials container not found!');
        return;
    }
    const selectedNames = selectedContacts.map(contact => contact.name).join(', ');
    inputField.value = selectedNames;
    initialsContainer.innerHTML = '';
    selectedContacts.forEach(contact => {
        const span = document.createElement('span');
        span.classList.add('contact-initial');
        span.innerHTML = `
            <div class="contact-initials-container" style="background-color: ${getRandomColor()}">
                <div class="contact-initials">${getInitials(contact.name)}</div>
            </div>
        `;
        initialsContainer.appendChild(span);
    });
}

/**
 * Gibt die Initialen eines Namens zurück.
 * Der Name wird in Wörter aufgeteilt und es werden die ersten Buchstaben jedes Wortes genommen,
 * um die Initialen zu bilden. Die Initialen werden in Großbuchstaben zurückgegeben.
 * 
 * @param {string} name - Der Name, dessen Initialen zurückgegeben werden sollen.
 * @returns {string} - Die Initialen des Namens.
 * @function getInitials
 */
function getInitials(name) {
    if (!name) return ''; // Handle undefined or empty names
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
}

/**
 * Generiert eine zufällige Farbe im Hexadezimalformat.
 * Diese Funktion erstellt eine zufällige Farbe, die aus 6 Zeichen im Hexadezimalformat besteht,
 * und gibt diese als Farbwert zurück.
 * 
 * @returns {string} - Eine zufällige Hex-Farbe (z. B. '#F1A2B3').
 * @function getRandomColor
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}