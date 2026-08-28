import { useState, useEffect, useMemo } from "react";

export default function Tickets() {
    //Declaración de estados (Variables de ReactState)
    const [tickets, setTickets] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All"); // All, Open, In Progress, Pending, Resolved
    //Estado para el formulario de creación/edición de tickets
    const [newTicket, setNewTicket] = useState({
        ticket_id: null,
        fecha_creacion: "",
        descripcion_falla: "",
        diagnostico: "",
        estado_ticket: "Open",
        observaciones: "",
        equipo_id: "",
        empleado_id: "",
        prioridad: "Medium",
        cliente_nombre: "",
        cliente_email: "",
        updated_at: "",
        tiempo_respuesta_min: null,
    });
    //Fetch de tickets desde el backend al cargar el componente
    useEffect(() => {
        fetch("http://localhost:3000/routes/tickets")
            .then((res) => res.json())
            .then((data) => {
                const normalized = (data || []).map((t) => ({
                    ticket_id: t.ticket_id ?? t.id ?? `TK-${Math.floor(Math.random() * 10000)}`,
                    descripcion_falla: t.descripcion_falla ?? t.descripcion ?? "",
                    estado_ticket: t.estado_ticket ?? t.status ?? "Open",
                    prioridad: t.prioridad ?? t.priority ?? "Medium",
                    cliente_nombre: t.cliente_nombre ?? t.nombre ?? t.cliente?.nombre ?? "",
                    cliente_email: t.cliente_email ?? t.email ?? t.cliente?.email ?? "",
                    fecha_creacion: t.fecha_creacion ?? t.created_at ?? new Date().toISOString(),
                    updated_at: t.updated_at ?? t.updatedAt ?? new Date().toISOString(),
                    tiempo_respuesta_min: t.tiempo_respuesta_min ?? t.response_time_min ?? null,
                    ...t,
                }));
                setTickets(normalized);
            })
            .catch((err) => console.error(err));
    }, []);

    const filteredTickets = useMemo(() => {
        const q = search.trim().toLowerCase();
        return tickets
            .filter((ticket) => {
                if (activeFilter !== "All") {
                    const map = {
                        Open: ["open", "abierto"],
                        "In Progress": ["in progress", "en progreso", "inprogress"],
                        Pending: ["pending", "pendiente"],
                        Resolved: ["resolved", "resuelto"],
                    };
                    const allowed = map[activeFilter] ?? [];
                    if (!allowed.some((a) => String(ticket.estado_ticket).toLowerCase().includes(a))) return false;
                }
                if (!q) return true;
                const hay = [
                    ticket.ticket_id,
                    ticket.descripcion_falla,
                    ticket.cliente_nombre,
                    ticket.cliente_email,
                    ticket.prioridad,
                    ticket.estado_ticket,
                ]
                    .filter(Boolean)
                    .some((val) => String(val).toLowerCase().includes(q));
                return hay;
            })
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    }, [search, tickets, activeFilter]);

    const stats = useMemo(() => {
        const open = tickets.filter((t) => /open|abierto/i.test(String(t.estado_ticket))).length;
        const inProgress = tickets.filter((t) => /in progress|en progreso|inprogress/i.test(String(t.estado_ticket))).length;
        const pending = tickets.filter((t) => /pending|pendiente/i.test(String(t.estado_ticket))).length;
        const resolved = tickets.filter((t) => /resolved|resuelto/i.test(String(t.estado_ticket))).length;

        const today = new Date();
        const resolvedToday = tickets.filter((t) => {
            if (!t.updated_at) return false;
            const d = new Date(t.updated_at);
            return /resolved|resuelto/i.test(String(t.estado_ticket)) &&
                d.getFullYear() === today.getFullYear() &&
                d.getMonth() === today.getMonth() &&
                d.getDate() === today.getDate();
        }).length;

        const times = tickets.map((t) => Number(t.tiempo_respuesta_min)).filter((n) => !isNaN(n) && n > 0);
        const avgResponseMin = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;

        const urgent = tickets.filter((t) => /critical|high|alta|critico/i.test(String(t.prioridad))).length;

        return { abiertos: open, EnProgreso: inProgress, pending, resolved, resolvedToday, avgResponseMin, urgentes: urgent };
    }, [tickets]);

    const formatTimeAgo = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        const now = new Date();
        const diff = Math.floor((now - d) / 1000);
        if (diff < 60) return "Ahora";
        if (diff < 3600) return `${Math.floor(diff / 60)}m`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
        return d.toLocaleDateString();
    };

    const priorityBadge = (p) => {
        const pr = String(p ?? "").toLowerCase();
        if (/critical|critico/i.test(pr)) return "bg-red-600 text-white";
        if (/high|alta/i.test(pr)) return "bg-orange-500 text-white";
        if (/medium|media/i.test(pr)) return "bg-yellow-400 text-black";
        return "bg-gray-600 text-white";
    };

    const statusBadge = (s) => {
        const st = String(s ?? "").toLowerCase();
        if (/open|abierto/i.test(st)) return "bg-emerald-600 text-white";
        if (/in progress|en progreso|inprogress/i.test(st)) return "bg-indigo-500 text-white";
        if (/pending|pendiente/i.test(st)) return "bg-amber-500 text-black";
        if (/resolved|resuelto/i.test(st)) return "bg-gray-700 text-white";
        return "bg-gray-600 text-white";
    };

    const openNewTicket = () => {
        setEditingTicket(null);
        setNewTicket({
            ticket_id: null,
            fecha_creacion: new Date().toISOString(),
            descripcion_falla: "",
            diagnostico: "",
            estado_ticket: "Open",
            observaciones: "",
            equipo_id: "",
            empleado_id: "",
            prioridad: "Medium",
            cliente_nombre: "",
            cliente_email: "",
            updated_at: new Date().toISOString(),
            tiempo_respuesta_min: null,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTicket(null);
    };

    const handleChange = (e) => {
        setNewTicket({ ...newTicket, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...newTicket, fecha_creacion: newTicket.fecha_creacion || new Date().toISOString(), updated_at: new Date().toISOString() };

        if (editingTicket) {
            fetch(`http://localhost:3000/routes/tickets/${editingTicket.ticket_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then((res) => res.json())
                .then((updated) => {
                    setTickets((prev) => prev.map((t) => (t.ticket_id === updated.ticket_id ? updated : t)));
                    closeModal();
                })
                .catch((err) => console.error(err));
        } else {
            fetch("http://localhost:3000/routes/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then((res) => res.json())
                .then((saved) => {
                    const normalized = { ticket_id: saved.ticket_id ?? saved.id ?? `TK-${Math.floor(Math.random() * 10000)}`, ...saved };
                    setTickets((prev) => [normalized, ...prev]);
                    closeModal();
                })
                .catch((err) => console.error(err));
        }
    };

    const handleEdit = (ticket) => {
        setEditingTicket(ticket);
        setNewTicket({
            ...ticket,
            fecha_creacion: ticket.fecha_creacion ?? ticket.created_at ?? new Date().toISOString(),
            updated_at: ticket.updated_at ?? new Date().toISOString(),
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            fetch(`http://localhost:3000/routes/tickets/${itemToDelete}`, { method: "DELETE" })
                .then(() => {
                    setTickets((prev) => prev.filter((t) => t.ticket_id !== itemToDelete));
                    setItemToDelete(null);
                })
                .catch((err) => console.error(err));
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-[#0f1113] min-h-screen text-gray-200">
            {/* Header: título + acciones */} 
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Tickets</h1>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    {/* Pestañas / filtros */}
                    <div className="flex flex-wrap gap-2 items-center bg-[#121316]/40 backdrop-blur-sm rounded-md p-1">
                        {["Todo", "Abiertos", "En Progreso", "Pendientes", "Resueltos"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveFilter(tab === "Todo" ? "All" : tab === "Abiertos" ? "Open" : tab === "En Progreso" ? "In Progress" : tab === "Pendientes" ? "Pending" : "Resolved")}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition whitespace-nowrap ${
                                    activeFilter === (tab === "Todo" ? "All" : tab === "Abiertos" ? "Open" : tab === "En Progreso" ? "In Progress" : tab === "Pendientes" ? "Pending" : "Resolved")
                                        ? "bg-linear-to-r from-orange-600 to-orange-400 text-white shadow"
                                        : "text-gray-300 hover:bg-white/5"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Buscador */}
                    <div className="relative w-full sm:w-64">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar tickets, cliente, id..."
                            className="w-full pl-3 pr-10 py-2 rounded-md bg-[#0b0c0d] border border-[#222] text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <svg className="w-4 h-4 text-gray-500 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>
                    </div>

                    {/* Botón nuevo */}
                    <button
                        onClick={openNewTicket}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-sm text-sm font-semibold transition-transform hover:scale-105"
                    >
                        + Nuevo ticket
                    </button>
                </div>
            </div>

            {/* Cards métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-[#121316]/60 backdrop-blur-sm rounded-xl border border-[#222]">
                    <div className="text-sm text-gray-400">Tickets abiertos</div>
                    <div className="flex items-baseline justify-between">
                        <div className="text-2xl font-bold text-white">{stats.abiertos}</div>
                        <div className="text-sm text-green-400">20</div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">En cola</div>
                </div>

        <div className="p-4 bg-[#121316]/60 backdrop-blur-sm rounded-xl border border-[#222]">
            <div className="text-sm text-gray-400">En progreso</div>
            <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-white">{stats.EnProgreso}</div>
            <div className="text-sm text-green-400">{stats.urgentes} urgentes</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">Asignados</div>
        </div>

        <div className="p-4 bg-[#121316]/60 backdrop-blur-sm rounded-xl border border-[#222]">
            <div className="text-sm text-gray-400">Pendientes</div>
            <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-white">
                {stats.avgResponseMin ? `${Math.floor(stats.avgResponseMin / 60)}h ${stats.avgResponseMin % 60}m` : "—"}
            </div>
            <div className="text-sm text-green-400">12</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">Promedio</div>
        </div>

        <div className="p-4 bg-[#121316]/60 backdrop-blur-sm rounded-xl border border-[#222]">
            <div className="text-sm text-gray-400">Resueltos hoy</div>
            <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-white">{stats.resolvedToday}</div>
            <div className="text-sm text-green-400">5</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">Cerrados</div>
        </div>
        </div>

            {/* Tabla principal: en mobile mostramos tarjetas, en md+ la tabla */}
            <div className="space-y-4">
                {/* Mobile list (cards) */}
                <ul className="md:hidden space-y-3">
                    {filteredTickets.map((t) => (
                        <li key={t.ticket_id} className="border border-[#222] p-3 rounded-xl bg-[#0b0c0d]/60">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-sm font-medium text-white">{t.ticket_id}</div>
                                    <div className="text-xs text-gray-400">{new Date(t.fecha_creacion).toLocaleDateString()}</div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${priorityBadge(t.prioridad)}`}>
                                        {t.prioridad}
                                    </span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(t.estado_ticket)}`}>
                                        {t.estado_ticket}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="text-sm text-white font-medium">{t.cliente_nombre || "—"}</div>
                                <div className="text-xs text-gray-400">{t.cliente_email || "—"}</div>
                                <div className="text-sm text-gray-300 mt-2 line-clamp-3">{t.descripcion_falla}</div>
                            </div>

                            <div className="flex items-center justify-between mt-3 gap-2">
                                <div className="text-xs text-gray-400">{formatTimeAgo(t.updated_at)}</div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleEdit(t)} className="text-xs px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-200">Editar</button>
                                    <button onClick={() => handleDelete(t.ticket_id)} className="text-xs px-2 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white">Borrar</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Desktop table */}
                <div className="hidden md:block bg-[#0b0c0d]/60 border border-[#222] rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#1f1f1f] flex items-center justify-between">
                        <div className="text-sm text-gray-300 font-semibold">Tickets</div>
                        <div className="text-xs text-gray-400">Mostrando {filteredTickets.length} resultados</div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#1f1f1f]">
                            <thead className="bg-[#0f1113]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs text-orange-400">ID</th>
                                    <th className="px-4 py-3 text-left text-xs text-gray-400">Cliente / Asunto</th>
                                    <th className="px-4 py-3 text-left text-xs text-gray-400">Prioridad</th>
                                    <th className="px-4 py-3 text-left text-xs text-gray-400">Estado</th>
                                    <th className="px-4 py-3 text-left text-xs text-gray-400">Última actualización</th>
                                    <th className="px-4 py-3 text-right text-xs text-gray-400">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#1f1f1f]">
                                {filteredTickets.map((t) => (
                                    <tr key={t.ticket_id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 align-top w-36">
                                            <div className="text-sm font-medium text-white">{t.ticket_id}</div>
                                            <div className="text-xs text-gray-500">{new Date(t.fecha_creacion).toLocaleDateString()}</div>
                                        </td>

                                        <td className="px-4 py-3 align-top max-w-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <div className="text-sm text-white font-medium">{t.cliente_nombre || "—"}</div>
                                                    <div className="text-xs text-gray-400">{t.cliente_email || "—"}</div>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-300 mt-2 line-clamp-2">{t.descripcion_falla}</div>
                                        </td>

                                        <td className="px-4 py-3 align-top">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${priorityBadge(t.prioridad)}`}>
                                                {t.prioridad}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 align-top">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(t.estado_ticket)}`}>
                                                {t.estado_ticket}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 align-top">
                                            <div className="text-sm text-gray-300">{formatTimeAgo(t.updated_at)}</div>
                                            <div className="text-xs text-gray-500">{new Date(t.updated_at).toLocaleString()}</div>
                                        </td>

                                        <td className="px-4 py-3 align-top text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <button onClick={() => handleEdit(t)} className="text-sm px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-200 transition">Editar</button>
                                                <button onClick={() => handleDelete(t.ticket_id)} className="text-sm px-2 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white transition">Borrar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredTickets.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-6 text-center text-gray-500">No se encontraron tickets</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal crear/editar: responsive */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60" onClick={closeModal} />
                    <div className="relative w-full max-w-3xl md:max-w-4xl lg:max-w-5xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-[#222] z-10 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">{editingTicket ? "Editar ticket" : "Nuevo ticket"}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white">X</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Nombre del Cliente</label>
                                    <input 
                                        name="cliente_nombre" 
                                        value={newTicket.cliente_nombre} 
                                        onChange={handleChange} 
                                        placeholder="Ej: Juan Perez" 
                                        className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Correo Electrónico</label>
                                    <input 
                                        name="cliente_email" 
                                        type="email"
                                        value={newTicket.cliente_email} 
                                        onChange={handleChange} 
                                        placeholder="Ej: juan@ejemplo.com" 
                                        className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Descripción de la Falla</label>
                                <textarea 
                                    name="descripcion_falla" 
                                    value={newTicket.descripcion_falla} 
                                    onChange={handleChange} 
                                    placeholder="Describe el problema reportado..." 
                                    rows="4" 
                                    className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" 
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Prioridad</label>
                                    <select 
                                        name="prioridad" 
                                        value={newTicket.prioridad} 
                                        onChange={handleChange} 
                                        className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="Critical">Crítica</option>
                                        <option value="High">Alta</option>
                                        <option value="Medium">Media</option>
                                        <option value="Low">Baja</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Estado</label>
                                    <select 
                                        name="estado_ticket" 
                                        value={newTicket.estado_ticket} 
                                        onChange={handleChange} 
                                        className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="Open">Abierto</option>
                                        <option value="In Progress">En Progreso</option>
                                        <option value="Pending">Pendiente</option>
                                        <option value="Resolved">Resuelto</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">ID del Equipo</label>
                                    <input 
                                        name="equipo_id" 
                                        value={newTicket.equipo_id} 
                                        onChange={handleChange} 
                                        placeholder="Ej: 123" 
                                        className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500" 
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={closeModal} 
                                    className="px-4 py-2 rounded-md bg-white/5 text-gray-200 hover:bg-white/10 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-transform hover:scale-105"
                                >
                                    {editingTicket ? "Guardar cambios" : "Crear ticket"}
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
                        <h3 className="text-lg font-bold text-white mb-2">¿Eliminar Ticket?</h3>
                        <p className="text-gray-400 mb-6 text-sm">
                            Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este ticket?
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