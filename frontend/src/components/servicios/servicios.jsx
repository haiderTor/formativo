import { useState, useEffect, useMemo } from "react";

export default function Servicios() {
  // guardar los servicios que llegan de la base de datos
  const [servicios, setServicios] = useState([]);
  
  // guardar el texto para buscar servicios
  const [search, setSearch] = useState("");
  
  // saber como organizar la lista
  const [sortOption, setSortOption] = useState("nombre");
  
  // controlar si la ventana del formulario se ve o no
  const [showModal, setShowModal] = useState(false);
  
  // guardar los datos del servicio a editar
  const [editingServicio, setEditingServicio] = useState(null);
  
  // guardar cual servicio para borrar
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // un molde vacio para llenar al crear o editar un servicio
  const [newServicio, setNewServicio] = useState({
    nombre: "",
    descripcion: "",
    precio_base: "",
    observaciones: "",
  });

  // pedir los servicios al servidor apenas carga la pagina
  useEffect(() => {
    fetch("http://localhost:3000/routes/servicios")
      .then((res) => res.json())
      .then((data) => setServicios(data))
      .catch((err) => console.error(err));
  }, []);

  // filtrar la lista segun lo que se escriba en el buscador y ordenarla alfabeticamente
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

  // guarda formulario
  const handleChange = (e) => {
    setNewServicio({ ...newServicio, [e.target.name]: e.target.value });
  };

  // enviar los datos para crear un servicio nuevo o actualizar uno que ya existe
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

  // borrar el servicio de la base de datos definitivamente
  const confirmDelete = () => {
    if (itemToDelete) {
      fetch(`http://localhost:3000/routes/servicios/${itemToDelete}`, {
        method: "DELETE",
      })
        .then(() => {
          setServicios(servicios.filter((s) => s.servicio_id !== itemToDelete));
          setItemToDelete(null);
        })
        .catch((err) => console.error(err));
    }
  };

  // abrir la ventana con los datos del servicio listos para modificar
  const openEditModal = (servicio) => {
    setEditingServicio(servicio);
    setNewServicio(servicio);
    setShowModal(true);
  };

  // cerrar la ventana y limpiar las casillas del formulario
  const closeModal = () => {
    setShowModal(false);
    setEditingServicio(null);
    setNewServicio({
      nombre: "",
      descripcion: "",
      precio_base: "",
      observaciones: "",
    });
  };

  return (
    <div className="p-4 sm:p-6 bg-[#0f1113] min-h-screen text-gray-200">
      
      {/* parte de arriba con titulo buscador y boton de crear */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Servicios</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="nombre">Por nombre</option>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>

          
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-3 pr-10 py-2 rounded-md bg-[#0b0c0d] border border-[#222] text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <svg className="w-4 h-4 text-gray-500 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>

          
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
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-sm text-sm font-semibold transition-transform hover:scale-105"
          >
            + Nuevo Servicio
          </button>
        </div>
      </div>

      <div className="space-y-4">
        
        {/* diseño en forma de tarjetas para cuando se ve desde un celular */}
        <ul className="md:hidden space-y-3">
          {filteredServicios.map((servicio) => (
            <li key={servicio.servicio_id} className="border border-[#222] p-3 rounded-xl bg-[#0b0c0d]/60">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-white">{servicio.nombre}</div>
                  <div className="text-xs text-gray-400">ID: {servicio.servicio_id}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-700 text-white">
                    ${servicio.precio_base}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm text-gray-300 line-clamp-2">{servicio.descripcion || "—"}</div>
                <div className="text-xs text-gray-500 mt-1">{servicio.observaciones || "—"}</div>
              </div>

              <div className="flex items-center justify-end mt-3 gap-2">
                <button onClick={() => openEditModal(servicio)} className="text-xs px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-200 transition">Editar</button>
                <button onClick={() => setItemToDelete(servicio.servicio_id)} className="text-xs px-2 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white transition">Borrar</button>
              </div>
            </li>
          ))}
          {filteredServicios.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500 bg-[#0b0c0d]/60 border border-[#222] rounded-xl">
              No hay servicios creados aún o no coinciden con la búsqueda.
            </div>
          )}
        </ul>

        {/* tabla grande para cuando se ve desde un computador */}
        <div className="hidden md:block bg-[#0b0c0d]/60 border border-[#222] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1f1f1f] flex items-center justify-between">
            <div className="text-sm text-gray-300 font-semibold">Servicios</div>
            <div className="text-xs text-gray-400">Mostrando {filteredServicios.length} resultados</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#1f1f1f]">
              <thead className="bg-[#0f1113]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-orange-400">ID</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">Descripción</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">Precio Base</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">Observaciones</th>
                  <th className="px-4 py-3 text-right text-xs text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f]">
                {filteredServicios.map((servicio) => (
                  <tr key={servicio.servicio_id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 align-top w-24">
                      <div className="text-sm font-medium text-white">{servicio.servicio_id}</div>
                    </td>
                    <td className="px-4 py-3 align-top w-48">
                      <div className="text-sm text-white font-medium">{servicio.nombre}</div>
                    </td>
                    <td className="px-4 py-3 align-top max-w-xs">
                      <div className="text-sm text-gray-300 line-clamp-2">{servicio.descripcion || "—"}</div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-700 text-white">
                        ${servicio.precio_base}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top max-w-xs">
                      <div className="text-sm text-gray-400 line-clamp-2">{servicio.observaciones || "—"}</div>
                    </td>
                    <td className="px-4 py-3 align-top text-right">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => openEditModal(servicio)} className="text-sm px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-200 transition">Editar</button>
                        <button onClick={() => setItemToDelete(servicio.servicio_id)} className="text-sm px-2 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white transition">Borrar</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredServicios.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-gray-500">No se encontraron servicios</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ventana flotante donde lleno los datos para guardar o editar */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={closeModal} />
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-[#222] z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingServicio ? "Editar Servicio" : "Nuevo Servicio"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">X</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Nombre del Servicio</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Mantenimiento Preventivo"
                    value={newServicio.nombre}
                    onChange={handleChange}
                    className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Precio Base</label>
                  <input
                    type="number"
                    name="precio_base"
                    placeholder="Ej: 50000"
                    value={newServicio.precio_base}
                    onChange={handleChange}
                    className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  placeholder="Descripción detallada del servicio..."
                  value={newServicio.descripcion}
                  onChange={handleChange}
                  className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Observaciones</label>
                <input
                  type="text"
                  name="observaciones"
                  placeholder="Notas adicionales..."
                  value={newServicio.observaciones}
                  onChange={handleChange}
                  className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500"
                />
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
                  {editingServicio ? "Guardar cambios" : "Crear servicio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* adveertencia si de verdad quiero borrar el servicio */}
      {itemToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setItemToDelete(null)} />
          <div className="relative w-full max-w-sm bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-[#222] z-10 text-center">
            <div className="text-red-500 mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">¿Eliminar Servicio?</h3>
            <p className="text-gray-400 mb-6 text-sm">
              Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este servicio?
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