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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del cliente:", formData);
    // Aquí podrías enviar los datos al backend con fetch/axios
  };
return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
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

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Guardar Cliente
      </button>
    </form>
  );
}