/**
 * Initialisiert die Anwendung.
 * Ruft die Funktion logoMuve auf, um die Animation zu steuern.
 * 
 * @returns {void} - Keine Rückgabe.
 */
function init () {
    logoMuve();
}

/**
 * Leitet den Benutzer zur Anmeldeseite weiter.
 * 
 * @returns {void} - Keine Rückgabe.
 */
function toSignUp() {
    window.location.href = "./sign_up.html";
}

/**
 * Leitet den Benutzer zur Zusammenfassungsseite weiter, wenn er als Gast einloggt.
 * 
 * @returns {void} - Keine Rückgabe.
 */
function guestLogIn() {
    localStorage.removeItem("userInitials");
    localStorage.removeItem("userName");
    localStorage.setItem("isGuest", "true");
    window.location.href = "../html/summary.html";
}

/**
 * Steuert die Anzeige des Logos nach der Animation.
 * Versteckt die Animation und zeigt das Logo nach einer Verzögerung von 1,5 Sekunden.
 * 
 * @returns {void} - Keine Rückgabe.
 */
function logoMuve() {
    setTimeout(() => {
        document.getElementById('animation').style.display = "none";
        document.getElementById('logo').style.display = "block";
    }, 1500);
}

/**
 * Startet den Login-Prozess und überprüft die Benutzereingaben.
 * @async
 */
async function logIn() {
    let email = getInputValue("email");
    let password = getInputValue("password");
    let alertBox = getAlertBox();
    let emailLabel = document.getElementById("label_input");
    let passwordLabel = document.getElementById("label_password");
    resetErrorStyles(emailLabel, passwordLabel, alertBox);
    if (!email || !password) {
        showError(emailLabel, passwordLabel, alertBox);
        return;
    }
    let users = await fetchUsers(alertBox);
    if (!users) return;
    validateUser(users, email, password, alertBox, emailLabel, passwordLabel);
}

/**
 * Holt den Wert eines Eingabefeldes und entfernt führende und nachfolgende Leerzeichen.
 * @param {string} id - Die ID des Eingabefeldes.
 * @returns {string} Der bereinigte Wert des Eingabefeldes.
 */
function getInputValue(id) {
    return document.getElementById(id).value.trim();
}

/**
 * Holt das Alert-Element.
 * @returns {HTMLElement} Das Alert-Element.
 */
function getAlertBox() {
    return document.getElementById("alert");
}

/**
 * Lädt die Benutzerdaten aus der Datenbank.
 * @async
 * @param {HTMLElement} alertBox - Das Alert-Element zur Anzeige von Fehlern.
 * @returns {Promise<Object|null>} Die Benutzerdaten oder `null`, falls ein Fehler auftritt.
 */
async function fetchUsers(alertBox) {
    let users = await loadData("users");
    if (!users) {
        showAlert(alertBox, "Database error. Please try again later.");
    }
    return users;
}

/**
 * Überprüft, ob die eingegebenen Benutzerdaten korrekt sind.
 * @param {Object} users - Die Liste aller Benutzer.
 * @param {string} email - Die eingegebene E-Mail-Adresse.
 * @param {string} password - Das eingegebene Passwort.
 * @param {HTMLElement} alertBox - Das Alert-Element zur Fehleranzeige.
 * @param {HTMLElement} emailLabel - Das Label für das E-Mail-Eingabefeld.
 * @param {HTMLElement} passwordLabel - Das Label für das Passwort-Eingabefeld.
 */
function validateUser(users, email, password, alertBox, emailLabel, passwordLabel) {
    let user = Object.values(users).find(u => u.email === email && u.password === password);
    if (user) {
        saveUserData(user);
        redirectToSummary();
    } else {
        showError(emailLabel, passwordLabel, alertBox);
    }
}

/**
 * Zeigt eine Fehlermeldung an und hebt die Eingabefelder hervor.
 * @param {HTMLElement} emailLabel - Das Label für das E-Mail-Eingabefeld.
 * @param {HTMLElement} passwordLabel - Das Label für das Passwort-Eingabefeld.
 * @param {HTMLElement} alertBox - Das Alert-Element zur Fehleranzeige.
 */
function showError(emailLabel, passwordLabel, alertBox) {
    let errorMessage = "Check your email and password. Please try again.";
    showAlert(alertBox, errorMessage);
    emailLabel.classList.add("label_user_red");
    passwordLabel.classList.add("label_user_red");
}

/**
 * Setzt die Fehlerstile für die Eingabefelder zurück.
 * @param {HTMLElement} emailLabel - Das Label für das E-Mail-Eingabefeld.
 * @param {HTMLElement} passwordLabel - Das Label für das Passwort-Eingabefeld.
 * @param {HTMLElement} alertBox - Das Alert-Element.
 */
function resetErrorStyles(emailLabel, passwordLabel, alertBox) {
    emailLabel.classList.remove("label_user_red");
    passwordLabel.classList.remove("label_user_red");
    alertBox.style.display = "none";
}

/**
 * Speichert die Benutzerdaten im lokalen Speicher.
 * @param {Object} user - Das Benutzerobjekt.
 */
function saveUserData(user) {
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userInitials", getInitials(user.name));
}

/**
 * Leitet den Benutzer zur Übersichtsseite weiter.
 */
function redirectToSummary() {
    window.location.href = "../html/summary.html";
}

/**
 * Zeigt eine Fehlermeldung im Alert-Feld an.
 * @param {HTMLElement} alertBox - Das Alert-Element.
 * @param {string} message - Die anzuzeigende Nachricht.
 */
function showAlert(alertBox, message) {
    alertBox.textContent = message;
    alertBox.style.display = "block";
}

/**
 * Erstellt Initialen aus einem vollständigen Namen.
 * @param {string} name - Der vollständige Name des Benutzers.
 * @returns {string} Die Initialen des Benutzers.
 */
function getInitials(name) {
    let words = name.split(" ");  
    return words[0][0].toUpperCase() + (words[1] ? words[1][0].toUpperCase() : "");
}










