// Dashboard.jsx
export default function Dashboard() {
    return (
        <div className="bg-[#191a1d] flex flex-col w-full h-auto rounded-lg font-[Roboto Mono]"> 
            <div className="flex flex-row  w-auto h-auto">
                <section className="flex flex-col w-full p-6">
                    <h2 className="flex align-items justify-between text-white text-xl font-bold">Resumen</h2>
                    <p className="flex items-start text-gray-500">Aqui estan tus estadisticas de hoy</p>
                </section>
                <section className="flex flex-row gap-4 w-100 p-6">
                    <button className="bg-[#191a1d] text-[#ffffff] font-bold h-13 py-2 px-4 rounded-lg hover:bg-[#181a1d]">
                        Actualizar
                    </button>
                    <button className="bg-[#FFBF00] text-[#ffffff] font-bold py-2 px-4 rounded-lg hover:bg-[#e0a700]">
                        Actualizar
                    </button>
                    
                </section>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Bloque: My Balance */}
                <div className="bg-[#262629] h-90 rounded-xl shadow-md p-2">
                    <h2 className="text-[#91919] text-lg font-semibold">Acumulado del Dia</h2>
                    <section className="bg-[#1B1B1D] h-76 rounded-lg text-gray-500">
                        <p className="text-gray-500">Wallet Overview & Spending</p>
                        <span className="text-2xl font-bold">$28,520.30</span>
                    </section>
                </div>

                <div className="bg-[#262629] h-90 rounded-xl shadow-md p-2">
                    <h2 className="text-[#91919] text-lg font-semibold">Acumulado del Dia</h2>
                    <section className="bg-[#1B1B1D] h-76 rounded-lg text-gray-500">
                        <p className="text-gray-500">Wallet Overview & Spending</p>
                        <span className="text-2xl font-bold">$28,520.30</span>
                    </section>
                </div>

                                <div className="bg-[#262629] h-90 rounded-xl shadow-md p-2">
                    <h2 className="text-[#91919] text-lg font-semibold">Acumulado del Dia</h2>
                    <section className="bg-[#1B1B1D] h-76 rounded-lg text-gray-500">
                        <p className="text-gray-500">Wallet Overview & Spending</p>
                        <span className="text-2xl font-bold">$28,520.30</span>
                    </section>
                </div>

                {/* Bloque: My Wallet */}
                <div className="bg-[#262629] h-90 rounded-xl shadow-md p-2">
                    <h2 className="text-[#91919] text-lg font-semibold">Acumulado del Dia</h2>
                    <section className="bg-[#1B1B1D] h-76 rounded-lg text-gray-500">
                        <p className="text-gray-500">Wallet Overview & Spending</p>
                        <span className="text-2xl font-bold">$28,520.30</span>
                    </section>
                </div>

                {/* Bloque: Cash Flow */}
                <div className="bg-[#262629] h-90 rounded-xl shadow-md p-2">
                    <h2 className="text-[#91919] text-lg font-semibold">Acumulado del Dia</h2>
                    <section className="bg-[#1B1B1D] h-76 rounded-lg text-gray-500">
                        <p className="text-gray-500">Wallet Overview & Spending</p>
                        <span className="text-2xl font-bold">$28,520.30</span>
                    </section>
                </div>
            </div>  
        </div>
    );
}
