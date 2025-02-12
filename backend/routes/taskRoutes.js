const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const router = express.Router();

// ✅ Get all tasks
router.get("/tasks", getTasks);

// ✅ Create a task (Now with validation middleware)
router.post("/tasks", createTask);

// ✅ Update a task (Now with validation middleware)
router.put("/tasks/:id", updateTask);

// ✅ Delete a task (No change needed)
router.delete("/tasks/:id", deleteTask);

module.exports = router;
