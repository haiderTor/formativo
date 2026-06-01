import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
//import LoginPage from './components/login/login.jsx'
import PrincipalPage from './components/principal/principal.jsx'
import Clientes from './components/clientes/clientes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Clientes />
  </StrictMode>,
)
