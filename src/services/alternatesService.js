const API_URL = process.env.REACT_APP_ACAC_API_URL + "/alternates";

// Fetch all alternates
export const getAlternates = async () => {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error("Error fetching alternates:", error);
    return [];
  }
};

// Fetch a single alternate  by ID
export const getAlternate = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching alternate:", error);
    return null;
  }
};

// Create a new alternate
export const createAlternate = async (userData) => {
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
    console.error("Error creating alternate:", error);
    return null;
  }
};

// Update an existing alternate
export const updateAlternate = async (id, userData) => {
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
    console.error("Error updating alternate:", error);
    return null;
  }
};

// Delete a user
export const deleteAlternate = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error("Error deleting Alternate:", error);
    return false;
  }
};
