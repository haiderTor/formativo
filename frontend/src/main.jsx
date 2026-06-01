import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
//import LoginPage from './components/login/login.jsx'
import PrincipalPage from './components/principal/principal.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrincipalPage />
  </StrictMode>,
)
