import React, { useEffect } from "react";
import Home from "./pages/Home"; // Import Home component
import "./App.css"; // Keep Vite styles

function App() {
  // ✅ Dynamically update the browser tab title
  useEffect(() => {
    document.title = "Task Manager Web App"; 
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Manager</h1> {/* Use <h1> for better accessibility */}
      </header>
      <main className="app-content">
        <Home /> {/* Render the Home component */}
      </main>
    </div>
  );
}

export default App;
