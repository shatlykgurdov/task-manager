import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { getTasks, deleteTask } from "../services/api";
import ConfirmationDialog from "./ConfirmationDialog";
import { format, parseISO } from "date-fns";

const TaskTable = ({ onEdit }) => {
  const [tasks, setTasks] = useState([]);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      const formattedTasks = response.data.map((task) => ({
        ...task,
        dueDate: task.dueDate ? format(parseISO(task.dueDate), "dd/MM/yyyy") : "N/A", // Convert ISO to DD/MM/YYYY
        createdAt: task.createdAt ? format(parseISO(task.createdAt), "dd/MM/yyyy") : "N/A",
        updatedAt: task.updatedAt ? format(parseISO(task.updatedAt), "dd/MM/yyyy") : "N/A",
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
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
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
    setConfirmVisible(false);
  };

  return (
    <div>
      <DataTable value={tasks} paginator rows={5} responsiveLayout="scroll">
        <Column field="title" header="Title" sortable />
        <Column field="description" header="Description" sortable />
        <Column field="status" header="Status" sortable />
        <Column field="priority" header="Priority" sortable />
        <Column field="dueDate" header="Due Date" sortable />
        <Column field="createdAt" header="Created At" sortable />
        <Column field="updatedAt" header="Last Updated" sortable />

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
