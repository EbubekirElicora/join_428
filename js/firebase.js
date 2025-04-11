/**
 * Base URL for the Firebase database.
 * 
 * @constant {string}
 */
const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Loads data from a given path in the Firebase database.
 * 
 * @param {string} path - The path in the database (e.g., "contacts" or "users").
 * @returns {Promise<Object|null>} Returns the data in JSON format if successful, otherwise null.
 * @function loadData
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
 * Adds data to a given path in the Firebase database.
 * 
 * @param {string} path - The path where the data should be added.
 * @param {Object} data - The data to be stored.
 * @returns {Promise<Object|null>} Returns the added data in JSON format if successful, otherwise null.
 * @function postData
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
 * Updates data at a given path in the Firebase database.
 * 
 * @param {string} path - The path where the data should be updated.
 * @param {Object} data - The data to update.
 * @returns {Promise<Object|null>} Returns the updated data in JSON format if successful, otherwise null.
 * @function updateData
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
 * Deletes data from a given path in the Firebase database.
 * 
 * @param {string} path - The path from which the data should be deleted.
 * @returns {Promise<Object|null>} Returns the result of the delete operation in JSON format if successful, otherwise null.
 * @function deleteData
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
