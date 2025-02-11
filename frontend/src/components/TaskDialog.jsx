import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { createTask, updateTask } from "../services/api";
import { format, parse, parseISO } from "date-fns";

const TaskDialog = ({ visible, onHide, task, refreshTasks }) => {
  const emptyTask = { title: "", description: "", status: "TODO", priority: "MEDIUM", dueDate: null };
  const [taskData, setTaskData] = useState(emptyTask);

  // Format and parse date properly
  useEffect(() => {
    if (task) {
      setTaskData({
        ...task,
        dueDate: task.dueDate ? parseISO(task.dueDate) : null, // Convert stored ISO string to Date object
      });
    } else {
      setTaskData(emptyTask);
    }
  }, [task]);

  const handleSave = async () => {
    try {
      let taskToSave = {
        ...taskData,
        dueDate: taskData.dueDate ? format(taskData.dueDate, "yyyy-MM-dd") : null, // Convert to ISO format before saving
      };

      if (task?._id) {
        await updateTask(task._id, taskToSave);
      } else {
        await createTask(taskToSave);
      }

      refreshTasks();
      onHide();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <Dialog visible={visible} onHide={onHide} header="Task Details" modal>
      <div className="p-fluid">
        <label>Title</label>
        <InputText 
          value={taskData.title} 
          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })} 
        />

        <label>Description</label>
        <InputText 
          value={taskData.description} 
          onChange={(e) => setTaskData({ ...taskData, description: e.target.value })} 
        />

        <label>Status</label>
        <Dropdown
          value={taskData.status}
          options={["TODO", "IN_PROGRESS", "DONE"]}
          onChange={(e) => setTaskData({ ...taskData, status: e.value })}
        />

        <label>Priority</label>
        <Dropdown
          value={taskData.priority}
          options={["LOW", "MEDIUM", "HIGH"]}
          onChange={(e) => setTaskData({ ...taskData, priority: e.value })}
        />

        <label>Due Date</label>
        <Calendar
          value={taskData.dueDate}
          onChange={(e) => setTaskData({ ...taskData, dueDate: e.value })}
          dateFormat="dd/mm/yy" // ✅ Ensure slashes instead of spaces
          showIcon
          className="due-date-input"
        />

        <Button label="Save" icon="pi pi-check" onClick={handleSave} />
      </div>
    </Dialog>
  );
};

export default TaskDialog;
