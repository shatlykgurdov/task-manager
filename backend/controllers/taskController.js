const Task = require("../models/Task");
const { body, param, validationResult } = require("express-validator"); // ✅ Corrected Import

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a task
exports.createTask = [
  body("title").isString().isLength({ min: 1, max: 100 }).withMessage("Title is required (max 100 chars)."),
  body("description").optional().isLength({ max: 500 }).withMessage("Description max length is 500 chars."),
  body("status").isIn(["TODO", "IN_PROGRESS", "DONE"]).withMessage("Invalid status value."),
  body("priority").isIn(["LOW", "MEDIUM", "HIGH"]).withMessage("Invalid priority value."),
  body("dueDate").isISO8601().withMessage("Invalid due date format (YYYY-MM-DD)."),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newTask = new Task(req.body);
      await newTask.save();
      res.status(201).json(newTask);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// Update a task
exports.updateTask = [
  param("id").isMongoId().withMessage("Invalid task ID."),

  body("title").optional().isString().isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters."),
  body("description").optional().isString().isLength({ max: 500 })
    .withMessage("Description max length is 500 characters."),
  body("status").optional().isIn(["TODO", "IN_PROGRESS", "DONE"])
    .withMessage("Invalid status value."),
  body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Invalid priority value."),
  body("dueDate").optional().isISO8601()
    .withMessage("Invalid due date format (YYYY-MM-DD)."),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found." });
      }

      res.status(200).json(updatedTask);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
