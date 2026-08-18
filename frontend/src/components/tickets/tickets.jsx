import { useState, useEffect, useMemo } from "react";

export default function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newTicket, setNewTicket] = useState({
    fecha_creacion: "",
    descripcion_falla: "",
    diagnostico: "",
    estado_ticket: "",
    observaciones: "",
    equipo_id: "",
    empleado_id: "",
});

    useEffect(() => {
        fetch("http://localhost:3000/routes/tickets")
        .then((res) => res.json())
        .then((data) => setTickets(data))
        .catch((err) => console.error(err));
    }, []);

    const filteredTickets = useMemo(() => {
        return tickets.filter((ticket) =>
        Object.values(ticket).some((val) =>
            String(val).toLowerCase().includes(search.toLowerCase())
        )
        );
    }, [search, tickets]);

    const handleChange = (e) => {
        setNewTicket({ ...newTicket, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:3000/routes/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
        })
        .then((res) => res.json())
        .then((saved) => {
            setTickets([...tickets, saved]);
            setShowModal(false);
        })
        .catch((err) => console.error(err));
    };

    return (
        <div className="p-6 bg-[#121316] min-h-screen text-white">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Tickets</h1>
            {tickets.length > 0 && (
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-transform hover:scale-105"
            >
                Crear Ticket
            </button>
            )}
        </div>

        <input
            type="text"
            placeholder="Buscar tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 mb-4 rounded bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {filteredTickets.length === 0 ? (
            <div>
            <p className="text-gray-400">No hay tickets creados aún.</p>
            <button
                onClick={() => setShowModal(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-transform hover:scale-105"
            >
                Crear Ticket
            </button>
            </div>
        ) : (
            <ul className="space-y-3">
            {filteredTickets.map((ticket) => (
                <li
                key={ticket.ticket_id}
                className="border border-gray-700 p-3 rounded bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                >
                <p><strong>ID:</strong> {ticket.ticket_id}</p>
                <p><strong>Fecha:</strong> {ticket.fecha_creacion}</p>
                <p><strong>Descripción:</strong> {ticket.descripcion_falla}</p>
                <p><strong>Diagnóstico:</strong> {ticket.diagnostico}</p>
                <p><strong>Estado:</strong> {ticket.estado_ticket}</p>
                <p><strong>Observaciones:</strong> {ticket.observaciones}</p>
                <p><strong>Equipo:</strong> {ticket.nombre_equipo}</p>
                <p><strong>Cliente:</strong> {ticket.cliente_nombre} {ticket.cliente_apellido}</p>
                <p><strong>Empleado:</strong> {ticket.empleado_nombre} {ticket.empleado_apellido}</p>
                </li>
            ))}
            </ul>
        )}

        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl w-96 text-gray-200">
                <h2 className="text-xl font-bold mb-4 text-center text-blue-400">Nuevo Ticket</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="date"
                    name="fecha_creacion"
                    value={newTicket.fecha_creacion}
                    onChange={handleChange}
                    className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="descripcion_falla"
                    placeholder="Descripción de la falla"
                    value={newTicket.descripcion_falla}
                    onChange={handleChange}
                    className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="diagnostico"
                    placeholder="Diagnóstico"
                    value={newTicket.diagnostico}
                    onChange={handleChange}
                    className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="estado_ticket"
                    placeholder="Estado"
                    value={newTicket.estado_ticket}
                    onChange={handleChange}
                    className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="observaciones"
                    placeholder="Observaciones"
                    value={newTicket.observaciones}
                    onChange={handleChange}
                    className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    name="equipo_id"
                    placeholder="Equipo ID"
                    value={newTicket.equipo_id}
                    onChange={handleChange}
                    className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    name="empleado_id"
                    placeholder="Empleado ID"
                    value={newTicket.empleado_id}
                    onChange={handleChange}
                    className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex justify-end space-x-2 mt-4">
                    <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-transform hover:scale-105"
                    >
                    Cancelar
                    </button>
                    <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-transform hover:scale-105"
                    >
                    Guardar
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}
        </div>
    );
}
