import { useState } from "react";

export default function EquipoForm() {
    const [formData, setFormData] = useState({
        tipo_equipo: "",
        modelo: "",
        referencia: "",
        numero_serie: "",
        estado: "",
        marca_id: "",
        cliente_id: ""
    });

    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(null);
        setError(null);

        try {
            const response = await fetch("http://localhost:3000/routes/equipo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Error al registrar el cliente");
            }

            const data = await response.json();
            console.log("Equipo registrado:", data);
            setMensaje("Equipo registrado correctamente ✅");
            setFormData({
                tipo_equipo: "",
                modelo: "",
                referencia: "",
                numero_serie: "",
                estado: "",
                marca_id: "",
                cliente_id: ""
            });
        } catch (err) {
            console.error(err);
            setError("No se pudo registrar el equipo ❌");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto bg-[#191a1d] shadow-md rounded-lg p-6 space-y-4"
        >
            <h2 className="text-xl font-bold text-white">Crear equipo</h2>

            <div>
                <label className="block text-white-600">Tipo de equipo</label>
                <input
                    type="text"
                    name="tipo_equipo"
                    value={formData.tipo_equipo}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-white-600">Modelo</label>
                <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-white-600">Referencia</label>
                <input
                    type="text"
                    name="referencia"
                    value={formData.referencia}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-white-600">Numero de serie</label>
                <input
                    type="text"
                    name="numero_serie"
                    value={formData.numero_serie}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-white-600">Estado</label>
                <input
                    type="text"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-white-600">Marca</label>
                <input
                    type="text"
                    name="marca_id"
                    value={formData.marca_id}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-white-600">Propietario</label>
                <input
                    type="text"
                    name="cliente_id"
                    value={formData.cliente_id}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                Guardar Equipo
            </button>
        </form>
    );
}