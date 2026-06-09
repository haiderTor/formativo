import { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 30,     // 👉 margen interno en todos los lados
        // aumentar (ej. 50) → más espacio en blanco alrededor
        // disminuir (ej. 10) → contenido más pegado al borde
    },
    title: {
        fontSize: 18,
        marginBottom: 15, // 👉 espacio debajo del título
        textAlign: "center"
    },
    table: {
        display: "table",
        width: "100%",
        marginTop: 20 // 👉 espacio entre el título y la tabla
    },
    row: {
        flexwrap: "nowrap",
        flexDirection: "row",
        borderBottom: "1px solid #000"
    },
    cell: {
        display: "flex",
        flexwrap: "nowrap",
        flex: 1,
        minWidth: 80,
        padding: 4,       // 👉 espacio interno dentro de cada celda
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
            <Text>Reporte de Clientes</Text>
            <View style={styles.table}>
                <View style={styles.row}>
                    <Text style={styles.cell}>Nombre</Text>
                    <Text style={styles.cell}>Tipo de documento</Text>
                    <Text style={styles.cell}>Documento</Text>
                    <Text style={styles.cell}>Telefono</Text>
                    <Text style={styles.cell}>Correo</Text>
                    <Text style={styles.cell}>Dirección</Text>
                    <Text style={styles.cell}>Ciudad</Text>
                </View>
                {clientes.map(c => (
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
            .then(data => setClientes(data));

    }, []);

    return (
        <div>
            <PDFDownloadLink document={<ReporteClientesDoc clientes={clientes} />} fileName="clientes.pdf">
                {({ loading }) => (loading ? "Generando..." : "Descargar Reporte de Clientes")}
            </PDFDownloadLink>
        </div>
    );
}
