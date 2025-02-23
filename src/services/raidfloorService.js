const API_URL = process.env.REACT_APP_ACAC_API_URL + "/raidfloors";

// Fetch all raid floors
export const getRaidfloors = async () => {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error("Error fetching raid floors:", error);
    return [];
  }
};

// Fetch a single raid floor by ID
export const getRaidfloor = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching raid floor:", error);
    return null;
  }
};

// Create a new raid floor
export const createRaidfloor = async (userData) => {
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
    console.error("Error creating raid floor:", error);
    return null;
  }
};

// Update an existing raid floor
export const updateRaidfloor = async (id, userData) => {
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
    console.error("Error updating raid floor:", error);
    return null;
  }
};

// Delete a user
export const deleteRaidfloor = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error("Error deleting raid floor:", error);
    return false;
  }
};
