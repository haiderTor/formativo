import { NavLink, Outlet } from "react-router-dom";

export default function Navegacion() {
    return (
        <div className="flex flex-row w-full h-screen bg-[#121316]">

            <nav className="text-white w-36 p-6">
                <ul className="flex flex-col space-y-5">

                    <li>
                    <NavLink to="/tablero" className={({ isActive }) => (isActive ? "font-bold " : "") + "flex flex-row items-center justify-center"} >
                        Tablero
                    </NavLink>
                    </li>

                    <li>
                    <NavLink to="/inventario" className={({ isActive }) => (isActive ? "font-bold" : "") + "flex flex-row items-center justify-center"}>
                        Inventario
                    </NavLink>
                    </li>

                    <li>
                    <NavLink to="/clientes" className={({ isActive }) => isActive ? "font-bold " : ""}>
                        Clientes
                    </NavLink>
                    </li>
                    <li>
                    <NavLink to="/historial" className={({ isActive }) => isActive ? "font-bold " : ""}>
                        Historial
                    </NavLink>
                    </li>
                    <li>
                    <NavLink to="/ajustes" className={({ isActive }) => isActive ? "font-bold " : ""}>
                        Ajustes
                    </NavLink>
                    </li>
                    <li>
                    <NavLink to="/equipo" className={({ isActive }) => isActive ? "font-bold " : ""}>
                        equipo
                    </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/reporte" className={({ isActive }) => (isActive ? "font-bold underline" : "")}>
                            Reportes
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/reporteclientes" className={({ isActive }) => (isActive ? "font-bold underline" : "")}>
                            Reporte Clientes
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <div className="flex-1 p-6">
                <Outlet />
            </div>

        </div>
    );
}
