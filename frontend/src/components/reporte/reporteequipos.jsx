import { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40 },
  title: { fontSize: 18, marginBottom: 15, textAlign: "center" },
  table: { display: "table", width: "95%", marginTop: 20 },
  row: { flexDirection: "row", borderBottom: "1px solid #000" },
  cell: { flex: 1, minWidth: 100, padding: 6, fontSize: 10 },
  headerCell: { flex: 1, minWidth: 100, padding: 6, fontSize: 11, fontWeight: "bold", backgroundColor: "#eee" },
  equipo: { flex: 2, minWidth: 150 },
  cliente: { flex: 2, minWidth: 150 }
});

const ReporteEquiposDoc = ({ equipos }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Text style={styles.title}>Reporte de Equipos</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={[styles.headerCell, styles.equipo]}>Equipo</Text>
          <Text style={styles.headerCell}>Modelo</Text>
          <Text style={styles.headerCell}>Marca</Text>
          <Text style={[styles.headerCell, styles.cliente]}>Cliente</Text>
        </View>
        {Array.isArray(equipos) && equipos.map(e => (
          <View style={styles.row} key={e.equipo_id}>
            <Text style={[styles.cell, styles.equipo]}>{e.tipo_equipo}</Text>
            <Text style={styles.cell}>{e.modelo}</Text>
            <Text style={styles.cell}>{e.nombre_marca}</Text>
            <Text style={[styles.cell, styles.cliente]}>{e.nombres} {e.apellidos}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default function ReporteEquipos() {
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
    <div className="flex justify-center mt-6">
      <PDFDownloadLink document={<ReporteEquiposDoc equipos={equipos} />} fileName="equipos.pdf">
        {({ loading }) => (
          <button
            className="px-4 py-2 bg-blue-700 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-200"
          >
            {loading ? "Generando..." : "Descargar Reporte de Equipos"}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
}
