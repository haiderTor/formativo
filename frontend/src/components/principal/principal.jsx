import { NavLink } from "react-router-dom";

export default function Navegacion() {
    return (
        <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
        <ul className="flex flex-col space-y-4">
            <li>
            <NavLink to="/tablero" className={({ isActive }) => isActive ? "font-bold underline" : ""}>
                Tablero
            </NavLink>
            </li>
            <li>
            <NavLink to="/inventario" className={({ isActive }) => isActive ? "font-bold underline" : ""}>
                Inventario
            </NavLink>
            </li>
            <li>
            <NavLink to="/personal" className={({ isActive }) => isActive ? "font-bold underline" : ""}>
                Personal
            </NavLink>
            </li>
            <li>
            <NavLink to="/historial" className={({ isActive }) => isActive ? "font-bold underline" : ""}>
                Historial
            </NavLink>
            </li>
            <li>
            <NavLink to="/ajustes" className={({ isActive }) => isActive ? "font-bold underline" : ""}>
                Ajustes
            </NavLink>
            </li>
        </ul>
        </nav>
    );
}