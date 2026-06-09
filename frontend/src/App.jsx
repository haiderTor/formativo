// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login/login.jsx";
import Tablero from "./components/principal/principal.jsx";
import Personal from "./components/personal/personal.jsx";
import Clientes from "./components/clientes/clientes.jsx";
import EquipoForm from "./components/equipo/equipo.jsx";
import Reporte from "./components/reporte/ReporteDemo.jsx";
import Reporteclientes from "./components/reporte/reporteclientes.jsx";






function App() {
    return (
        <BrowserRouter>
            <div className="flex flex-row min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/tablero" element={<Tablero />} />
                    <Route path="/personal" element={<Personal />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/equipo" element={<EquipoForm />} />
                    <Route path="/reporte" element={<Reporte />} />
                    <Route path="/reporteclientes" element={<Reporteclientes />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
// Hola mundo