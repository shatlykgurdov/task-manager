import React, { useState } from "react";
import TaskTable from "../components/TaskTable";
import TaskDialog from "../components/TaskDialog";
import { Button } from "primereact/button";

const Home = () => {
  const [taskDialogVisible, setTaskDialogVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false); // 🔄 Trigger Refresh

  const refreshTasks = () => {
    setRefreshTrigger((prev) => !prev); // Toggle state to force TaskTable update
  };

  return (
    <div>
      <Button
        label="New Task"
        icon="pi pi-plus"
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
