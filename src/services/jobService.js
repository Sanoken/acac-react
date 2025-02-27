const API_URL = process.env.REACT_APP_ACAC_API_URL + "/jobs";

// Fetch all jobs
export const getJobs = async () => {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

// Fetch a single Job  by ID
export const getJob = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching job:", error);
    return null;
  }
};

// Create a new job
export const createJob = async (userData) => {
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
    console.error("Error creating job:", error);
    return null;
  }
};

// Update an existing job
export const updateJob = async (id, userData) => {
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
    console.error("Error updating job:", error);
    return null;
  }
};

// Delete a user
export const deleteJob = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error("Error deleting job:", error);
    return false;
  }
};
