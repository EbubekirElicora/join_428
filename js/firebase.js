
const BASE_URL = "https://join-428-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        if (!response.ok) throw new Error("Error loading data");
        return await response.json();
    } catch (error) {
        console.error("Error in loadData:", error);
        return null;
    }
}

async function postData(path = "", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Error adding data");
        return await response.json();
    } catch (error) {
        console.error("Error in postData:", error);
        return null;
    }
}

async function updateData(path = "", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Error updating data");
        return await response.json();
    } catch (error) {
        console.error("Error in updateData:", error);
        return null;
    }
}

async function deleteData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error deleting data");
        return await response.json();
    } catch (error) {
        console.error("Error in deleteData:", error);
        return null;
    }
}
