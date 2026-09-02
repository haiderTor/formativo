import { useState, useEffect, useMemo, useRef } from "react";

export default function Equipos() {
  const [equipos, setEquipos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [marcas, setMarcas] = useState([]);
  
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("tipo_equipo");
  const [showModal, setShowModal] = useState(false);
  const [editingEquipo, setEditingEquipo] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Estados para los selectores buscables
  const [searchMarca, setSearchMarca] = useState("");
  const [showMarcasDropdown, setShowMarcasDropdown] = useState(false);
  const [searchCliente, setSearchCliente] = useState("");
  const [showClientesDropdown, setShowClientesDropdown] = useState(false);

  const [newEquipo, setNewEquipo] = useState({
    tipo_equipo: "",
    modelo: "",
    referencia: "",
    numero_serie: "",
    observaciones: "",
    marca_id: "",
    cliente_id: ""
  });

  // OBTENER DATOS (Equipos, Clientes y Marcas)
  const fetchAllData = () => {
    // Equipos
    fetch("http://localhost:3000/routes/equipo")
      .then((res) => res.json())
      .then((data) => setEquipos(data))
      .catch((err) => console.error(err));

    // Clientes (usamos la ruta general para tener acceso al documento/cédula)
    fetch("http://localhost:3000/routes/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch((err) => console.error(err));

    // Marcas (Asume que existe esta ruta en tu backend)
    fetch("http://localhost:3000/routes/marca")
      .then((res) => res.json())
      .then((data) => setMarcas(data))
      .catch((err) => console.error("Error cargando marcas:", err));
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // FILTRO Y ORDENAMIENTO DE LA TABLA
  const filteredEquipos = useMemo(() => {
    let result = equipos.filter((equipo) =>
      Object.values(equipo).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );

    if (sortOption === "asc") {
      result.sort((a, b) => (a.tipo_equipo || "").localeCompare(b.tipo_equipo || ""));
    } else if (sortOption === "desc") {
      result.sort((a, b) => (b.tipo_equipo || "").localeCompare(a.tipo_equipo || ""));
    }

    return result;
  }, [search, equipos, sortOption]);

  // MANEJO DEL FORMULARIO
  const handleChange = (e) => {
    setNewEquipo({ ...newEquipo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
      ...newEquipo,
      marca_id: parseInt(newEquipo.marca_id) || null,
      cliente_id: parseInt(newEquipo.cliente_id) || null
    };
    
    const url = editingEquipo
      ? `http://localhost:3000/routes/equipo/${editingEquipo.equipo_id}`
      : "http://localhost:3000/routes/equipo";

    const method = editingEquipo ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al procesar la solicitud");
        return res.json();
      })
      .then(() => {
        fetchAllData(); // Refresca todo para traer los nombres actualizados
        closeModal();
      })
      .catch((err) => {
        console.error(err);
        alert("Ocurrió un error al guardar el equipo.");
      });
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      fetch(`http://localhost:3000/routes/equipo/${itemToDelete}`, {
        method: "DELETE",
      })
        .then(() => {
          setEquipos(equipos.filter((eq) => eq.equipo_id !== itemToDelete));
          setItemToDelete(null);
        })
        .catch((err) => console.error(err));
    }
  };

  // ABRIR/CERRAR MODALES Y LIMPIAR ESTADOS
  const openEditModal = (equipo) => {
    setEditingEquipo(equipo);
    setNewEquipo({
      tipo_equipo: equipo.tipo_equipo || "",
      modelo: equipo.modelo || "",
      referencia: equipo.referencia || "",
      numero_serie: equipo.numero_serie || "",
      observaciones: equipo.observaciones || "",
      marca_id: equipo.marca_id || "",
      cliente_id: equipo.cliente_id || ""
    });
    // Setear los inputs de búsqueda con los nombres actuales
    setSearchMarca(equipo.nombre_marca || "");
    const nombreCompleto = equipo.cliente_nombres ? `${equipo.cliente_nombres} ${equipo.cliente_apellidos || ''}` : "";
    setSearchCliente(nombreCompleto);
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEquipo(null);
    setSearchMarca("");
    setSearchCliente("");
    setNewEquipo({
      tipo_equipo: "",
      modelo: "",
      referencia: "",
      numero_serie: "",
      observaciones: "",
      marca_id: "",
      cliente_id: ""
    });
  };

  // LÓGICA DE FILTRADO PARA DROPDOWNS
  const filteredMarcas = marcas.filter(m => 
    m.nombre?.toLowerCase().includes(searchMarca.toLowerCase())
  );
  
  const filteredClientes = clientes.filter(c => {
    const busqueda = searchCliente.toLowerCase();
    const nombreCompleto = `${c.nombres} ${c.apellidos}`.toLowerCase();
    const documento = String(c.documento || "").toLowerCase();
    
    return nombreCompleto.includes(busqueda) || documento.includes(busqueda);
  });

  return (
    <div className="p-4 sm:p-6 bg-[#0f1113] min-h-screen text-gray-200">
      {/* Header: título + acciones */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Equipos</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Select de Ordenamiento */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="tipo_equipo">Por tipo</option>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>

          {/* Buscador */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar equipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-3 pr-10 py-2 rounded-md bg-[#0b0c0d] border border-[#222] text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <svg className="w-4 h-4 text-gray-500 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>

          {/* Botón Nuevo */}
          <button
            onClick={() => {
              closeModal(); // Asegura limpiar todo
              setShowModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-sm text-sm font-semibold transition-transform hover:scale-105"
          >
            + Nuevo Equipo
          </button>
        </div>
      </div>

      {/* Tabla / Lista */}
      <div className="space-y-4">
        {/* Mobile list (cards) */}
        <ul className="md:hidden space-y-3">
          {filteredEquipos.map((equipo) => (
            <li key={equipo.equipo_id} className="border border-[#222] p-3 rounded-xl bg-[#0b0c0d]/60">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-white">{equipo.tipo_equipo}</div>
                  <div className="text-xs text-gray-400">
                    ID: {equipo.equipo_id} | Marca: {equipo.nombre_marca || equipo.marca_id || "—"}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm text-gray-300">
                  Mod: {equipo.modelo} | Ref: {equipo.referencia}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  SN: <span className="font-mono text-gray-300">{equipo.numero_serie || "—"}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">Observaciones: {equipo.observaciones || "—"}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Cliente: {equipo.cliente_nombres ? `${equipo.cliente_nombres} ${equipo.cliente_apellidos || ''}` : (equipo.cliente_id || "—")}
                </div>
              </div>

              <div className="flex items-center justify-end mt-3 gap-2">
                <button onClick={() => openEditModal(equipo)} className="text-xs px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-200 transition">Editar</button>
                <button onClick={() => setItemToDelete(equipo.equipo_id)} className="text-xs px-2 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white transition">Borrar</button>
              </div>
            </li>
          ))}
        </ul>

        {/* Desktop table */}
        <div className="hidden md:block bg-[#0b0c0d]/60 border border-[#222] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1f1f1f] flex items-center justify-between">
            <div className="text-sm text-gray-300 font-semibold">Equipos</div>
            <div className="text-xs text-gray-400">Mostrando {filteredEquipos.length} resultados</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#1f1f1f]">
              <thead className="bg-[#0f1113]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-orange-400">ID / Tipo</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">Modelo / Ref</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">Número de Serie</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">Marca / Cliente</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400">Observaciones</th>
                  <th className="px-4 py-3 text-right text-xs text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f]">
                {filteredEquipos.map((equipo) => (
                  <tr key={equipo.equipo_id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 align-top">
                      <div className="text-sm font-medium text-white">{equipo.tipo_equipo || "—"}</div>
                      <div className="text-xs text-gray-500">ID: {equipo.equipo_id}</div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="text-sm text-gray-300">{equipo.modelo || "—"}</div>
                      <div className="text-xs text-gray-500">Ref: {equipo.referencia || "—"}</div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="text-sm font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded inline-block">
                        {equipo.numero_serie || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="text-sm text-gray-300">
                        Marca: <span className="font-semibold text-white">{equipo.nombre_marca || equipo.marca_id || "—"}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Cliente: {equipo.cliente_nombres ? `${equipo.cliente_nombres} ${equipo.cliente_apellidos || ''}` : (equipo.cliente_id || "—")}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="text-sm text-gray-300">{equipo.observaciones || "—"}</div>
                    </td>
                    <td className="px-4 py-3 align-top text-right">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => openEditModal(equipo)} className="text-sm px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-200 transition">Editar</button>
                        <button onClick={() => setItemToDelete(equipo.equipo_id)} className="text-sm px-2 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white transition">Borrar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal crear/editar */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={closeModal} />
          <div className="relative w-full max-w-2xl bg-linear-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-[#222] z-10 max-h-[90vh] overflow-y-visible">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingEquipo ? "Editar Equipo" : "Nuevo Equipo"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">X</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tipo de equipo</label>
                  <input
                    type="text"
                    name="tipo_equipo"
                    placeholder="Ej: Laptop, Impresora..."
                    value={newEquipo.tipo_equipo}
                    onChange={handleChange}
                    className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Modelo</label>
                  <input
                    type="text"
                    name="modelo"
                    placeholder="Ej: A16, NUG1044F..."
                    value={newEquipo.modelo}
                    onChange={handleChange}
                    className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                {/* AUTOCOMPLETAR MARCA */}
                <div className="relative">
                  <label className="block text-xs text-gray-400 mb-1">Marca</label>
                  <input
                    type="text"
                    placeholder="Escribe la marca..."
                    value={searchMarca}
                    onChange={(e) => {
                      setSearchMarca(e.target.value);
                      setShowMarcasDropdown(true);
                      setNewEquipo({ ...newEquipo, marca_id: "" }); // Resetea ID si cambia texto
                    }}
                    onFocus={() => setShowMarcasDropdown(true)}
                    onBlur={() => setTimeout(() => setShowMarcasDropdown(false), 200)}
                    className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500"
                    autoComplete="off"
                  />
                  {showMarcasDropdown && filteredMarcas.length > 0 && (
                    <ul className="absolute z-20 w-full bg-[#1a1c20] border border-[#333] mt-1 max-h-40 overflow-y-auto rounded-md shadow-2xl">
                      {filteredMarcas.map(m => (
                        <li
                          key={m.marca_id}
                          // onMouseDown dispara antes que onBlur, evitando bugs
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSearchMarca(m.nombre);
                            setNewEquipo({ ...newEquipo, marca_id: m.marca_id });
                            setShowMarcasDropdown(false);
                          }}
                          className="px-3 py-2 text-sm text-gray-300 hover:bg-orange-600 hover:text-white cursor-pointer"
                        >
                          {m.nombre}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* AUTOCOMPLETAR CLIENTE */}
                <div className="relative">
                  <label className="block text-xs text-gray-400 mb-1">Propietario (Cédula o Nombre)</label>
                  <input
                    type="text"
                    placeholder="Ej: 10023... o Juan..."
                    value={searchCliente}
                    onChange={(e) => {
                      setSearchCliente(e.target.value);
                      setShowClientesDropdown(true);
                      setNewEquipo({ ...newEquipo, cliente_id: "" });
                    }}
                    onFocus={() => setShowClientesDropdown(true)}
                    onBlur={() => setTimeout(() => setShowClientesDropdown(false), 200)}
                    className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500"
                    autoComplete="off"
                  />
                  {showClientesDropdown && filteredClientes.length > 0 && (
                    <ul className="absolute z-20 w-full bg-[#1a1c20] border border-[#333] mt-1 max-h-40 overflow-y-auto rounded-md shadow-2xl">
                      {filteredClientes.map(c => (
                        <li
                          key={c.cliente_id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSearchCliente(`${c.nombres} ${c.apellidos}`);
                            setNewEquipo({ ...newEquipo, cliente_id: c.cliente_id });
                            setShowClientesDropdown(false);
                          }}
                          className="px-3 py-2 text-sm text-gray-300 hover:bg-orange-600 hover:text-white cursor-pointer border-b border-[#222] last:border-0"
                        >
                          <div className="font-semibold text-white">{c.nombres} {c.apellidos}</div>
                          <div className="text-xs text-gray-500">C.C: {c.documento || 'N/A'}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Referencia</label>
                  <input
                    type="text"
                    name="referencia"
                    placeholder="Ej: TUFF"
                    value={newEquipo.referencia}
                    onChange={handleChange}
                    className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Número de Serie</label>
                  <input
                    type="text"
                    name="numero_serie"
                    placeholder="Ej: 102544812"
                    value={newEquipo.numero_serie}
                    onChange={handleChange}
                    className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Observaciones</label>
                <input
                  type="text"
                  name="observaciones"
                  placeholder="Observaciones del equipo..."
                  value={newEquipo.observaciones}
                  onChange={handleChange}
                  className="w-full bg-[#0b0c0d] border border-[#222] rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-md bg-white/5 text-gray-200 hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                {/* Deshabilitamos el botón si no han seleccionado una marca y cliente válidos del listado */}
                <button
                  type="submit"
                  disabled={!newEquipo.marca_id || !newEquipo.cliente_id}
                  className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {editingEquipo ? "Guardar cambios" : "Crear equipo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de eliminación se mantiene igual... */}
      {itemToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setItemToDelete(null)} />
          <div className="relative w-full max-w-sm bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-[#222] z-10 text-center">
            <h3 className="text-lg font-bold text-white mb-2">¿Eliminar Equipo?</h3>
            <p className="text-gray-400 mb-6 text-sm">Esta acción no se puede deshacer.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setItemToDelete(null)} className="px-4 py-2 rounded-md bg-white/5 text-gray-200 hover:bg-white/10 transition-colors w-full sm:w-auto">Cancelar</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-transform hover:scale-105 w-full sm:w-auto">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}