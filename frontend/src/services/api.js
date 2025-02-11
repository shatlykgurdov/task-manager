import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks"; // Ensure this matches your backend URL

export const getTasks = async () => {
  try {
    return await axios.get(API_URL);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

export const createTask = async (task) => {
  try {
    return await axios.post(API_URL, task);
  } catch (error) {
    console.error("Error creating task:", error.response ? error.response.data : error.message);
  }
};

export const updateTask = async (id, task) => {
  try {
    return await axios.put(`${API_URL}/${id}`, task);
  } catch (error) {
    console.error("Error updating task:", error.response ? error.response.data : error.message);
  }
};

export const deleteTask = async (id) => {
  try {
    return await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting task:", error.response ? error.response.data : error.message);
  }
};
