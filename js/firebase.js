/**
 * Basis-URL für die Firebase-Datenbank.
 */
const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Lädt Daten von einem angegebenen Pfad aus der Firebase-Datenbank.
 * 
 * @param {string} path - Der Pfad in der Datenbank (z.B. "contacts" oder "users").
 * @returns {Object|null} - Gibt die Daten im JSON-Format zurück, wenn der Abruf erfolgreich ist. Andernfalls wird null zurückgegeben.
 */
async function loadData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        if (!response.ok) throw new Error("Fehler beim Laden der Daten");
        return await response.json();
    } catch (error) {
        console.error("Fehler in loadData:", error);
        return null;
    }
}

/**
 * Fügt Daten zu einem angegebenen Pfad in der Firebase-Datenbank hinzu.
 * 
 * @param {string} path - Der Pfad, an dem die Daten hinzugefügt werden sollen.
 * @param {Object} data - Die zu speichernden Daten.
 * @returns {Object|null} - Gibt die hinzugefügten Daten im JSON-Format zurück, wenn erfolgreich. Andernfalls wird null zurückgegeben.
 */
async function postData(path = "", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Fehler beim Hinzufügen der Daten");
        return await response.json();
    } catch (error) {
        console.error("Fehler in postData:", error);
        return null;
    }
}

/**
 * Aktualisiert Daten an einem angegebenen Pfad in der Firebase-Datenbank.
 * 
 * @param {string} path - Der Pfad, an dem die Daten aktualisiert werden sollen.
 * @param {Object} data - Die zu aktualisierenden Daten.
 * @returns {Object|null} - Gibt die aktualisierten Daten im JSON-Format zurück, wenn erfolgreich. Andernfalls wird null zurückgegeben.
 */
async function updateData(path = "", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Fehler beim Aktualisieren der Daten");
        return await response.json();
    } catch (error) {
        console.error("Fehler in updateData:", error);
        return null;
    }
}

/**
 * Löscht Daten von einem angegebenen Pfad in der Firebase-Datenbank.
 * 
 * @param {string} path - Der Pfad, von dem die Daten gelöscht werden sollen.
 * @returns {Object|null} - Gibt das Ergebnis des Löschvorgangs im JSON-Format zurück, wenn erfolgreich. Andernfalls wird null zurückgegeben.
 */
async function deleteData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Fehler beim Löschen der Daten");
        return await response.json();
    } catch (error) {
        console.error("Fehler in deleteData:", error);
        return null;
    }
}
