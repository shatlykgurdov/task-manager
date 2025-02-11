const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    status: { type: String, enum: ["TODO", "IN_PROGRESS", "DONE"], default: "TODO" },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "MEDIUM" },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model("Task", TaskSchema);
