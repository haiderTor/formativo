import { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

// Se conserva el mismo estilo limpio y corporativo del reporte de servicios
const styles = StyleSheet.create({
    page: { padding: 30 },
    title: { fontSize: 16, marginBottom: 5, textAlign: "center", fontWeight: "bold" },
    subtitle: { fontSize: 11, marginBottom: 15, textAlign: "center", color: "#555" },
    table: { display: "table", width: "100%", marginTop: 10 },
    row: { flexDirection: "row", borderBottom: "1px solid #ddd", alignItems: "center" },
    cell: { padding: 6, fontSize: 10, flex: 1 },
    headerCell: { padding: 6, fontSize: 10, fontWeight: "bold", backgroundColor: "#3b82f6", color: "#fff", flex: 1 },
    colSmall: { flex: 0.6 },
    colLarge: { flex: 1.4 }
});

// Estructura del Documento PDF para Facturas
const FacturaDoc = ({ datosReporte, nombreCliente }) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <Text style={styles.title}>Reporte de Facturaciones por Cliente</Text>
            <Text style={styles.subtitle}>Cliente: {nombreCliente || "No seleccionado"}</Text>
            
            <View style={styles.table}>
                {/* Encabezados de la Tabla */}
                <View style={styles.row}>
                    <Text style={[styles.headerCell, styles.colSmall]}>ID Factura</Text>
                    <Text style={styles.headerCell}>Fecha de Emisión</Text>
                    <Text style={styles.headerCell}>Método de Pago</Text>
                    <Text style={styles.headerCell}>Estado de Pago</Text>
                    <Text style={[styles.headerCell, styles.colLarge]}>Cliente</Text>
                    <Text style={[styles.headerCell, styles.colSmall]}>ID Ticket</Text>
                </View>
                
                {/* Filas de la Tabla */}
                {datosReporte.length === 0 ? (
                    <View style={styles.row}>
                        <Text style={[styles.cell, { textAlign: "center", flex: 1, color: "#aaa", padding: 20 }]}>
                            No se registraron facturas para este cliente.
                        </Text>
                    </View>
                ) : (
                    datosReporte.map(f => (
                        <View style={styles.row} key={f.factura_id}>
                            <Text style={[styles.cell, styles.colSmall]}>{f.factura_id}</Text>
                            <Text style={styles.cell}>{f.fecha}</Text>
                            <Text style={styles.cell}>{f.metodo_pago}</Text>
                            <Text style={styles.cell}>{f.estado}</Text>
                            <Text style={[styles.cell, styles.colLarge]}>{`${f.cliente_nombre} ${f.cliente_apellido}`}</Text>
                            <Text style={[styles.cell, styles.colSmall]}>{f.ticket_id}</Text>
                        </View>
                    ))
                )}
            </View>
        </Page>
    </Document>
);

// Nombre de función idéntico al ruteo de tu App.jsx
export default function Reportefactura() {
    const [listaClientes, setListaClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState("");
    const [datosReporte, setDatosReporte] = useState([]);

    // 1. Obtener los clientes para rellenar el select dropdown
    useEffect(() => {
        fetch("http://localhost:3000/routes/listaclientes")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setListaClientes(data);
            })
            .catch(err => console.error("Error al cargar lista de clientes:", err));
    }, []);

    // 2. Traer facturas de la base de datos cuando cambie la selección del usuario
    useEffect(() => {
        if (!clienteSeleccionado) {

            return;
        }

        fetch(`http://localhost:3000/routes/reportefacturafiltrado?cliente_id=${clienteSeleccionado}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setDatosReporte(data);
            })
            .catch(err => console.error("Error al obtener facturas filtradas:", err));
    }, [clienteSeleccionado]);

    // Buscar los nombres completos del cliente actual para estamparlo en el subtítulo del PDF
    const clienteActual = listaClientes.find(c => c.cliente_id === parseInt(clienteSeleccionado));
    const nombreCliente = clienteActual ? `${clienteActual.nombres} ${clienteActual.apellidos}` : "";

    return (
        <div className="flex flex-col items-center justify-center gap-4 mt-8 p-6 bg-[#121316] rounded-lg shadow-sm max-w-md mx-auto">
            <div className="w-full">
                <label className="block text-sm font-medium text-white mb-2">
                    Selecciona un Cliente:
                </label>
                <select
                    value={clienteSeleccionado}
                    onChange={(e) => setClienteSeleccionado(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-[#121316] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="">-- Selecciona un cliente --</option>
                    {listaClientes.map(cli => (
                        <option key={cli.cliente_id} value={cli.cliente_id}>
                            {cli.nombres} {cli.apellidos !== "N/A" ? cli.apellidos : ""}
                        </option>
                    ))}
                </select>
            </div>

            {/* El botón de renderizado del documento PDF se activa al seleccionar un cliente */}
            {clienteSeleccionado && (
                <div className="mt-2">
                    <PDFDownloadLink 
                        document={<FacturaDoc datosReporte={datosReporte} nombreCliente={nombreCliente} />} 
                        fileName={`facturas_${nombreCliente.toLowerCase().replace(/ /g, "_")}.pdf`}
                    >
                        {({ loading }) => (
                            <button
                                disabled={loading}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-md shadow transition duration-200"
                            >
                                {loading ? "Generando PDF..." : "Descargar Facturas PDF"}
                            </button>
                        )}
                    </PDFDownloadLink>
                </div>
            )}
        </div>
    );
}