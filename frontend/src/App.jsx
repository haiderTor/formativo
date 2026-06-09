// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Principal from "./components/principal/principal.jsx";
import LoginPage from "./components/login/login.jsx";
import Tablero from "./components/tablero/tablero.jsx";
import Personal from "./components/personal/personal.jsx";
import Clientes from "./components/clientes/clientes.jsx";
import EquipoForm from "./components/equipo/equipo.jsx";
import Reporte from "./components/reporte/ReporteDemo.jsx";
import Reporteclientes from "./components/reporte/reporteclientes.jsx";
import Reporteequipos from "./components/reporte/reporteequipos.jsx";
import Reporteticket from "./components/reporte/reporteticket.jsx";
import Reportefactura from "./components/reporte/reportefactura.jsx";
import Reporteservicio from "./components/reporte/reporteservicio.jsx";






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
                <Route path="reporte" element={<Reporte />} />
                <Route path="reporteclientes" element={<Reporteclientes />} />
                <Route path="reporteequipos" element={<Reporteequipos />} />
                <Route path="reporteticket" element={<Reporteticket />} />
                <Route path="reportefactura" element={<Reportefactura />} />
                <Route path="reporteservicio" element={<Reporteservicio />} />
            </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
// Hola mundo