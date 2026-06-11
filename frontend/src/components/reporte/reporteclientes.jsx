import { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

// Estilos corporativos unificados para mantener la misma línea de diseño
const styles = StyleSheet.create({
    page: { padding: 30 },
    title: { fontSize: 16, marginBottom: 5, textAlign: "center", fontWeight: "bold" },
    subtitle: { fontSize: 11, marginBottom: 15, textAlign: "center", color: "#555" },
    table: { display: "table", width: "100%", marginTop: 10 },
    row: { flexDirection: "row", borderBottom: "1px solid #ddd", alignItems: "center" },
    cell: { padding: 5, fontSize: 9, flex: 1 },
    headerCell: { padding: 5, fontSize: 9, fontWeight: "bold", backgroundColor: "#3b82f6", color: "#fff", flex: 1 },
    colSmall: { flex: 0.6 },
    colLarge: { flex: 1.4 }
});

const ReporteClientesDoc = ({ clientes }) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <Text style={styles.title}>Reporte General de Clientes</Text>
            <Text style={styles.subtitle}>Directorio completo y datos de contacto</Text>
            
            <View style={styles.table}>
                {/* Encabezado de la tabla en azul */}
                <View style={styles.row}>
                    <Text style={[styles.headerCell, styles.colLarge]}>Nombre Completo</Text>
                    <Text style={[styles.headerCell, styles.colSmall]}>Tipo Doc.</Text>
                    <Text style={styles.headerCell}>Documento</Text>
                    <Text style={styles.headerCell}>Teléfono</Text>
                    <Text style={[styles.headerCell, styles.colLarge]}>Correo Electrónico</Text>
                    <Text style={[styles.headerCell, styles.colLarge]}>Dirección</Text>
                    <Text style={styles.headerCell}>Ciudad</Text>
                </View>

                {/* Filas con los datos del cliente */}
                {Array.isArray(clientes) && clientes.length > 0 ? (
                    clientes.map(c => (
                        <View style={styles.row} key={c.cliente_id}>
                            <Text style={[styles.cell, styles.colLarge]}>{`${c.nombres} ${c.apellidos !== "N/A" ? c.apellidos : ""}`}</Text>
                            <Text style={[styles.cell, styles.colSmall]}>{c.tipo_documento}</Text>
                            <Text style={styles.cell}>{c.documento}</Text>
                            <Text style={styles.cell}>{c.telefono || "-"}</Text>
                            <Text style={[styles.cell, styles.colLarge]}>{c.correo}</Text>
                            <Text style={[styles.cell, styles.colLarge]}>{c.direccion || "-"}</Text>
                            <Text style={styles.cell}>{c.ciudad || "-"}</Text>
                        </View>
                    ))
                ) : (
                    <View style={styles.row}>
                        <Text style={[styles.cell, { textAlign: "center", flex: 1, color: "#aaa", padding: 20 }]}>
                            No se encontraron clientes registrados.
                        </Text>
                    </View>
                )}
            </View>
        </Page>
    </Document>
);

// Nombre de función idéntico al ruteo de tu App.jsx (Reporteclientes)
export default function Reporteclientes() {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/routes/reporteclientes")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setClientes(data);
                else console.error("Respuesta inesperada:", data);
            })
            .catch(err => console.error("Error al obtener clientes:", err));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-4 mt-8 p-6 bg-[#121316] rounded-lg shadow-sm max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800">Generar Reporte de Clientes</h2>
            <p className="text-sm text-center">
                Exporta el listado completo de clientes junto con sus métodos de contacto, identificaciones oficiales y ubicaciones registradas.
            </p>
            
            <div className="mt-4">
                <PDFDownloadLink document={<ReporteClientesDoc clientes={clientes} />} fileName="reporte_general_clientes.pdf">
                    {({ loading }) => (
                        <button
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-200 disabled:bg-gray-400"
                        >
                            {loading ? "Preparando documento..." : "Descargar Reporte de Clientes (PDF)"}
                        </button>
                    )}
                </PDFDownloadLink>
            </div>
        </div>
    );
}