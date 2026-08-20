import { useState, useEffect, useMemo } from "react";

export default function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("nombre");
  const [showModal, setShowModal] = useState(false);
  const [editingServicio, setEditingServicio] = useState(null);
  const [newServicio, setNewServicio] = useState({
    nombre: "",
    descripcion: "",
    precio_base: "",
    observaciones: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/routes/servicios")
      .then((res) => res.json())
      .then((data) => setServicios(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredServicios = useMemo(() => {
    let result = servicios.filter((servicio) =>
      Object.values(servicio).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );

    if (sortOption === "asc") {
      result.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (sortOption === "desc") {
      result.sort((a, b) => b.nombre.localeCompare(a.nombre));
    }

    return result;
  }, [search, servicios, sortOption]);

  const handleChange = (e) => {
    setNewServicio({ ...newServicio, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingServicio
      ? `http://localhost:3000/routes/servicios/${editingServicio.servicio_id}`
      : "http://localhost:3000/routes/servicios";

    const method = editingServicio ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newServicio),
    })
      .then((res) => res.json())
      .then((saved) => {
        if (editingServicio) {
          setServicios(
            servicios.map((s) =>
              s.servicio_id === saved.servicio_id ? saved : s
            )
          );
        } else {
          setServicios([...servicios, saved]);
        }
        setShowModal(false);
        setEditingServicio(null);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/routes/servicios/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setServicios(servicios.filter((s) => s.servicio_id !== id));
      })
      .catch((err) => console.error(err));
  };

  const openEditModal = (servicio) => {
    setEditingServicio(servicio);
    setNewServicio(servicio);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-[#121316] min-h-screen text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Servicios</h1>
        <button
          onClick={() => {
            setNewServicio({
              nombre: "",
              descripcion: "",
              precio_base: "",
              observaciones: "",
            });
            setEditingServicio(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-transform hover:scale-105"
        >
          Crear Servicio
        </button>
      </div>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Buscar servicios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 rounded bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500"
        >
          <option value="nombre">Por nombre</option>
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </div>

      {filteredServicios.length === 0 ? (
        <p className="text-gray-400">No hay servicios creados aún.</p>
      ) : (
        <ul className="space-y-3">
          {filteredServicios.map((servicio) => (
            <li
              key={servicio.servicio_id}
              className="border border-gray-700 p-3 rounded bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
            >
              <p><strong>ID:</strong> {servicio.servicio_id}</p>
              <p><strong>Nombre:</strong> {servicio.nombre}</p>
              <p><strong>Descripción:</strong> {servicio.descripcion}</p>
              <p><strong>Precio Base:</strong> {servicio.precio_base}</p>
              <p><strong>Observaciones:</strong> {servicio.observaciones}</p>

              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => openEditModal(servicio)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(servicio.servicio_id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl w-96 text-gray-200">
            <h2 className="text-xl font-bold mb-4 text-center text-blue-400">
              {editingServicio ? "Editar Servicio" : "Nuevo Servicio"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={newServicio.nombre}
                onChange={handleChange}
                className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="descripcion"
                placeholder="Descripción"
                value={newServicio.descripcion}
                onChange={handleChange}
                className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="precio_base"
                placeholder="Precio Base"
                value={newServicio.precio_base}
                onChange={handleChange}
                className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="observaciones"
                placeholder="Observaciones"
                value={newServicio.observaciones}
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
