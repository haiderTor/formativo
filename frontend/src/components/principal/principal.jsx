export default function PrincipalPage() {
    return (
            <div className="h-screen flex bg-gray-100">
                <aside className="w-64 bg-blue-700 text-white flex flex-col p-6">
                    <h1 className="text-2xl font-bold mb-8">Menú</h1>
                    <nav className="flex flex-col space-y-4">
                    <a href="#" className="hover:bg-blue-600 px-4 py-2 rounded">Home</a>
                    <a href="#" className="hover:bg-blue-600 px-4 py-2 rounded">Inventario</a>
                    <a href="#" className="hover:bg-blue-600 px-4 py-2 rounded">Historial</a>
                    <a href="#" className="hover:bg-blue-600 px-4 py-2 rounded">Ajustes</a>
                    </nav>
                </aside>

                <main className="flex-1 p-10">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">Bienvenido</h2>
                    <p className="text-gray-600">
                    Aquí irá el contenido principal de tu página de inicio.
                    </p>
                </main>
            </div>
    );
}