import { useState } from "react";

export default function EmpleadoForm() {
    // crear un molde vacio para guardar los datos del empleado 
    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        especialidad: "",
        telefono: "",
        correo: "",
        cargo: ""
    });

    // guarda formulario 
    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    // enviar los datos al servidor para guardar el empleado
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        // hacer la peticion al servidor para guardar los datos
        const response = await fetch("http://localhost:3000/routes/empleado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        // si se guardo bien mostrar un aviso y dejar las casillas en blanco otra vez
        if (data.success) {
            alert("Empleado registrado correctamente");
            setFormData({
            nombres: "",
            apellidos: "",
            especialidad: "",
            telefono: "",
            correo: "",
            cargo: ""
            });
        } else {
            alert("Error al registrar empleado");
        }
        } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión con el servidor");
        }
    };

    return (
        // diseño visual de la caja del formulario y sus casillas
        <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-[#191a1d] shadow-md rounded-lg p-6 space-y-4"
        >
        <h2 className="text-xl font-bold mb-4">Registrar Empleado</h2>

        <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            placeholder="Nombres"
            className="w-full border rounded px-3 py-2"
        />

        <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            placeholder="Apellidos"
            className="w-full border rounded px-3 py-2"
        />

        <input
            type="text"
            name="especialidad"
            value={formData.especialidad}
            onChange={handleChange}
            placeholder="Especialidad"
            className="w-full border rounded px-3 py-2"
        />

        <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            className="w-full border rounded px-3 py-2"
        />

        <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="Correo"
            className="w-full border rounded px-3 py-2"
        />

        <input
            type="text"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            placeholder="Cargo"
            className="w-full border rounded px-3 py-2"
        />

        <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
            Guardar Empleado
        </button>
        </form>
    );
}