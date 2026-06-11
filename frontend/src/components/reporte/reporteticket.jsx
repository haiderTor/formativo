import { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

// Estilo unificado (azul corporativo y estructura limpia en horizontal)
const styles = StyleSheet.create({
    page: { padding: 30 },
    title: { fontSize: 16, marginBottom: 5, textAlign: "center", fontWeight: "bold" },
    subtitle: { fontSize: 11, marginBottom: 15, textAlign: "center", color: "#555" },
    table: { display: "table", width: "100%", marginTop: 10 },
    row: { flexDirection: "row", borderBottom: "1px solid #ddd", alignItems: "center" },
    cell: { padding: 6, fontSize: 9, flex: 1 },
    headerCell: { padding: 6, fontSize: 9, fontWeight: "bold", backgroundColor: "#3b82f6", color: "#fff", flex: 1 },
    colSmall: { flex: 0.5 },
    colLarge: { flex: 1.5 }
});

// Estructura del Documento PDF para Tickets
const TicketsDoc = ({ datosReporte, nombreTecnico }) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <Text style={styles.title}>Reporte de Tickets por Técnico</Text>
            <Text style={styles.subtitle}>Técnico Asignado: {nombreTecnico || "No seleccionado"}</Text>

            <View style={styles.table}>
                {/* Encabezados de la Tabla */}
                <View style={styles.row}>
                    <Text style={[styles.headerCell, styles.colSmall]}>ID</Text>
                    <Text style={styles.headerCell}>Fecha</Text>
                    <Text style={[styles.headerCell, styles.colLarge]}>Falla Reportada</Text>
                    <Text style={[styles.headerCell, styles.colLarge]}>Diagnóstico</Text>
                    <Text style={styles.headerCell}>Estado</Text>
                    <Text style={styles.headerCell}>Equipo</Text>
                    <Text style={styles.headerCell}>Cliente</Text>
                </View>

                {/* Filas de la Tabla */}
                {datosReporte.length === 0 ? (
                    <View style={styles.row}>
                        <Text style={[styles.cell, { textAlign: "center", flex: 1, color: "#aaa", padding: 20 }]}>
                            No se encontraron tickets asignados a este técnico.
                        </Text>
                    </View>
                ) : (
                    datosReporte.map(t => (
                        <View style={styles.row} key={t.ticket_id}>
                            <Text style={[styles.cell, styles.colSmall]}>{t.ticket_id}</Text>
                            <Text style={styles.cell}>{t.fecha_creacion}</Text>
                            <Text style={[styles.cell, styles.colLarge]}>{t.descripcion_falla}</Text>
                            <Text style={[styles.cell, styles.colLarge]}>{t.diagnostico || "Sin diagnóstico"}</Text>
                            <Text style={styles.cell}>{t.estado_ticket}</Text>
                            <Text style={styles.cell}>{t.tipo_equipo}</Text>
                            <Text style={styles.cell}>{`${t.cliente_nombre} ${t.cliente_apellido !== "N/A" ? t.cliente_apellido : ""}`}</Text>
                        </View>
                    ))
                )}
            </View>
        </Page>
    </Document>
);

// Nombre de función idéntico al ruteo de tu App.jsx (Reporteticket)
export default function Reporteticket() {
    const [listaEmpleados, setListaEmpleados] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState("");
    const [datosReporte, setDatosReporte] = useState([]);

    // 1. Obtener empleados para el dropdown inicial
    useEffect(() => {
        fetch("http://localhost:3000/routes/listaempleados")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setListaEmpleados(data);
            })
            .catch(err => console.error("Error al cargar lista de empleados:", err));
    }, []);

    // 2. Traer tickets del técnico cuando cambie la selección
    useEffect(() => {
        if (!empleadoSeleccionado) {

            return;
        }

        fetch(`http://localhost:3000/routes/reporteticketfiltrado?empleado_id=${empleadoSeleccionado}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setDatosReporte(data);
            })
            .catch(err => console.error("Error al obtener tickets filtrados:", err));
    }, [empleadoSeleccionado]);

    // Encontrar el nombre del técnico actual para mandarlo como propiedad al PDF
    const empleadoActual = listaEmpleados.find(e => e.empleado_id === parseInt(empleadoSeleccionado));
    const nombreTecnico = empleadoActual ? `${empleadoActual.nombres} ${empleadoActual.apellidos} (${empleadoActual.cargo})` : "";

    return (
        <div className="flex flex-col items-center justify-center gap-4 mt-8 p-6 bg-[#121316] rounded-lg shadow-sm max-w-md mx-auto">
            <div className="w-full">
                <label className="block text-sm font-medium text-white mb-2">
                    Selecciona un Técnico / Empleado:
                </label>
                <select
                    value={empleadoSeleccionado}
                    onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-[#121316] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="">-- Selecciona un técnico --</option>
                    {listaEmpleados.map(emp => (
                        <option key={emp.empleado_id} value={emp.empleado_id}>
                            {emp.nombres} {emp.apellidos} - {emp.cargo}
                        </option>
                    ))}
                </select>
            </div>

            {/* El botón se habilita únicamente si hay una selección activa */}
            {empleadoSeleccionado && (
                <div className="mt-2">
                    <PDFDownloadLink
                        document={<TicketsDoc datosReporte={datosReporte} nombreTecnico={nombreTecnico} />}
                        fileName={`tickets_${nombreTecnico.toLowerCase().replace(/ /g, "_")}.pdf`}
                    >
                        {({ loading }) => (
                            <button
                                disabled={loading}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-md shadow transition duration-200"
                            >
                                {loading ? "Generando PDF..." : "Descargar Tickets PDF"}
                            </button>
                        )}
                    </PDFDownloadLink>
                </div>
            )}
        </div>
    );
}
/* salda */