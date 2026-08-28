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
        {/* Contenedor z-10 para que el layout quede encima de las capas */}
        <div className="relative">
            {/* --- BARRA SUPERIOR (NAVBAR) --- */}
            <nav className="fixed top-0 z-50 w-full bg-[#000000]">
              <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                  
                  {/* Logo inline */}
                  <div className="flex items-center">
                    <a href="#" className="flex items-center">
                      <img 
                        src="/Logo-orange-solid.png" 
                        className="inline-block h-8 w-auto align-middle me-2" 
                        alt="Centraly" 
                      />
                      <span className="inline-block align-middle text-lg md:text-xl font-semibold text-white">
                        Centraly
                      </span>
                    </a>
                  </div>

                  {/* Componentes lado derecho */}
                  <div className="flex items-center space-x-4">
                    
                    {/* Buscador */}
                    <div className="hidden md:block">
                      <input
                        type="text"
                        placeholder="Buscar..."
                        className="px-3 py-1 rounded-md bg-[#121316] text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
                      />
                    </div>

                    {/* Notificaciones */}
                    <button className="relative text-white hover:text-[#FFBF00]">
                      <svg xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" fill="currentColor" 
                        className="w-6 h-6">
                        <path d="M12 2a9 9 0 0 0-9 9v4.5l-1.5 1.5v1h21v-1l-1.5-1.5V11a9 9 0 0 0-9-9zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z"/>
                      </svg>
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Acceso rápido (ejemplo: ayuda) */}
                    <button className="text-white hover:text-[#FFBF00]">
                      <svg xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" fill="currentColor" 
                        className="w-6 h-6">
                        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm.25 15h-1.5v-1.5h1.5zm1.75-6.5a2.25 2.25 0 0 1-1.5 2.122V13h-1.5v-1.5a.75.75 0 0 1 .75-.75 1.5 1.5 0 1 0-1.5-1.5H9a3 3 0 1 1 6 0z"/>
                      </svg>
                    </button>

                    {/* Perfil de usuario */}
                    <div className="flex items-center ms-3 relative">
                      <div>
                        <button
                          onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                          type="button"
                          className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                        >
                          <span className="sr-only">Open user menu</span>
                          <svg xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" fill="currentColor" 
                            className="w-6 h-6 text-white">
                            <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/>
                          </svg>
                        </button>
                      </div>

                      {/* Dropdown de usuario */}
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
            {/* AÑADIDO: flex flex-col justify-between para empujar ajustes al fondo */}
            <div className="h-full px-3 py-4 overflow-y-auto glass glass--spot flex flex-col justify-between" style={{ '--spot-x': '12%', '--spot-y': '20%', '--spot-tx': '-8px', background: 'transparent' }}>
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

                {/* --- BOTÓN DE AJUSTES EN LA PARTE INFERIOR --- */}
                <div className="pt-4 mt-4 border-t border-gray-700/50">
                    <button
                        type="button"
                        onClick={(e) => e.preventDefault()}
                        className="flex items-center w-full px-2 py-1.5 rounded-md hover:bg-linear-to-r hover:from-gray-900/50 hover:to-orange-700/50 hover:opacity-90 transition text-gray-300 backdrop-blur-sm"
                    >
                        <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536-.707 1.707H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.707.536.535a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z" />
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                        </svg>
                        <span className="ms-3 font-[Manrope]">Ajustes</span>
                    </button>
                </div>
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
    if (typeof window !== 'undefined' && window.CSS) {
    const supportsBackdrop =
        CSS.supports('backdrop-filter', 'blur(1px)') ||
        CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
    if (!supportsBackdrop) {
        document.documentElement.classList.add('no-backdrop');
    }
}