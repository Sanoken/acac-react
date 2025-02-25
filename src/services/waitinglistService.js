const API_URL = process.env.REACT_APP_ACAC_API_URL + "/waitinglists";

// Fetch all waiting lists
export const getWaitinglists = async () => {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Get waiting list by raiditemid
export const getWaitinglist = async (id) => {
  try {
    const response = await fetch(`${API_URL}/raiditem/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

// Create a new waiting list
export const createWaitinglist = async (waitinglistData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(waitinglistData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

// Delete a waiting list entry
export const deleteWaitinglist = async (raiditemid, userid) => {
  try {
    const response = await fetch(`${API_URL}/${raiditemid}/${userid}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    return null;
  }
};

