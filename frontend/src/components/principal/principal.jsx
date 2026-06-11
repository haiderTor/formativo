import { NavLink, Outlet } from "react-router-dom";

export default function Navegacion() {
    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Sidebar fija */}
            <nav className="fixed top-0 left-0 h-screen text-white w-36 p-6 z-50">
                <p className="text-2xl font-bold mb-6 text-[#FFBF00]">Centraly</p>

                <ul className="flex flex-col space-y-5">
                <li>
                    <NavLink
                    to="tablero"
                    className={({ isActive }) =>
                        (isActive ? "font-bold " : "") +
                        "flex flex-row items-center justify-center"
                    }
                    >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 m-2"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                        />
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                        />
                    </svg>
                    Tablero
                    </NavLink>
                </li>
                <li>
                    <NavLink to="personal" className={({ isActive }) => isActive ? "font-bold " : ""}>
                    Personal
                    </NavLink>
                </li>
                <li>
                    <NavLink to="clientes" className={({ isActive }) => isActive ? "font-bold " : ""}>
                    Clientes
                    </NavLink>
                </li>
                <li>
                    <NavLink to="equipo" className={({ isActive }) => isActive ? "font-bold " : ""}>
                    Equipo
                    </NavLink>
                </li>
                <li>
                    <NavLink to="reporte" className={({ isActive }) => isActive ? "font-bold " : ""}>
                    Reportes
                    </NavLink>
                </li>
                <li>
                    <NavLink to="reporteclientes" className={({ isActive }) => isActive ? "font-bold " : ""}>
                    Reporte Clientes
                    </NavLink>
                </li>
                <li>
                    <NavLink to="reporteequipos" className={({ isActive }) => isActive ? "font-bold " : ""}>
                    Reporte Equipos
                    </NavLink>
                </li>
                <li>
                    <NavLink to="reportefactura" className={({ isActive }) => isActive ? "font-bold " : ""}>
                    Reporte Facturas
                    </NavLink>
                </li>
                <li>
                    <NavLink to="reporteservicio" className={({ isActive }) => isActive ? "font-bold " : ""}>
                    Reporte Servicios
                    </NavLink>
                </li>
                </ul>
            </nav>

            {/* Contenido principal con margen para no quedar debajo de la nav */}
            <div className="flex-1 ml-36 p-3 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}

