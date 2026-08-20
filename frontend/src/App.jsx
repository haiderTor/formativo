// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Principal from "./components/principal/principal.jsx";
import LoginPage from "./components/login/login.jsx";
import Tablero from "./components/tablero/tablero.jsx";
import Personal from "./components/personal/personal.jsx";
import Homepersonas from "./components/personas/homepersonas.jsx";
import EquipoForm from "./components/equipo/equipo.jsx";
import Reporte from "./components/reporte/ReporteDemo.jsx";
import Reporteclientes from "./components/reporte/reporteclientes.jsx";
import Reporteequipos from "./components/reporte/reporteequipos.jsx";
import Reporteticket from "./components/reporte/reporteticket.jsx";
import Reportefactura from "./components/reporte/reportefactura.jsx";
import Reporteservicio from "./components/reporte/reporteservicio.jsx";
import Tickets from "./components/tickets/tickets.jsx";
import Inicio from "./components/inicio/inicio.jsx";
function App() {
    return (
        <BrowserRouter>
            <Routes>
    {/* Ruta independiente para login */}
                <Route path="/" element={<LoginPage />} />

    {/* Layout con Nav + Outlet */}
                <Route path="/app" element={<Principal />}>
                    <Route index element={<Inicio/>} />
                    <Route path="personal" element={<Personal />} />
                    <Route path="equipo" element={<EquipoForm />} />
                    <Route path="reporte" element={<Reporte />} />
                    <Route path="reporteclientes" element={<Reporteclientes />} />
                    <Route path="reporteequipos" element={<Reporteequipos />} />
                    <Route path="reporteticket" element={<Reporteticket />} />
                    <Route path="reportefactura" element={<Reportefactura />} />
                    <Route path="reporteservicio" element={<Reporteservicio />} />
                    <Route path="homepersonas" element={<Homepersonas />} />
                    <Route path="tickets" element={<Tickets />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;