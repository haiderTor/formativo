import { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

// Estilos unificados con los reportes de Facturas, Tickets y Servicios
const styles = StyleSheet.create({
    page: { padding: 30 },
    title: { fontSize: 16, marginBottom: 5, textAlign: "center", fontWeight: "bold" },
    subtitle: { fontSize: 11, marginBottom: 15, textAlign: "center", color: "#555" },
    table: { display: "table", width: "100%", marginTop: 10 },
    row: { flexDirection: "row", borderBottom: "1px solid #ddd", alignItems: "center" },
    cell: { padding: 6, fontSize: 10, flex: 1 },
    headerCell: { padding: 6, fontSize: 10, fontWeight: "bold", backgroundColor: "#3b82f6", color: "#fff", flex: 1 },
    colSmall: { flex: 0.5 },
    colLarge: { flex: 1.5 }
});

const ReporteEquiposDoc = ({ equipos }) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <Text style={styles.title}>Reporte General de Equipos</Text>
            <Text style={styles.subtitle}>Listado completo de inventario y asignaciones</Text>
            
            <View style={styles.table}>
                {/* Encabezados con estilo azul */}
                <View style={styles.row}>
                    <Text style={[styles.headerCell, styles.colSmall]}>ID</Text>
                    <Text style={styles.headerCell}>Tipo Equipo</Text>
                    <Text style={styles.headerCell}>Modelo</Text>
                    <Text style={styles.headerCell}>Referencia</Text>
                    <Text style={styles.headerCell}>N° Serie</Text>
                    <Text style={styles.headerCell}>Marca</Text>
                    <Text style={[styles.headerCell, styles.colLarge]}>Cliente Propietario</Text>
                </View>

                {/* Filas de datos */}
                {Array.isArray(equipos) && equipos.length > 0 ? (
                    equipos.map(e => (
                        <View style={styles.row} key={e.equipo_id}>
                            <Text style={[styles.cell, styles.colSmall]}>{e.equipo_id}</Text>
                            <Text style={styles.cell}>{e.tipo_equipo}</Text>
                            <Text style={styles.cell}>{e.modelo || "-"}</Text>
                            <Text style={styles.cell}>{e.referencia || "-"}</Text>
                            <Text style={styles.cell}>{e.numero_serie}</Text>
                            <Text style={styles.cell}>{e.nombre_marca}</Text>
                            <Text style={[styles.cell, styles.colLarge]}>{`${e.nombres} ${e.apellidos}`}</Text>
                        </View>
                    ))
                ) : (
                    <View style={styles.row}>
                        <Text style={[styles.cell, { textAlign: "center", flex: 1, color: "#aaa", padding: 20 }]}>
                            No hay equipos registrados en el sistema.
                        </Text>
                    </View>
                )}
            </View>
        </Page>
    </Document>
);

// Nombre ajustado a tu App.jsx (Reporteequipos)
export default function Reporteequipos() {
    const [equipos, setEquipos] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/routes/reporteequipos") 
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setEquipos(data);
                else console.error("Respuesta inesperada:", data);
            })
            .catch(err => console.error("Error al obtener equipos:", err));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-4 mt-8 p-6 bg-[#121316] rounded-lg shadow-sm max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800">Generar Reporte de Inventario</h2>
            <p className="text-sm text-center">
                Este reporte incluye todos los equipos, sus números de serie, marcas y el cliente al que pertenecen.
            </p>
            
            <div className="mt-4">
                <PDFDownloadLink document={<ReporteEquiposDoc equipos={equipos} />} fileName="reporte_general_equipos.pdf">
                    {({ loading }) => (
                        <button
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-200 disabled:bg-gray-400"
                        >
                            {loading ? "Preparando documento..." : "Descargar Reporte General (PDF)"}
                        </button>
                    )}
                </PDFDownloadLink>
            </div>
        </div>
    );
}