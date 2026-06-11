import { useState } from "react";

export default function ClienteForm() {
  const [formData, setFormData] = useState({
    tipo_documento: "",
    documento: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    correo: "",
    direccion: "",
    ciudad: ""
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
      const response = await fetch("http://localhost:3000/routes/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Error al registrar el cliente");
      }

      const data = await response.json();
      console.log("Cliente registrado:", data);
      setMensaje("Cliente registrado correctamente ✅");
      setFormData({
        tipo_documento: "",
        documento: "",
        nombres: "",
        apellidos: "",
        telefono: "",
        correo: "",
        direccion: "",
        ciudad: ""
      });
    } catch (err) {
      console.error(err);
      setError("No se pudo registrar el cliente ❌");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-[#121316] shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-700">Crear Cliente</h2>

      <div>
        <label className="block text-gray-600">Tipo de Documento</label>
        <select
          name="tipo_documento"
          value={formData.tipo_documento}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Seleccione...</option>
          <option value="CC">Cédula de Ciudadanía</option>
          <option value="TI">Tarjeta de Identidad</option>
          <option value="CE">Cédula de Extranjería</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-600">Documento</label>
        <input
          type="text"
          name="documento"
          value={formData.documento}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-gray-600">Nombres</label>
        <input
          type="text"
          name="nombres"
          value={formData.nombres}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-gray-600">Apellidos</label>
        <input
          type="text"
          name="apellidos"
          value={formData.apellidos}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-gray-600">Teléfono</label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-gray-600">Correo</label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-gray-600">Dirección</label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-gray-600">Ciudad</label>
        <input
          type="text"
          name="ciudad"
          value={formData.ciudad}
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
        Guardar Cliente
      </button>
    </form>
  );
}