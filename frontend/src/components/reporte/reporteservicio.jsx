import { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

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

// Documento PDF que se generará
const ReporteDoc = ({ datosReporte, nombreServicio }) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <Text style={styles.title}>Reporte de Equipos por Servicio</Text>
            <Text style={styles.subtitle}>Filtro aplicado: {nombreServicio || "Ninguno"}</Text>
            
            <View style={styles.table}>
                <View style={styles.row}>
                    <Text style={[styles.headerCell, styles.colSmall]}>Factura</Text>
                    <Text style={[styles.headerCell, styles.colLarge]}>Cliente</Text>
                    <Text style={styles.headerCell}>Tipo Equipo</Text>
                    <Text style={styles.headerCell}>Modelo</Text>
                    <Text style={styles.headerCell}>N° Serie</Text>
                    <Text style={[styles.headerCell, styles.colLarge]}>Repuesto Usado</Text>
                    <Text style={[styles.headerCell, styles.colSmall]}>Cant.</Text>
                    <Text style={styles.headerCell}>Precio Unit.</Text>
                </View>
                
                {datosReporte.length === 0 ? (
                    <View style={styles.row}>
                        <Text style={[styles.cell, { textAlign: "center", flex: 1, color: "#aaa", padding: 20 }]}>
                            No se encontraron registros para este servicio.
                        </Text>
                    </View>
                ) : (
                    datosReporte.map(item => (
                        <View style={styles.row} key={item.factura_servicio_id}>
                            <Text style={[styles.cell, styles.colSmall]}>{item.factura_id}</Text>
                            <Text style={[styles.cell, styles.colLarge]}>{`${item.cliente_nombre} ${item.cliente_apellido}`}</Text>
                            <Text style={styles.cell}>{item.tipo_equipo}</Text>
                            <Text style={styles.cell}>{item.modelo || "-"}</Text>
                            <Text style={styles.cell}>{item.numero_serie}</Text>
                            <Text style={[styles.cell, styles.colLarge]}>{item.repuesto || "Ninguno"}</Text>
                            <Text style={[styles.cell, styles.colSmall]}>{item.amount || item.cantidad}</Text>
                            <Text style={styles.cell}>${Number(item.precio_unitario).toLocaleString()}</Text>
                        </View>
                    ))
                )}
            </View>
        </Page>
    </Document>
);

// Nombre exacto ajustado a tu importación en App.jsx
export default function Reporteservicio() {
    const [listaServicios, setListaServicios] = useState([]);
    const [servicioSeleccionado, setServicioSeleccionado] = useState("");
    const [datosReporte, setDatosReporte] = useState([]);

    // Obtener servicios para el selector
    useEffect(() => {
        fetch("http://localhost:3000/routes/listaservicios")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setListaServicios(data);
            })
            .catch(err => console.error("Error al cargar servicios:", err));
    }, []);

    // Obtener los datos del reporte cuando cambia la selección
    useEffect(() => {
        if (!servicioSeleccionado) {

            return;
        }

        fetch(`http://localhost:3000/routes/reporteserviciofiltrado?servicio_id=${servicioSeleccionado}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setDatosReporte(data);
            })
            .catch(err => console.error("Error al obtener reporte filtrado:", err));
    }, [servicioSeleccionado]);

    const servicioActual = listaServicios.find(s => s.servicio_id === parseInt(servicioSeleccionado));
    const nombreServicio = servicioActual ? servicioActual.nombre : "";

    return (
        <div className="flex flex-col items-center justify-center gap-4 mt-8 p-6 bg-[#121316] rounded-lg shadow-sm max-w-md mx-auto">
            <div className="w-full">
                <label className="block text-sm font-medium text-white mb-2">
                    Selecciona un Servicio:
                </label>
                <select
                    value={servicioSeleccionado}
                    onChange={(e) => setServicioSeleccionado(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-[#121316] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="">-- Elige un servicio --</option>
                    {listaServicios.map(serv => (
                        <option key={serv.servicio_id} value={serv.servicio_id}>
                            {serv.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {servicioSeleccionado && (
                <div className="mt-2">
                    <PDFDownloadLink 
                        document={<ReporteDoc datosReporte={datosReporte} nombreServicio={nombreServicio} />} 
                        fileName={`reporte_equipos_${nombreServicio.toLowerCase().replace(/ /g, "_")}.pdf`}
                    >
                        {({ loading }) => (
                            <button
                                disabled={loading}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-md shadow transition duration-200"
                            >
                                {loading ? "Generando PDF..." : "Descargar Reporte en PDF"}
                            </button>
                        )}
                    </PDFDownloadLink>
                </div>
            )}
        </div>
    );
}