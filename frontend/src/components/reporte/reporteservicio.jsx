import { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 40 },
    title: { fontSize: 18, marginBottom: 15, textAlign: "center" },
    table: { display: "table", width: "95%", marginTop: 20 },
    row: { flexDirection: "row", borderBottom: "1px solid #000" },
    cell: { flex: 1, minWidth: 100, padding: 6, fontSize: 10 },
    headerCell: { flex: 1, minWidth: 100, padding: 6, fontSize: 11, fontWeight: "bold", backgroundColor: "#eee" },
    servicio: { flex: 2, minWidth: 150 },
    repuesto: { flex: 2, minWidth: 150 }
});

const ReporteServiciosDoc = ({ servicios }) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <Text style={styles.title}>Reporte de Servicios y Repuestos</Text>
            <View style={styles.table}>
                <View style={styles.row}>
                    <Text style={styles.headerCell}>Factura</Text>
                    <Text style={[styles.headerCell, styles.servicio]}>Servicio</Text>
                    <Text style={[styles.headerCell, styles.repuesto]}>Repuesto</Text>
                    <Text style={styles.headerCell}>Cantidad</Text>
                    <Text style={styles.headerCell}>Precio Unitario</Text>
                </View>
                {Array.isArray(servicios) && servicios.map(s => (
                    <View style={styles.row} key={s.factura_servicio_id}>
                        <Text style={styles.cell}>{s.factura_id}</Text>
                        <Text style={[styles.cell, styles.servicio]}>{s.servicio}</Text>
                        <Text style={[styles.cell, styles.repuesto]}>{s.repuesto || "-"}</Text>
                        <Text style={styles.cell}>{s.cantidad}</Text>
                        <Text style={styles.cell}>{s.precio_unitario}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default function ReporteServicios() {
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/routes/reporteservicio")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setServicios(data);
                else console.error("Respuesta inesperada:", data);
            })
            .catch(err => console.error("Error al obtener servicios:", err));
    }, []);

    return (
        <div className="flex justify-center mt-6">
            <PDFDownloadLink document={<ReporteServiciosDoc servicios={servicios} />} fileName="servicios.pdf">
                {({ loading }) => (
                    <button
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-200"
                    >
                        {loading ? "Generando..." : "Descargar Reporte de Servicios"}
                    </button>
                )}
            </PDFDownloadLink>
        </div>
    );
}
