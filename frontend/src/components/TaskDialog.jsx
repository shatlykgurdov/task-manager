import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { createTask, updateTask } from "../services/api";
import { parse, format, isValid } from "date-fns";  // ✅ Use parse() for non-ISO dates

const TaskDialog = ({ visible, onHide, task, refreshTasks }) => {
  const toast = useRef(null);
  const emptyTask = { title: "", description: "", status: "TODO", priority: "MEDIUM", dueDate: null };
  const [taskData, setTaskData] = useState(emptyTask);

  useEffect(() => {
    if (task) {
      console.log("Editing Task Data:", task);
      
      // ✅ Ensure dueDate is parsed correctly
      let parsedDate = null;
      if (task.dueDate) {
        parsedDate = parse(task.dueDate, "dd/MM/yyyy", new Date()); // Correct parsing format
        if (!isValid(parsedDate)) {
          console.warn("Invalid Date:", task.dueDate);
          parsedDate = null; // Prevent invalid date errors
        }
      }

      setTaskData({
        ...task,
        dueDate: parsedDate, // ✅ Store the correctly parsed date
      });

      console.log("Parsed Due Date:", parsedDate);
    } else {
      setTaskData(emptyTask);
    }
  }, [task]);

  const handleSave = async () => {
    try {
      if (!taskData.title.trim()) {
        toast.current.show({ severity: "warn", summary: "Validation Error", detail: "Title is required.", life: 3000 });
        return;
      }

      let taskToSave = {
        ...taskData,
        dueDate: taskData.dueDate ? format(taskData.dueDate, "yyyy-MM-dd") : null, // ✅ Convert before saving
      };

      if (task?._id) {
        await updateTask(task._id, taskToSave);
        toast.current.show({ severity: "success", summary: "Success", detail: "Task updated successfully.", life: 3000 });
      } else {
        await createTask(taskToSave);
        toast.current.show({ severity: "success", summary: "Success", detail: "Task created successfully.", life: 3000 });
      }

      refreshTasks();
      onHide();
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Error", detail: error.response?.data?.error || "An error occurred.", life: 4000 });
      console.error("Error saving task:", error);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog visible={visible} onHide={onHide} header={task ? "Edit Task" : "Create Task"} modal>
        <div className="p-fluid">
          <label>Title</label>
          <InputText 
            value={taskData.title} 
            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })} 
            required
          />

          <label>Description</label>
          <InputText 
            value={taskData.description} 
            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })} 
          />

          <label>Status</label>
          <Dropdown
            value={taskData.status}
            options={[{ label: "TODO", value: "TODO" }, { label: "IN_PROGRESS", value: "IN_PROGRESS" }, { label: "DONE", value: "DONE" }]}
            onChange={(e) => setTaskData({ ...taskData, status: e.value })}
          />

          <label>Priority</label>
          <Dropdown
            value={taskData.priority}
            options={[{ label: "LOW", value: "LOW" }, { label: "MEDIUM", value: "MEDIUM" }, { label: "HIGH", value: "HIGH" }]}
            onChange={(e) => setTaskData({ ...taskData, priority: e.value })}
          />

          <label>Due Date</label>
          <Calendar
            value={taskData.dueDate}
            onChange={(e) => setTaskData({ ...taskData, dueDate: e.value })}
            dateFormat="dd/mm/yy"
            showIcon
            className="due-date-input"
            placeholder="Select Due Date"
          />

          <div className="p-dialog-footer">
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHide} />
            <Button label="Save" icon="pi pi-check" onClick={handleSave} />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default TaskDialog;
