import { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 40 },
    title: { fontSize: 18, marginBottom: 15, textAlign: "center" },
    table: { display: "table", width: "95%", marginTop: 20 },
    row: { flexDirection: "row", borderBottom: "1px solid #000" },
    cell: { flex: 1, minWidth: 100, padding: 6, fontSize: 10 },
    headerCell: { flex: 1, minWidth: 100, padding: 6, fontSize: 11, fontWeight: "bold", backgroundColor: "#eee" },
    descripcion: { flex: 1, minWidth: 100 },
    tecnico: { flex: 1, minWidth: 100 }
});

const ReporteTicketsDoc = ({ tickets }) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <Text style={styles.title}>Reporte de Tickets</Text>
            <View style={styles.table}>
                <View style={styles.row}>
                    <Text style={styles.headerCell}>ID</Text>
                    <Text style={styles.headerCell}>Fecha</Text>
                    <Text style={[styles.headerCell, styles.descripcion]}>Falla</Text>
                    <Text style={styles.headerCell}>Diagnóstico</Text>
                    <Text style={styles.headerCell}>Estado</Text>
                    <Text style={styles.headerCell}>Equipo</Text>
                    <Text style={[styles.headerCell, styles.tecnico]}>Técnico</Text>
                </View>
                {Array.isArray(tickets) && tickets.map(t => (
                    <View style={styles.row} key={t.ticket_id}>
                        <Text style={styles.cell}>{t.ticket_id}</Text>
                        <Text style={styles.cell}>{t.fecha_creacion}</Text>
                        <Text style={[styles.cell, styles.descripcion]}>{t.descripcion_falla}</Text>
                        <Text style={styles.cell}>{t.diagnostico}</Text>
                        <Text style={styles.cell}>{t.estado_ticket}</Text>
                        <Text style={styles.cell}>{t.tipo_equipo}</Text>
                        <Text style={[styles.cell, styles.tecnico]}>{t.tecnico_nombre} {t.tecnico_apellido}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default function ReporteTickets() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/routes/ticket")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTickets(data);
                else console.error("Respuesta inesperada:", data);
            })
            .catch(err => console.error("Error al obtener tickets:", err));
    }, []);

    return (
        <div className="flex justify-center mt-6">
            <PDFDownloadLink document={<ReporteTicketsDoc tickets={tickets} />} fileName="tickets.pdf">
                {({ loading }) => (
                    <button
                        className="px-4 py-2 bg-green-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-200"
                    >
                        {loading ? "Generando..." : "Descargar Reporte de Tickets"}
                    </button>
                )}
            </PDFDownloadLink>
        </div>
    );
}
