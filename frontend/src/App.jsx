// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Principal from "./components/principal/principal.jsx";
import LoginPage from "./components/login/login.jsx";
import Tablero from "./components/tablero/tablero.jsx";
import Personal from "./components/login/personal/personal.jsx";
import Clientes from "./components/clientes/clientes.jsx";
import EquipoForm from "./components/equipo/equipo.jsx";
import Reporte from "./components/reporte/ReporteDemo.jsx";
import Reporteclientes from "./components/reporte/reporteclientes.jsx";






function App() {
    return (
        <BrowserRouter>
            <Routes>
    {/* Ruta independiente para login */}
                <Route path="/login" element={<LoginPage />} />

    {/* Layout con Nav + Outlet */}
            <Route path="/" element={<Principal />}>
                <Route path="tablero" element={<Tablero />} />
                <Route path="personal" element={<Personal />} />
                <Route path="clientes" element={<Clientes />} />
                <Route path="equipo" element={<EquipoForm />} />
            </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
// Hola mundo