import React, { useState, useRef, useEffect } from "react";
import TaskTable from "../components/TaskTable";
import TaskDialog from "../components/TaskDialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { setToastRef } from "../services/api"; // ✅ Import global toast setter

const Home = () => {
  const [taskDialogVisible, setTaskDialogVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false); // 🔄 Trigger Refresh
  const toast = useRef(null); // ✅ Initialize Toast

  useEffect(() => {
    setToastRef(toast.current); // ✅ Set global toast reference for API.js
  }, []);

  const refreshTasks = () => {
    setRefreshTrigger((prev) => !prev); // ✅ Toggle state to refresh TaskTable
  };

  return (
    <div>
      <Toast ref={toast} /> {/* ✅ Toast Component for Notifications */}
      <Button
        label="New Task"
        icon="pi pi-plus"
        className="p-button-primary"
        onClick={() => {
          setSelectedTask(null);
          setTaskDialogVisible(true);
        }}
      />
      <TaskTable key={refreshTrigger} onEdit={(task) => { setSelectedTask(task); setTaskDialogVisible(true); }} />
      <TaskDialog visible={taskDialogVisible} onHide={() => setTaskDialogVisible(false)} task={selectedTask} refreshTasks={refreshTasks} />
    </div>
  );
};

export default Home;
