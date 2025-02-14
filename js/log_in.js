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
    window.location.href = "./summary.html";
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
