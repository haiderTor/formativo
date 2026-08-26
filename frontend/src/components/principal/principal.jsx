// principal.jsx — TRAMO 1/4
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Navegacion() {
    // Estados para controlar los componentes interactivos
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isReportesOpen, setIsReportesOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    // Funciones auxiliares para manejar las clases activas en los NavLinks
    const getNavLinkClass = ({ isActive }) =>
        `flex items-center px-2 py-1.5 rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-colors ${
        isActive ? "bg-neutral-tertiary text-fg-brand font-bold" : "text-body"
        }`;

    const getDropdownLinkClass = ({ isActive }) =>
        `pl-10 flex items-center px-2 py-1.5 rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-colors ${
        isActive ? "bg-neutral-tertiary text-fg-brand font-bold" : "text-body"
        }`;

    return (
        <div className="min-h-screen relative bg-[#000000]">
        {/* Capas globales de fondo para glassmorphism */}
        <div className="bg-complex bg-noise" aria-hidden="true" />
        <div className="bg-blur-layer" aria-hidden="true" />
        <div className="bg-spot" aria-hidden="true" />

        {/* Contenedor z-10 para que el layout quede encima de las capas */}
        <div className="relative z-10">
            {/* --- BARRA SUPERIOR (NAVBAR) --- */}
            <nav className="fixed top-0 z-50 w-full glass glass--accent">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                {/* Logo y Botón de Menú Móvil */}
                <div className="flex items-center justify-start rtl:justify-end">
                    <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    type="button"
                    className="sm:hidden text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm p-2 focus:outline-none"
                    >
                    <span className="sr-only">Open sidebar</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    </button>

                    <a href="#" className="flex ms-2 md:me-24">
                    <img src="/Logo-orange-solid.png" className="h-6 me-3" alt="Centraly" />
                    <span className="self-center text-lg font-semibold whitespace-nowrap text-white">Centraly</span>
                    </a>
                </div>

                {/* Menú de Usuario / Perfil */}
                <div className="flex items-center">
                    <div className="flex items-center ms-3 relative">
                    <div>
                        <button
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        type="button"
                        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                        >
                        <span className="sr-only">Open user menu</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        </button>
                    </div>

                    {/* Opciones de la cuenta (Dropdown) */}
                    <div
                        className={`z-50 absolute right-0 top-9 bg-[#121316] border border-default-medium rounded-base shadow-lg w-44 transition-all ${
                        isUserDropdownOpen ? "block" : "hidden"
                        }`}
                    >
                        <div className="px-4 py-3 border-b border-default-medium">
                        <p className="text-sm font-medium text-heading text-white">Neil Sims</p>
                        <p className="text-sm text-body truncate text-gray-400">neil.sims@flowbite.com</p>
                        </div>

                        <ul className="p-2 text-sm text-body font-medium">
                        <li>
                            <a href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading text-white rounded">
                            Dashboard
                            </a>
                        </li>
                        <li>
                            <a href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading text-white rounded">
                            Settings
                            </a>
                        </li>
                        <li>
                            <a href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading text-white rounded">
                            Earnings
                            </a>
                        </li>
                        <li>
                            <a href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading text-white rounded">
                            Sign out
                            </a>
                        </li>
                        </ul>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </nav>
            {/* --- BARRA LATERAL (SIDEBAR) --- */}
            <aside
            className={`fixed top-0 left-0 z-40 w-45 h-screen pt-14 transition-transform sm:translate-x-0 ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            aria-label="Sidebar"
            >
            <div className="h-full px-3 py-4 overflow-y-auto glass glass--spot" style={{ '--spot-x': '12%', '--spot-y': '20%', '--spot-tx': '-8px', background: 'transparent' }}>
                <ul className="space-y-2 font-medium">
                {/* Servicios */}
                <li>
                    <NavLink
                    to="/app"
                    end
                    className={({ isActive }) =>
                        isActive
                        ? "flex items-center px-2 py-1.5 rounded-md bg-linear-to-r from-orange-950 to-orange-900 text-white transition"
                        : "flex items-center px-2 py-1.5 rounded-md hover:bg-linear-to-r hover:from-orange-990 hover:to-orange-700 hover:opacity-90 transition text-gray-300"
                    }
                    >
                    <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z" />
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z" />
                    </svg>
                    <span className="ms-3 font-[Manrope]">Servicios</span>
                    </NavLink>
                </li>

                {/* Personas */}
                <li>
                    <NavLink
                    to="/app/homepersonas"
                    className={({ isActive }) =>
                        isActive
                        ? "flex items-center px-2 py-1.5 rounded-md bg-linear-to-r from-orange-950 to-orange-900 text-white transition"
                        : "flex items-center px-2 py-1.5 rounded-md hover:bg-linear-to-r hover:from-orange-990 hover:to-orange-700 hover:opacity-90 transition text-gray-300"
                    }
                    >
                    <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                    </svg>
                    <span className="ms-3 font-[Manrope]">Personas</span>
                    </NavLink>
                </li>

                {/* Equipo */}
                <li>
                    <NavLink
                    to="/app/equipo"
                    className={({ isActive }) =>
                        isActive
                        ? "flex items-center px-2 py-1.5 rounded-md bg-linear-to-r from-gray-990 to-orange-700 text-white transition"
                        : "flex items-center px-2 py-1.5 rounded-md hover:bg-linear-to-r hover:from-gray-990 hover:to-orange-700 hover:opacity-90 transition text-gray-300"
                    }
                    >
                    <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v14M9 5v14M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                    </svg>
                    <span className="ms-3 font-[Manrope]">Equipo</span>
                    </NavLink>
                </li>

                {/* Reportes */}
                <li>
                    <NavLink
                    to="/app/reporte"
                    className={({ isActive }) =>
                        isActive
                        ? "flex items-center px-2 py-1.5 rounded-md bg-linear-to-r from-gray-990 to-orange-700 text-white transition"
                        : "flex items-center px-2 py-1.5 rounded-md hover:bg-linear-to-r hover:from-gray-990 hover:to-orange-700 hover:opacity-90 transition text-gray-300"
                    }
                    >
                    <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                    </svg>
                    <span className="ms-3 font-[Manrope]">Reportes</span>
                    </NavLink>
                </li>

                {/* Tickets */}
                <li>
                    <NavLink
                    to="/app/tickets"
                    className={({ isActive }) =>
                        isActive
                        ? "flex items-center px-2 py-1.5 rounded-md bg-linear-to-r from-gray-900/70 to-orange-700/70 text-white backdrop-blur-md transition"
                        : "flex items-center px-2 py-1.5 rounded-md hover:bg-linear-to-r hover:from-gray-900/50 hover:to-orange-700/50 hover:opacity-90 transition text-gray-300 backdrop-blur-sm"
                    }
                    >
                    <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6M5 8h14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm3-4h8v4H8V4Z" />
                    </svg>
                    <span className="ms-3 font-[Manrope]">Tickets</span>
                    </NavLink>
                </li>
                </ul>
            </div> {/* cierre del div.h-full (glass) */}
            </aside>
            {/* --- CONTENEDOR PRINCIPAL (Outlet) --- */}
            <div className="p-4 sm:ml-45 mt-14 transition-all min-h-screen">
            <div className="p-4 text-white glass" style={{ '--spot-x': '60%', '--spot-y': '18%', '--spot-tx': '6px' }}>
                <Outlet />
            </div>
            </div>

            {/* Fondo oscuro para cerrar el menú móvil */}
            {isSidebarOpen && (
            <div
                className="fixed inset-0 z-30 bg-black/50 sm:hidden"
                onClick={() => setIsSidebarOpen(false)}
            />
            )}

        </div> {/* cierre del div.relative z-10 */}
        </div> /* cierre del wrapper min-h-screen relative */
    );
    }
    // principal.jsx — TRAMO 4/4 (fallback detection para navegadores sin backdrop-filter)
    // Pega este snippet en tu main.jsx justo antes de renderizar la app (o al final de principal.jsx
    // si prefieres), para añadir la clase `no-backdrop` al <html> cuando no haya soporte.
    if (typeof window !== 'undefined' && window.CSS) {
    const supportsBackdrop =
        CSS.supports('backdrop-filter', 'blur(1px)') ||
        CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
    if (!supportsBackdrop) {
        document.documentElement.classList.add('no-backdrop');
    }
}
