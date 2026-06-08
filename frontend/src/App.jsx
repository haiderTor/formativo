// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login/login.jsx";
import Tablero from "./components/principal/principal.jsx";
import Personal from "./components/login/personal/personal.jsx";
import Clientes from "./components/clientes/clientes.jsx";
import EquipoForm from "./components/equipo/equipo.jsx";


function App() {
    return (
        <div className="flex flex-row min-h-screen bg-gray-100">
        <BrowserRouter>
            <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/tablero" element={<Tablero />} />
            <Route path="/personal" element={<Personal />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/equipo" element={<EquipoForm />} />
            </Routes>
        </BrowserRouter>
        </div>
    );
}

export default App;
// Hola mundo