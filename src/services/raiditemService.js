const API_URL = process.env.REACT_APP_ACAC_API_URL + "/raiditems";

// Fetch all raid items
export const getRaiditems = async () => {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error("Error fetching raid items:", error);
    return [];
  }
};

// Fetch a single raid item by ID
export const getRaiditem = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching raid item:", error);
    return null;
  }
};

// Create a new raid item
export const createRaiditem = async (userData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating raid item:", error);
    return null;
  }
};

// Update an existing raid item
export const updateRaiditem = async (id, userData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating raid item:", error);
    return null;
  }
};

// Delete a user
export const deleteRaiditem = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error("Error deleting raid item:", error);
    return false;
  }
};
