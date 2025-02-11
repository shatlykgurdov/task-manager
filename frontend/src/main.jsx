import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import "primereact/resources/themes/lara-light-blue/theme.css"; // PrimeReact Theme
import "primereact/resources/primereact.min.css"; // PrimeReact Core
import "primeicons/primeicons.css"; // PrimeIcons
import "./styles.css"; // Custom Styles


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
