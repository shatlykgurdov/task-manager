import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast"; // ✅ Added Toast for notifications
import { getTasks, deleteTask } from "../services/api";
import ConfirmationDialog from "./ConfirmationDialog";
import { format, parseISO } from "date-fns";

const TaskTable = ({ onEdit }) => {
  const [tasks, setTasks] = useState([]);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const toast = useRef(null); // ✅ Initialize Toast

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      console.log("Fetching tasks..."); // ✅ Log API call
      const data = await getTasks();
      
      if (!Array.isArray(data)) {
        console.error("Invalid task data received:", data);
        setTasks([]); // ✅ Prevents crash
        return;
      }
  
      const formattedTasks = data.map((task) => ({
        ...task,
        dueDate: task.dueDate ? format(parseISO(task.dueDate), "dd/MM/yyyy") : "N/A",
        createdAt: task.createdAt ? format(parseISO(task.createdAt), "dd/MM/yyyy") : "N/A",
        updatedAt: task.updatedAt ? format(parseISO(task.updatedAt), "dd/MM/yyyy") : "N/A",
      }));
  
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]); // ✅ Prevent crash if API fails
    }
  };
  

  const confirmDelete = (task) => {
    setTaskToDelete(task);
    setConfirmVisible(true);
  };

  const handleDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete._id);
        toast.current.show({ severity: "success", summary: "Success", detail: "Task deleted successfully.", life: 3000 });
        fetchTasks(); // ✅ Ensure tasks reload after deletion
      } catch (error) {
        toast.current.show({ severity: "error", summary: "Error", detail: "Failed to delete task.", life: 3000 });
        console.error("Error deleting task:", error);
      }
    }
    setConfirmVisible(false);
  };

  return (
    <div>
      <Toast ref={toast} /> {/* ✅ Added Toast Component */}
      <DataTable value={tasks} paginator rows={5} responsiveLayout="scroll" sortField="dueDate" sortOrder={1} filterDisplay="menu">
        <Column field="title" header="Title" sortable filter />
        <Column field="description" header="Description" sortable filter />
        <Column field="status" header="Status" sortable filter />
        <Column field="priority" header="Priority" sortable filter />
        <Column field="dueDate" header="Due Date" sortable filter />
        <Column field="createdAt" header="Created At" sortable filter />
        <Column field="updatedAt" header="Last Updated" sortable filter />

        <Column
          header="Actions"
          body={(rowData) => (
            <>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-warning p-mr-2"
                onClick={() => onEdit(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => confirmDelete(rowData)}
              />
            </>
          )}
        />
      </DataTable>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        visible={confirmVisible}
        onHide={() => setConfirmVisible(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TaskTable;
