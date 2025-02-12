import axios from "axios";
import { Toast } from "primereact/toast";

const API_BASE_URL = "http://localhost:5000/api"; // ✅ Ensure this matches your backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let toastRef = null; // ✅ Global toast reference

export const setToastRef = (ref) => {
  toastRef = ref;
};

// ✅ Helper function for showing toast messages
const showToast = (severity, summary, detail) => {
  if (toastRef) {
    toastRef.show({ severity, summary, detail, life: 3000 });
  } else {
    console.warn("Toast not initialized.");
  }
};

// ✅ Helper function for error handling (FIXED)
const handleApiError = (error) => {
  if (error.response) {
    console.error("API Error:", error.response.data);
    showToast("error", "API Error", error.response.data.error || "An unexpected error occurred.");
    return null; // ✅ Ensure function doesn't crash the app
  } else if (error.request) {
    console.error("No response received from server.");
    showToast("error", "Connection Error", "Server is unreachable. Please try again later.");
    return null; // ✅ Prevent unhandled promise rejections
  } else {
    console.error("Error setting up request:", error.message);
    showToast("error", "Request Error", "An unexpected error occurred.");
    return null;
  }
};

// ✅ Fetch all tasks (FIXED)
export const getTasks = async () => {
  try {
    const response = await api.get("/tasks");
    return response.data || []; // ✅ Always return an array
  } catch (error) {
    handleApiError(error);
    return []; // ✅ Return an empty array instead of null
  }
};


// ✅ Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await api.post("/tasks", taskData);
    showToast("success", "Task Created", "A new task has been created.");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ✅ Update a task
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    showToast("success", "Task Updated", "Task updated successfully.");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ✅ Delete a task
export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    showToast("success", "Task Deleted", "Task has been deleted successfully.");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
