import { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    title: {
        fontSize: 18,
        marginBottom: 15,
        textAlign: "center"
    },
    table: {
        display: "table",
        width: "100%",
        marginTop: 20
    },
    row: {
        flexDirection: "row",
        borderBottom: "1px solid #000"
    },
    cell: {
        flex: 1,
        minWidth: 80,
        padding: 4,
        fontSize: 8,
        textAlign: "left",
        lineHeight: 1.3
    },
    headerCell: {
        flex: 1,
        minWidth: 80,
        padding: 4,
        fontSize: 8,
        fontWeight: "bold",
        backgroundColor: "#eee",
        lineHeight: 1.3
    },
});

const ReporteClientesDoc = ({ clientes }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Reporte de Clientes</Text>
            <View style={styles.table}>
                <View style={styles.row}>
                    <Text style={styles.headerCell}>Nombre</Text>
                    <Text style={styles.headerCell}>Tipo de documento</Text>
                    <Text style={styles.headerCell}>Documento</Text>
                    <Text style={styles.headerCell}>Teléfono</Text>
                    <Text style={styles.headerCell}>Correo</Text>
                    <Text style={styles.headerCell}>Dirección</Text>
                    <Text style={styles.headerCell}>Ciudad</Text>
                </View>
                {Array.isArray(clientes) && clientes.map(c => (
                    <View style={styles.row} key={c.cliente_id}>
                        <Text style={styles.cell}>{c.nombres} {c.apellidos}</Text>
                        <Text style={styles.cell}>{c.tipo_documento}</Text>
                        <Text style={styles.cell}>{c.documento}</Text>
                        <Text style={styles.cell}>{c.telefono}</Text>
                        <Text style={styles.cell}>{c.correo}</Text>
                        <Text style={styles.cell}>{c.direccion}</Text>
                        <Text style={styles.cell}>{c.ciudad}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default function ReporteClientes() {
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
        <div className="flex justify-center mt-6">
            <PDFDownloadLink document={<ReporteClientesDoc clientes={clientes} />} fileName="clientes.pdf">
                {({ loading }) => (
                    <button
                        className="px-4 py-2 bg-blue-700 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition duration-200"
                    >
                        {loading ? "Generando..." : "Descargar Reporte de Clientes"}
                    </button>
                )}
            </PDFDownloadLink>
        </div>
    );
}
/* HOLA
 */