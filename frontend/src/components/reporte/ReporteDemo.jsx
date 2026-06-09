
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 30 },
    section: { marginBottom: 10 }
});

const ReporteDemo = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>📊 Reporte de prueba</Text>
            </View>
            <View style={styles.section}>
                <Text>Este PDF fue generado con React PDF</Text>
            </View>
        </Page>
    </Document>
);

export default function Reportes() {
    return (
        <div>
            <PDFDownloadLink document={<ReporteDemo />} fileName="reporte.pdf">
                {({ loading }) => (loading ? 'Generando...' : 'Descargar Reporte')}
            </PDFDownloadLink>
        </div>
    );
}
