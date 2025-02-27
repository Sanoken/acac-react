const API_URL = process.env.REACT_APP_ACAC_API_URL + "/itemdrops";

// Fetch all item drops
export const getItemDrops = async () => {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error("Error fetching item drops:", error);
    return [];
  }
};

// Fetch a single item drop by ID
export const getItemDrop = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching item drop:", error);
    return null;
  }
};

// Create a new item drop
export const createItemdrop = async (itemData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating item drop:", error);
    return null;
  }
};

// Update an existing item drop
export const updateItemdrop = async (id, itemData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating item drop:", error);
    return null;
  }
};

// Delete a item drop
export const deleteItemdrop = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error("Error deleting item drop:", error);
    return false;
  }
};
