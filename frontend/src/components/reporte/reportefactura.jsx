import { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 40 },
    title: { fontSize: 18, marginBottom: 15, textAlign: "center" },
    table: { display: "table", width: "95%", marginTop: 20 },
    row: { flexDirection: "row", borderBottom: "1px solid #000" },
    cell: { flex: 1, minWidth: 100, padding: 6, fontSize: 10 },
    headerCell: { flex: 1, minWidth: 100, padding: 6, fontSize: 11, fontWeight: "bold", backgroundColor: "#eee" },
    cliente: { flex: 2, minWidth: 150 }
});

const ReporteFacturasDoc = ({ facturas }) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <Text style={styles.title}>Reporte de Facturas</Text>
            <View style={styles.table}>
                <View style={styles.row}>
                    <Text style={styles.headerCell}>ID</Text>
                    <Text style={styles.headerCell}>Fecha</Text>
                    <Text style={styles.headerCell}>Método Pago</Text>
                    <Text style={styles.headerCell}>Estado</Text>
                    <Text style={[styles.headerCell, styles.cliente]}>Cliente</Text>
                    <Text style={styles.headerCell}>Ticket</Text>
                </View>
                {Array.isArray(facturas) && facturas.map(f => (
                    <View style={styles.row} key={f.factura_id}>
                        <Text style={styles.cell}>{f.factura_id}</Text>
                        <Text style={styles.cell}>{f.fecha}</Text>
                        <Text style={styles.cell}>{f.metodo_pago}</Text>
                        <Text style={styles.cell}>{f.estado}</Text>
                        <Text style={[styles.cell, styles.cliente]}>{f.cliente_nombre} {f.cliente_apellido}</Text>
                        <Text style={styles.cell}>{f.ticket_id}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default function ReporteFacturas() {
    const [facturas, setFacturas] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/routes/reportefactura")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setFacturas(data);
                else console.error("Respuesta inesperada:", data);
            })
            .catch(err => console.error("Error al obtener facturas:", err));
    }, []);

    return (
        <div className="flex justify-center mt-6">
            <PDFDownloadLink document={<ReporteFacturasDoc facturas={facturas} />} fileName="facturas.pdf">
                {({ loading }) => (
                    <button
                        className="px-4 py-2 bg-purple-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-200"
                    >
                        {loading ? "Generando..." : "Descargar Reporte de Facturas"}
                    </button>
                )}
            </PDFDownloadLink>
        </div>
    );
}
