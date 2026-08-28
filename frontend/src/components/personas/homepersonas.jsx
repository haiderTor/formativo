import { useState, useEffect, useMemo } from "react";

export default function GestionCentralizada() {
    // ESTADO DE PESTAÑAS
    const [activeTab, setActiveTab] = useState("clientes");

    // ESTADOS GLOBALES
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);

    // PAGINACIÓN NUMÉRICA
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // ESTADOS DE CLIENTES
    const [clientes, setClientes] = useState([]);
    const [newCliente, setNewCliente] = useState({
        tipo_documento: "",
        documento: "",
        nombres: "",
        apellidos: "",
        telefono: "",
        correo: "",
        direccion: "",
        ciudad: "",
    });

    // ESTADOS DE EMPLEADOS
    const [empleados, setEmpleados] = useState([]);
    const [newEmpleado, setNewEmpleado] = useState({
        tipo_documento: "",
        documento: "",
        nombres: "",
        apellidos: "",
        especialidad: "",
        telefono: "",
        correo: "",
        cargo: ""
    });

    // OBTENER DATOS (Clientes y Empleados)
    useEffect(() => {
        fetch("http://localhost:3000/routes/clientes")
            .then((res) => res.json())
            .then((data) => setClientes(data))
            .catch((err) => console.error("Error cargando clientes:", err));

        fetch("http://localhost:3000/routes/empleado")
            .then((res) => res.json())
            .then((data) => setEmpleados(data))
            .catch((err) => console.error("Error cargando empleados:", err));
    }, []);

    // CAMBIAR PESTAÑA
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearch("");
        setCurrentPage(1);
    };

    // LÓGICA DE DATOS ACTIVOS (Depende de la pestaña)
    const activeData = activeTab === "clientes" ? clientes : empleados;

    // FILTRO DE BÚSQUEDA
    const filteredData = useMemo(() => {
        return activeData.filter((item) =>
            Object.values(item).some((val) =>
                String(val).toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, activeData]);

    // LÓGICA DE PAGINACIÓN
    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // HANDLERS FORMULARIOS
    const handleClienteChange = (e) => {
        setNewCliente({ ...newCliente, [e.target.name]: e.target.value });
    };

    const handleEmpleadoChange = (e) => {
        setNewEmpleado({ ...newEmpleado, [e.target.name]: e.target.value });
    };

    // SUBMIT UNIFICADO
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const isCliente = activeTab === "clientes";
        const endpoint = isCliente ? "http://localhost:3000/routes/clientes" : "http://localhost:3000/routes/empleado";
        const payload = isCliente ? newCliente : newEmpleado;
        const idField = isCliente ? "cliente_id" : "empleado_id";

        try {
            if (editingItem) {
                // EDITAR
                const response = await fetch(`${endpoint}/${editingItem[idField]}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const updated = await response.json();

                if (isCliente) {
                    setClientes(clientes.map((c) => c.cliente_id === updated.cliente_id ? updated : c));
                } else {
                    setEmpleados(empleados.map((emp) => emp.empleado_id === updated.empleado_id ? updated : emp));
                }
            } else {
                // CREAR
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                
                const data = await response.json();
                if (isCliente) {
                    setClientes([...clientes, data]);
                } else {
                    setEmpleados([...empleados, data]);
                    alert("Empleado registrado correctamente");
                }
            }
            setShowModal(false);
            setEditingItem(null);
        } catch (err) {
            console.error("Error en la operación:", err);
            alert("Error de conexión con el servidor");
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        if (activeTab === "clientes") {
            setNewCliente(item);
        } else {
            setNewEmpleado(item);
        }
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            const isCliente = activeTab === "clientes";
            const endpoint = isCliente 
                ? `http://localhost:3000/routes/clientes/${itemToDelete}`
                : `http://localhost:3000/routes/empleado/${itemToDelete}`;

            try {
                await fetch(endpoint, { method: "DELETE" });
                
                if (isCliente) {
                    setClientes(clientes.filter((c) => c.cliente_id !== itemToDelete));
                } else {
                    setEmpleados(empleados.filter((emp) => emp.empleado_id !== itemToDelete));
                }
                
                setItemToDelete(null);
                if (currentItems.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            } catch (err) {
                console.error("Error al eliminar:", err);
            }
        }
    };

    const openCreateModal = () => {
        setEditingItem(null);
        if (activeTab === "clientes") {
            setNewCliente({ tipo_documento: "", documento: "", nombres: "", apellidos: "", telefono: "", correo: "", direccion: "", ciudad: "" });
        } else {
            setNewEmpleado({ tipo_documento: "", documento: "", nombres: "", apellidos: "", especialidad: "", telefono: "", correo: "", cargo: "" });
        }
        setShowModal(true);
    };

    return (
        <div className="p-4 sm:p-6 bg-[#0f1113] min-h-screen text-gray-200">
            {/* Header: título + acciones */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white capitalize">{activeTab}</h1>
                </div>

                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full xl:w-auto">
                    {/* Pestañas / filtros */}
                    <div className="flex flex-wrap gap-2 items-center bg-[#121316]/40 backdrop-blur-sm rounded-md p-1">
                        {["clientes", "empleados"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition whitespace-nowrap capitalize ${
                                    activeTab === tab
                                        ? "bg-linear-to-r from-orange-600 to-orange-400 text-white shadow"
                                        : "text-gray-300 hover:bg-white/5"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Buscador */}
                    <div className="relative w-full lg:w-64">
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder={`Buscar ${activeTab}...`}
                            className="w-full pl-3 pr-10 py-2 rounded-md bg-[#0b0c0d] border border-[#222] text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <svg className="w-4 h-4 text-gray-500 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>
                    </div>

                    {/* Botones */}
                    <div className="flex items-center gap-2">
                        <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-200 rounded-md shadow-sm text-sm font-semibold transition-transform hover:scale-105">
                            Importar
                        </button>
                        <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-200 rounded-md shadow-sm text-sm font-semibold transition-transform hover:scale-105">
                            Exportar
                        </button>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-sm text-sm font-semibold transition-transform hover:scale-105 w-full sm:w-auto"
                        >
                            + Nuevo {activeTab === "clientes" ? "Cliente" : "Empleado"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla / Lista: en mobile mostramos tarjetas, en md+ la tabla */}
            <div className="space-y-4">
                {/* Mobile list (cards) */}
                <ul className="md:hidden space-y-3">
                    {currentItems.map((item) => {
                        const id = activeTab === "clientes" ? item.cliente_id : item.empleado_id;
                        return (
                            <li key={id} className="border border-[#222] p-3 rounded-xl bg-[#0b0c0d]/60">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-medium text-white">{item.nombres} {item.apellidos}</div>
                                        <div className="text-xs text-gray-400">{item.tipo_documento}: {item.documento}</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {activeTab === "empleados" && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-700 text-white">
                                                {item.cargo}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-sm text-gray-300 line-clamp-1">{item.correo || "—"}</div>
                                    <div className="text-xs text-gray-400 mt-1">{item.telefono || "—"}</div>
                                </div>
                                <div className="flex items-center justify-end mt-3 gap-2">
                                    <button onClick={() => handleEdit(item)} className="text-xs px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-200 transition">Editar</button>
                                    <button onClick={() => setItemToDelete(id)} className="text-xs px-2 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white transition">Borrar</button>
                                </div>
                            </li>
                        );
                    })}
                    {currentItems.length === 0 && (
                        <div className="p-6 text-center text-sm text-gray-500 bg-[#0b0c0d]/60 border border-[#222] rounded-xl">
                            No hay {activeTab} registrados aún o no coinciden con la búsqueda.
                        </div>
                    )}
                </ul>

                {/* Desktop table */}
                <div className="hidden md:block bg-[#0b0c0d]/60 border border-[#222] rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#1f1f1f] flex items-center justify-between">
                        <div className="text-sm text-gray-300 font-semibold capitalize">{activeTab}</div>
                        <div className="text-xs text-gray-400">Mostrando {filteredData.length} resultados</div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#1f1f1f]">
                            <thead className="bg-[#0f1113]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs text-orange-400">Identificación</th>
                                    <th className="px-4 py-3 text-left text-xs text-gray-400">Nombre</th>
                                    <th className="px-4 py-3 text-left text-xs text-gray-400">Contacto</th>
                                    {activeTab === "empleados" && <th className="px-4 py-3 text-left text-xs text-gray-400">Cargo / Especialidad</th>}
                                    {activeTab === "clientes" && <th className="px-4 py-3 text-left text-xs text-gray-400">Dirección / Ciudad</th>}
                                    <th className="px-4 py-3 text-right text-xs text-gray-400">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#1f1f1f]">
                                {currentItems.map((item) => {
                                    const id = activeTab === "clientes" ? item.cliente_id : item.empleado_id;
                                    return (
                                        <tr key={id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 align-top w-40">
                                                <div className="text-sm font-medium text-white">{item.documento}</div>
                                                <div className="text-xs text-gray-500">{item.tipo_documento}</div>
                                            </td>

                                            <td className="px-4 py-3 align-top">
                                                <div className="text-sm text-white font-medium">{item.nombres} {item.apellidos}</div>
                                            </td>

                                            <td className="px-4 py-3 align-top">
                                                <div className="text-sm text-gray-300">{item.correo || "—"}</div>
                                                <div className="text-xs text-gray-500">{item.telefono || "—"}</div>
                                            </td>

                                            {activeTab === "empleados" && (
                                                <td className="px-4 py-3 align-top">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-700 text-white mb-1">
                                                        {item.cargo}
                                                    </span>
                                                    <div className="text-xs text-gray-400">{item.especialidad || "—"}</div>
                                                </td>
                                            )}

                                            {activeTab === "clientes" && (
                                                <td className="px-4 py-3 align-top">
                                                    <div className="text-sm text-gray-300">{item.direccion || "—"}</div>
                                                    <div className="text-xs text-gray-500">{item.ciudad || "—"}</div>
                                                </td>
                                            )}

                                            <td className="px-4 py-3 align-top text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <button onClick={() => handleEdit(item)} className="text-sm px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-200 transition">Editar</button>
                                                    <button onClick={() => setItemToDelete(id)} className="text-sm px-2 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white transition">Borrar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {currentItems.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-6 text-center text-gray-500">No se encontraron {activeTab}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* CONTROLES DE PAGINACIÓN */}
            {filteredData.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-4 bg-[#0b0c0d]/60 border border-[#222] rounded-xl gap-4">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all w-full sm:w-auto ${
                            currentPage === 1 ? "bg-white/5 text-gray-600 cursor-not-allowed" : "bg-white/10 hover:bg-white/20 text-gray-200"
                        }`}
                    >
                        Anterior
                    </button>
                    
                    <div className="flex flex-wrap justify-center gap-1.5">
                        {Array.from({ length: totalPages }, (_, index) => {
                            const pageNumber = index + 1;
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => paginate(pageNumber)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                                        currentPage === pageNumber 
                                            ? "bg-orange-500 text-white shadow-md" 
                                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all w-full sm:w-auto ${
                            currentPage === totalPages ? "bg-white/5 text-gray-600 cursor-not-allowed" : "bg-white/10 hover:bg-white/20 text-gray-200"
                        }`}
                    >
                        Siguiente
                    </button>
                </div>
            )}

            {/* Modal crear/editar: responsive */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60" onClick={() => { setShowModal(false); setEditingItem(null); }} />
                    <div className="relative w-full max-w-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-[#222] z-10 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">
                                {editingItem ? `Editar ${activeTab === "clientes" ? "Cliente" : "Empleado"}` : `Nuevo ${activeTab === "clientes" ? "Cliente" : "Empleado"}`}
                            </h3>
                            <button onClick={() => { setShowModal(false); setEditingItem(null); }} className="text-gray-400 hover:text-white">X</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            {/* FORMULARIO PARA CLIENTES */}
                            {activeTab === "clientes" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Tipo de Documento</label>
                                        <select name="tipo_documento" value={newCliente.tipo_documento} onChange={handleClienteChange} className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" required>
                                            <option value="">Seleccione...</option>
                                            <option value="CC">Cédula de Ciudadanía</option>
                                            <option value="NIT">NIT</option>
                                            <option value="TI">Tarjeta de Identidad</option>
                                            <option value="CE">Cédula de Extranjería</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Número de Documento</label>
                                        <input type="text" name="documento" placeholder="Ej: 1002345678" value={newCliente.documento} onChange={handleClienteChange} className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" required />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Nombres</label>
                                        <input type="text" name="nombres" placeholder="Ej: Juan Diego" value={newCliente.nombres} onChange={handleClienteChange} className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" required />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Apellidos</label>
                                        <input type="text" name="apellidos" placeholder="Ej: Perez Lopez" value={newCliente.apellidos} onChange={handleClienteChange} className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500"  />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Teléfono</label>
                                        <input type="tel" name="telefono" placeholder="Ej: 3001234567" value={newCliente.telefono} onChange={handleClienteChange} className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Correo Electrónico</label>
                                        <input type="email" name="correo" placeholder="Ej: correo@ejemplo.com" value={newCliente.correo} onChange={handleClienteChange} className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Dirección</label>
                                        <input type="text" name="direccion" placeholder="Ej: Calle 123 # 45-67" value={newCliente.direccion} onChange={handleClienteChange} className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Ciudad</label>
                                        <input type="text" name="ciudad" placeholder="Ej: Bogotá" value={newCliente.ciudad} onChange={handleClienteChange} className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" />
                                    </div>
                                </div>
                            )}

                            {/* FORMULARIO PARA EMPLEADOS */}
                            {activeTab === "empleados" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Tipo de Documento</label>
                                        <select name="tipo_documento" value={newEmpleado.tipo_documento} onChange={handleEmpleadoChange} className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" required>
                                            <option value="">Seleccione...</option>
                                            <option value="CC">Cédula de Ciudadanía</option>
                                            <option value="NIT">NIT</option>
                                            <option value="TI">Tarjeta de Identidad</option>
                                            <option value="CE">Cédula de Extranjería</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Número de Documento</label>
                                        <input type="text" name="documento" placeholder="Ej: 1002345678" value={newEmpleado.documento} onChange={handleEmpleadoChange} className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" required />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Nombres</label>
                                        <input type="text" name="nombres" placeholder="Ej: Ana Maria" value={newEmpleado.nombres} onChange={handleEmpleadoChange} className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" required />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Apellidos</label>
                                        <input type="text" name="apellidos" placeholder="Ej: Gomez Ramirez" value={newEmpleado.apellidos} onChange={handleEmpleadoChange} className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" required />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Especialidad</label>
                                        <input type="text" name="especialidad" placeholder="Ej: Técnico en Hardware" value={newEmpleado.especialidad} onChange={handleEmpleadoChange} className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Teléfono</label>
                                        <input type="text" name="telefono" placeholder="Ej: 3001234567" value={newEmpleado.telefono} onChange={handleEmpleadoChange} className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Correo Electrónico</label>
                                        <input type="email" name="correo" placeholder="Ej: correo@ejemplo.com" value={newEmpleado.correo} onChange={handleEmpleadoChange} className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Cargo</label>
                                        <input type="text" name="cargo" placeholder="Ej: Administrador, Soporte" value={newEmpleado.cargo} onChange={handleEmpleadoChange} className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" required />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEditingItem(null); }}
                                    className="px-4 py-2 rounded-md bg-white/5 text-gray-200 hover:bg-white/10 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-transform hover:scale-105"
                                >
                                    {editingItem ? "Guardar cambios" : `Crear ${activeTab === "clientes" ? "Cliente" : "Empleado"}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            {itemToDelete !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setItemToDelete(null)} />
                    <div className="relative w-full max-w-sm bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-[#222] z-10 text-center">
                        <div className="text-red-500 mb-4 flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">¿Eliminar Registro?</h3>
                        <p className="text-gray-400 mb-6 text-sm">
                            Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este registro?
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={() => setItemToDelete(null)}
                                className="px-4 py-2 rounded-md bg-white/5 text-gray-200 hover:bg-white/10 transition-colors w-full sm:w-auto"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-transform hover:scale-105 w-full sm:w-auto"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}