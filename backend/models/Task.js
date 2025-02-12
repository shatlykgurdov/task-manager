const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."], // ✅ Ensures title is always provided
      maxlength: [100, "Title cannot exceed 100 characters."]
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters."]
    },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"], // ✅ Restricts to valid values
      default: "TODO"
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required."], // ✅ Ensures dueDate is provided
      validate: {
        validator: function (value) {
          return value instanceof Date && !isNaN(value);
        },
        message: "Invalid due date format."
      }
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"], // ✅ Restricts to valid values
      default: "MEDIUM"
    }
  },
  { timestamps: true } // ✅ Automatically adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model("Task", TaskSchema);
