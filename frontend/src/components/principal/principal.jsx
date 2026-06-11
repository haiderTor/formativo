import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Navegacion() {
    // Estados para controlar los componentes interactivos
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isReportesOpen, setIsReportesOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    // Funciones auxiliares para manejar las clases activas en los NavLinks
    const getNavLinkClass = ({ isActive }) =>
        `flex items-center px-2 py-1.5 rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-colors ${isActive ? "bg-neutral-tertiary text-fg-brand font-bold" : "text-body"
        }`;

    const getDropdownLinkClass = ({ isActive }) =>
        `pl-10 flex items-center px-2 py-1.5 rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-colors ${isActive ? "bg-neutral-tertiary text-fg-brand font-bold" : "text-body"
        }`;

    return (
        <div className="min-h-screen bg-[#121316]">

            {/* --- BARRA SUPERIOR (NAVBAR) --- */}
            <nav className="fixed top-0 z-50 w-full bg-[#121316] border-b border-default">
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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>

                            </button>
                            <a href="#" className="flex ms-2 md:me-24">
                                <img src="https://flowbite.com/docs/images/logo.svg" className="h-6 me-3" alt="Centraly" />
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
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>

                                    </button>
                                </div>

                                {/* Opciones de la cuenta (Dropdown) */}
                                <div className={`z-50 absolute right-0 top-9 bg-[#121316] border border-default-medium rounded-base shadow-lg w-44 transition-all ${isUserDropdownOpen ? "block" : "hidden"}`}>
                                    <div className="px-4 py-3 border-b border-default-medium">
                                        <p className="text-sm font-medium text-heading text-white">
                                            Neil Sims
                                        </p>
                                        <p className="text-sm text-body truncate text-gray-400">
                                            neil.sims@flowbite.com
                                        </p>
                                    </div>
                                    <ul className="p-2 text-sm text-body font-medium">
                                        <li>
                                            <a href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading text-white rounded">Dashboard</a>
                                        </li>
                                        <li>
                                            <a href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading text-white rounded">Settings</a>
                                        </li>
                                        <li>
                                            <a href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading text-white rounded">Earnings</a>
                                        </li>
                                        <li>
                                            <a href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading text-white rounded">Sign out</a>
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
                className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform sm:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-[#121316] border-e border-default">
                    <ul className="space-y-2 font-medium">
                        {/* Tablero */}
                        <li>
                            <NavLink to="/app" className={getNavLinkClass}>
                                <svg className="w-5 h-5 transition duration-75 group-hover:text-fg-brand shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z" />
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z" />
                                </svg>
                                <span className="ms-3">Tablero</span>
                            </NavLink>
                        </li>

                        {/* Personal */}
                        <li>
                            <NavLink to="personal" className={getNavLinkClass}>
                                <svg className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                <span className="ms-3">Personal</span>
                            </NavLink>
                        </li>

                        {/* Clientes */}
                        <li>
                            <NavLink to="clientes" className={getNavLinkClass}>
                                <svg className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
                                </svg>
                                <span className="ms-3">Clientes</span>
                            </NavLink>
                        </li>

                        {/* Equipo */}
                        <li>
                            <NavLink to="equipo" className={getNavLinkClass}>
                                <svg className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v14M9 5v14M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                                </svg>
                                <span className="ms-3">Equipo</span>
                            </NavLink>
                        </li>

                        {/* Menú Desplegable de Reportes */}
                        <li>
                            <button
                                type="button"
                                onClick={() => setIsReportesOpen(!isReportesOpen)}
                                className={`flex items-center w-full justify-between px-2 py-1.5 rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-colors ${isReportesOpen ? 'text-fg-brand bg-neutral-tertiary' : 'text-body'}`}
                            >
                                <svg className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                                </svg>
                                <span className="flex-1 ms-3 text-left whitespace-nowrap">Reportes</span>
                                <svg className={`w-5 h-5 transition-transform ${isReportesOpen ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Submenú */}
                            <ul className={`py-2 space-y-2 overflow-hidden transition-all duration-300 ${isReportesOpen ? 'block' : 'hidden'}`}>
                                <li><NavLink to="reporteclientes" className={getDropdownLinkClass}>Clientes</NavLink></li>
                                <li><NavLink to="reporteequipos" className={getDropdownLinkClass}>Equipos</NavLink></li>
                                <li><NavLink to="reporteticket" className={getDropdownLinkClass}>Tickets</NavLink></li>
                                <li><NavLink to="reportefactura" className={getDropdownLinkClass}>Facturas</NavLink></li>
                                <li><NavLink to="reporteservicio" className={getDropdownLinkClass}>Servicios</NavLink></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* --- CONTENEDOR PRINCIPAL --- */}
            {/* mt-14 evita que el contenido quede oculto debajo de la barra superior */}
            <div className="p-4 sm:ml-64 mt-14 transition-all min-h-screen bg-[#121316]">
                <div className="p-4 text-white">
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
        </div>
    );
}