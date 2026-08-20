import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Facturacion() {
const [facturas, setFacturas] = useState([]);
const navigate = useNavigate();

return (
    <div>
        <h1>Facturación</h1>
        <button onClick={() => navigate("/facturas/nueva")}>Crear Factura</button>
        <ul>
            {facturas.map((factura) => (
                <li key={factura.id}>
                    {factura.numero} - {factura.cliente}
                </li>
            ))}
        </ul>
        {console.log(setFacturas)}
    </div>
);
}
