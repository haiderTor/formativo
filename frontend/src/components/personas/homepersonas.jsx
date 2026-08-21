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
        documento: "", // Agregado para cumplir con la columna "Identificación"
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
                
                // Adaptación para la respuesta de éxito de tu API de empleados
                if (isCliente) {
                    const saved = await response.json();
                    setClientes([...clientes, saved]);
                } else {
                    const data = await response.json();
                    if (data.success || data.empleado_id) { 
                        // Depende de cómo retorne exactamente tu backend, ajusta si es necesario
                        setEmpleados([...empleados, { ...payload, empleado_id: data.empleado_id || Date.now() }]);
                        alert("Empleado registrado correctamente");
                    }
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
            const idField = isCliente ? "cliente_id" : "empleado_id";

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
            setNewEmpleado({ documento: "", nombres: "", apellidos: "", especialidad: "", telefono: "", correo: "", cargo: "" });
        }
        setShowModal(true);
    };

    return (
        <div className="p-4 md:p-6 bg-[#121316] min-h-screen text-white">
            
            {/* TABS DE NAVEGACIÓN */}
            <div className="flex space-x-4 mb-6 border-b border-gray-700 pb-2">
                <button 
                    onClick={() => handleTabChange("clientes")}
                    className={`pb-2 px-4 text-lg font-semibold transition-colors ${activeTab === "clientes" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400 hover:text-gray-200"}`}
                >
                    Clientes
                </button>
                <button 
                    onClick={() => handleTabChange("empleados")}
                    className={`pb-2 px-4 text-lg font-semibold transition-colors ${activeTab === "empleados" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400 hover:text-gray-200"}`}
                >
                    Empleados
                </button>
            </div>

            {/* HEADER Y BOTONES */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full md:w-auto">
                    <button className="w-full sm:w-auto bg-[#6c757d] hover:bg-gray-500 text-white px-4 py-2 rounded transition-transform hover:scale-105 shadow-md">
                        Importar
                    </button>
                    <button className="w-full sm:w-auto bg-[#2f6fed] hover:bg-blue-600 text-white px-4 py-2 rounded transition-transform hover:scale-105 shadow-md">
                        Exportar {activeTab}
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-transform hover:scale-105 shadow-md"
                    >
                        Crear {activeTab === "clientes" ? "Cliente" : "Empleado"}
                    </button>
                </div>
            </div>

            {/* BUSCADOR */}
            <input
                type="text"
                placeholder={`Buscar ${activeTab}...`}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1); 
                }}
                className="w-full p-2 mb-4 rounded bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            />

            {/* TABLA RESPONSIVE */}
            <div className="bg-transparent md:bg-gray-800 rounded-lg md:shadow-lg md:border md:border-gray-700">
                {currentItems.length === 0 ? (
                    <div className="p-6 text-center bg-gray-800 rounded-lg">
                        <p className="text-gray-400">No hay {activeTab} registrados aún o no coinciden con la búsqueda.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse block md:table">
                        <thead className="hidden md:table-header-group">
                            <tr className="bg-gray-900 border-b border-gray-700 text-gray-200">
                                <th className="p-3 w-12 text-center"></th>
                                <th className="p-3 text-left">Nombre</th>
                                {activeTab === "empleados" && <th className="p-3 text-left">Cargo</th>}
                                <th className="p-3 text-left pl-6">Identificación</th>
                                <th className="p-3 text-center w-32">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group">
                            {currentItems.map((item) => {
                                const id = activeTab === "clientes" ? item.cliente_id : item.empleado_id;
                                return (
                                    <tr
                                        key={id}
                                        className="block md:table-row bg-gray-800 md:bg-transparent border border-gray-700 md:border-0 md:border-b md:border-gray-700 hover:bg-gray-750 transition-colors mb-4 md:mb-0 rounded-lg md:rounded-none"
                                    >
                                        <td className="hidden md:table-cell p-3 text-center">
                                            <button className="text-gray-400 border border-gray-600 px-2 py-0.5 rounded text-sm hover:bg-gray-700 hover:text-white transition-colors">
                                                +
                                            </button>
                                        </td>

                                        <td className="block md:table-cell p-4 md:p-3 text-gray-300 border-b border-gray-700 md:border-none">
                                            <span className="block md:hidden text-xs font-bold text-gray-500 uppercase mb-1">Nombre</span>
                                            <span className="font-semibold md:font-normal text-lg md:text-base">
                                                {item.nombres} {item.apellidos}
                                            </span>
                                        </td>

                                        {activeTab === "empleados" && (
                                            <td className="block md:table-cell p-4 md:p-3 text-gray-300 border-b border-gray-700 md:border-none">
                                                <span className="block md:hidden text-xs font-bold text-gray-500 uppercase mb-1">Cargo</span>
                                                <span>{item.cargo}</span>
                                            </td>
                                        )}

                                        <td className="block md:table-cell p-4 md:p-3 text-gray-300 md:pl-6 whitespace-nowrap border-b border-gray-700 md:border-none">
                                            <span className="block md:hidden text-xs font-bold text-gray-500 uppercase mb-1">Identificación</span>
                                            {activeTab === "clientes" ? (
                                                <span>{item.tipo_documento}: {item.documento}</span>
                                            ) : (
                                                <span>{item.documento}</span>
                                            )}
                                        </td>

                                        <td className="block md:table-cell p-4 md:p-3">
                                            <div className="flex items-center justify-end md:justify-center space-x-6 md:space-x-3">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-blue-500 hover:text-blue-400 hover:scale-125 md:hover:scale-110 transition-transform p-2 md:p-0"
                                                    title="Editar"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setItemToDelete(id)}
                                                    className="text-red-500 hover:text-red-400 hover:scale-125 md:hover:scale-110 transition-transform font-bold text-xl md:text-lg p-2 md:p-0"
                                                    title="Eliminar"
                                                >
                                                    X
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* CONTROLES DE PAGINACIÓN */}
            {filteredData.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 bg-gray-800 p-4 rounded-lg shadow border border-gray-700 gap-4">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg font-medium transition-all w-full sm:w-auto ${
                            currentPage === 1 ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-[#2f6fed] hover:bg-blue-600 text-white shadow hover:scale-105"
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
                                    className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                                        currentPage === pageNumber ? "bg-[#2f6fed] text-white shadow-md scale-105" : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
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
                        className={`px-4 py-2 rounded-lg font-medium transition-all w-full sm:w-auto ${
                            currentPage === totalPages ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-[#2f6fed] hover:bg-blue-600 text-white shadow hover:scale-105"
                        }`}
                    >
                        Siguiente
                    </button>
                </div>
            )}

            {/* MODAL CREAR / EDITAR DINÁMICO */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#191a1d] border border-gray-700 p-6 rounded-xl shadow-2xl w-full max-w-md text-gray-200 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-center text-blue-400">
                            {editingItem 
                                ? `Editar ${activeTab === "clientes" ? "Cliente" : "Empleado"}` 
                                : `Nuevo ${activeTab === "clientes" ? "Cliente" : "Empleado"}`
                            }
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* FORMULARIO PARA CLIENTES */}
                            {activeTab === "clientes" && (
                                <>
                                    <select
                                        name="tipo_documento"
                                        value={newCliente.tipo_documento}
                                        onChange={handleClienteChange}
                                        className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Tipo de Documento...</option>
                                        <option value="CC">Cédula de Ciudadanía</option>
                                        <option value="NIT">NIT</option>
                                        <option value="TI">Tarjeta de Identidad</option>
                                        <option value="CE">Cédula de Extranjería</option>
                                    </select>
                                    <input type="text" name="documento" placeholder="Número de Documento" value={newCliente.documento} onChange={handleClienteChange} className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input type="text" name="nombres" placeholder="Nombres" value={newCliente.nombres} onChange={handleClienteChange} className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                        <input type="text" name="apellidos" placeholder="Apellidos" value={newCliente.apellidos} onChange={handleClienteChange} className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    <input type="tel" name="telefono" placeholder="Teléfono" value={newCliente.telefono} onChange={handleClienteChange} className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500" />
                                    <input type="email" name="correo" placeholder="Correo Electrónico" value={newCliente.correo} onChange={handleClienteChange} className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500" />
                                    <input type="text" name="direccion" placeholder="Dirección" value={newCliente.direccion} onChange={handleClienteChange} className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500" />
                                    <input type="text" name="ciudad" placeholder="Ciudad" value={newCliente.ciudad} onChange={handleClienteChange} className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500" />
                                </>
                            )}

                            {/* FORMULARIO PARA EMPLEADOS */}
                            {activeTab === "empleados" && (
                                <>
                                    <input type="text" name="documento" placeholder="Número de Identificación" value={newEmpleado.documento} onChange={handleEmpleadoChange} className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input type="text" name="nombres" placeholder="Nombres" value={newEmpleado.nombres} onChange={handleEmpleadoChange} className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                        <input type="text" name="apellidos" placeholder="Apellidos" value={newEmpleado.apellidos} onChange={handleEmpleadoChange} className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    <input type="text" name="especialidad" placeholder="Especialidad" value={newEmpleado.especialidad} onChange={handleEmpleadoChange} className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500" />
                                    <input type="text" name="telefono" placeholder="Teléfono" value={newEmpleado.telefono} onChange={handleEmpleadoChange} className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500" />
                                    <input type="email" name="correo" placeholder="Correo" value={newEmpleado.correo} onChange={handleEmpleadoChange} className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500" />
                                    <input type="text" name="cargo" placeholder="Cargo" value={newEmpleado.cargo} onChange={handleEmpleadoChange} className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500" required />
                                </>
                            )}

                            <div className="flex justify-end space-x-2 mt-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEditingItem(null); }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-transform hover:scale-105"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-transform hover:scale-105"
                                >
                                    {editingItem ? "Actualizar" : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            {itemToDelete !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-sm text-center border border-gray-700">
                        <div className="text-red-500 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-200 mb-2">¿Eliminar Registro?</h2>
                        <p className="text-gray-400 mb-6 text-sm md:text-base">
                            Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este registro?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setItemToDelete(null)}
                                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-transform hover:scale-105 w-full sm:w-auto"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-transform hover:scale-105 w-full sm:w-auto"
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