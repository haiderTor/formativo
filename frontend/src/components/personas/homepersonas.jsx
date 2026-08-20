import { useState, useEffect, useMemo } from "react";

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
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

    // OBTENER CLIENTES
    useEffect(() => {
        fetch("http://localhost:3000/routes/clientes")
            .then((res) => res.json())
            .then((data) => setClientes(data))
            .catch((err) => console.error(err));
    }, []);

    // FILTRO DE BÚSQUEDA
    const filteredClientes = useMemo(() => {
        return clientes.filter((cliente) =>
            Object.values(cliente).some((val) =>
                String(val).toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, clientes]);

    const handleChange = (e) => {
        setNewCliente({ ...newCliente, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingCliente) {
            // EDITAR (Asumiendo que tu base de datos usa cliente_id)
            fetch(`http://localhost:3000/routes/clientes/${editingCliente.cliente_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCliente),
            })
                .then((res) => res.json())
                .then((updated) => {
                    setClientes(
                        clientes.map((c) =>
                            c.cliente_id === updated.cliente_id ? updated : c
                        )
                    );
                    setShowModal(false);
                    setEditingCliente(null);
                })
                .catch((err) => console.error(err));
        } else {
            // CREAR
            fetch("http://localhost:3000/routes/clientes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCliente),
            })
                .then((res) => res.json())
                .then((saved) => {
                    setClientes([...clientes, saved]);
                    setShowModal(false);
                })
                .catch((err) => console.error(err));
        }
    };

    const handleEdit = (cliente) => {
        setEditingCliente(cliente);
        setNewCliente(cliente);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm("¿Seguro que deseas borrar este cliente?")) {
            fetch(`http://localhost:3000/routes/clientes/${id}`, {
                method: "DELETE",
            })
                .then(() => {
                    setClientes(clientes.filter((c) => c.cliente_id !== id));
                })
                .catch((err) => console.error(err));
        }
    };

    return (
        <div className="p-6 bg-[#121316] min-h-screen text-white">
            {/* HEADER Y BOTONES */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Clientes</h1>
                <div className="flex flex-wrap gap-2">
                    <button className="bg-[#6c757d] hover:bg-gray-500 text-white px-4 py-2 rounded transition-transform hover:scale-105 shadow-md">
                        Importar
                    </button>
                    <button className="bg-[#2f6fed] hover:bg-blue-600 text-white px-4 py-2 rounded transition-transform hover:scale-105 shadow-md">
                        Exportar clientes
                    </button>
                    <button
                        onClick={() => {
                            setEditingCliente(null);
                            setNewCliente({
                                tipo_documento: "",
                                documento: "",
                                nombres: "",
                                apellidos: "",
                                telefono: "",
                                correo: "",
                                direccion: "",
                                ciudad: "",
                            });
                            setShowModal(true);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-transform hover:scale-105 shadow-md"
                    >
                        Crear Cliente
                    </button>
                </div>
            </div>

            {/* BUSCADOR */}
            <input
                type="text"
                placeholder="Buscar clientes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 mb-4 rounded bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* LISTA DE CLIENTES */}
            {filteredClientes.length === 0 ? (
                <div>
                    <p className="text-gray-400">No hay clientes registrados aún o no coinciden con la búsqueda.</p>
                </div>
            ) : (
                <ul className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {filteredClientes.map((cliente) => (
                        <li
                            key={cliente.cliente_id}
                            className="border border-gray-700 p-4 rounded bg-gray-800 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-lg font-bold text-blue-400 mb-2">
                                    {cliente.nombres} {cliente.apellidos}
                                </h3>
                                <p><strong>Documento:</strong> {cliente.tipo_documento} {cliente.documento}</p>
                                <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                                <p><strong>Correo:</strong> {cliente.correo}</p>
                                <p><strong>Dirección:</strong> {cliente.direccion}, {cliente.ciudad}</p>
                            </div>

                            <div className="flex space-x-2 mt-4">
                                <button
                                    onClick={() => handleEdit(cliente)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-transform hover:scale-105"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(cliente.cliente_id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-transform hover:scale-105"
                                >
                                    Borrar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* MODAL CREAR / EDITAR */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-md text-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-center text-blue-400">
                            {editingCliente ? "Editar Cliente" : "Nuevo Cliente"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <select
                                name="tipo_documento"
                                value={newCliente.tipo_documento}
                                onChange={handleChange}
                                className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Tipo de Documento...</option>
                                <option value="CC">Cédula de Ciudadanía</option>
                                <option value="TI">Tarjeta de Identidad</option>
                                <option value="CE">Cédula de Extranjería</option>
                            </select>

                            <input
                                type="text"
                                name="documento"
                                placeholder="Número de Documento"
                                value={newCliente.documento}
                                onChange={handleChange}
                                className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="nombres"
                                    placeholder="Nombres"
                                    value={newCliente.nombres}
                                    onChange={handleChange}
                                    className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="text"
                                    name="apellidos"
                                    placeholder="Apellidos"
                                    value={newCliente.apellidos}
                                    onChange={handleChange}
                                    className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <input
                                type="tel"
                                name="telefono"
                                placeholder="Teléfono"
                                value={newCliente.telefono}
                                onChange={handleChange}
                                className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="email"
                                name="correo"
                                placeholder="Correo Electrónico"
                                value={newCliente.correo}
                                onChange={handleChange}
                                className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="direccion"
                                placeholder="Dirección"
                                value={newCliente.direccion}
                                onChange={handleChange}
                                className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="ciudad"
                                placeholder="Ciudad"
                                value={newCliente.ciudad}
                                onChange={handleChange}
                                className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
                            />

                            <div className="flex justify-end space-x-2 mt-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingCliente(null);
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-transform hover:scale-105"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-transform hover:scale-105"
                                >
                                    {editingCliente ? "Actualizar" : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}