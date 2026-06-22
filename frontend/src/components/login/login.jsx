import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [correoRegistro, setCorreoRegistro] = useState("");
  const [contrasenaRegistro, setContrasenaRegistro] = useState("");
  const [verificacion, setVerificacion] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }
      navigate("/app");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (contrasenaRegistro !== verificacion) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/routes/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          nombre_usuario: usuario,
          correo: correoRegistro,
          contrasena: contrasenaRegistro,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en el registro");
      }

      const data = await response.json();
      console.log("Usuario registrado:", data);

      setShowModal(false);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-orange-600">
      {/* Panel principal con efecto blur */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">
          Bienvenido 👋
        </h2>
        <p className="text-center text-gray-200 mb-6">
          Ingresa tus credenciales para continuar
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="correo"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              Correo electrónico
            </label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400/30 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              placeholder="ejemplo@gmail.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="contrasena"
              className="block text-sm font-medium text-gray-200 mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400/30 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
              placeholder="********"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-700 focus:ring-2 focus:ring-orange-400 transition"
          >
            Entrar
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-300">
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-orange-400 font-medium hover:underline"
          >
            Regístrate
          </button>
        </p>
      </div>

      {/* Modal de registro con blur */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl w-full max-w-lg p-6">
            <h3 className="text-2xl font-bold mb-4 text-center text-white">
              Crear cuenta
            </h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 border border-gray-400/30 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-orange-400"
                required
              />
              <input
                type="text"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full px-4 py-2 border border-gray-400/30 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-orange-400"
                required
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={correoRegistro}
                onChange={(e) => setCorreoRegistro(e.target.value)}
                className="w-full px-4 py-2 border border-gray-400/30 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-orange-400"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={contrasenaRegistro}
                onChange={(e) => setContrasenaRegistro(e.target.value)}
                className="w-full px-4 py-2 border border-gray-400/30 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-orange-400"
                required
              />
              <input
                type="password"
                placeholder="Verificación de contraseña"
                value={verificacion}
                onChange={(e) => setVerificacion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-400/30 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-orange-400"
                required
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-400/40 text-white rounded-lg hover:bg-gray-500/50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Registrarse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
