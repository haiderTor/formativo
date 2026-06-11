import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const { Pool } = pg;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

app.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        // Buscar usuario en la base de datos
        const query = await pool.query(
            'SELECT * FROM usuario WHERE correo = $1',
            [correo]
        );

        if (query.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        const usuario = query.rows[0];

        // Validar contraseña (en tu caso sin bcrypt)
        if (usuario.contrasena !== contrasena) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
            });
        }

        // Si todo está correcto
        res.json({
            success: true,
            message: 'Login exitoso',
            data: usuario,
        });
        console.log('Usuario autenticado:', usuario);

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        });
    }
});


app.post('/routes/usuario', async (req, res) => {
    const { nombre, nombre_usuario, correo, contrasena } = req.body;

    try {
        const query = await pool.query('INSERT INTO usuario (nombre, nombre_usuario, correo, contrasena) VALUES ($1, $2, $3, $4) RETURNING *', [nombre, nombre_usuario, correo, contrasena]);
        res.status(201).json({
            success: true,
            message: 'Data inserted successfully',
            data: query.rows[0]
        });
        console.log('item registrado correctamente:', query.rows[0]);
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});





app.post('/routes/clientes', async (req, res) => {
    const { tipo_documento, documento, nombres, apellidos, telefono, correo, direccion, ciudad } = req.body

    try {
        const query = await pool.query('INSERT INTO clientes(tipo_documento,documento,nombres,apellidos,telefono,correo,direccion,ciudad) VALUES($1, $2, $3,$4, $5, $6, $7, $8) RETURNING *', [tipo_documento, documento, nombres, apellidos, telefono, correo, direccion, ciudad]);
        res.status(201).json({
            success: true,
            message: 'Data inserted successfully',
            data: query.rows[0]
        });
        console.log('item registrado correctamente:', query.rows[0]);

    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});

app.post('/routes/empleado', async (req, res) => {
    const { nombres, apellidos, especialidad, telefono, correo, cargo } = req.body;

    try {
        const query = await pool.query(
            'INSERT INTO empleado (nombres, apellidos, especialidad, telefono, correo, cargo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nombres, apellidos, especialidad, telefono, correo, cargo]
        );

        res.status(201).json({
            success: true,
            message: 'Empleado registrado correctamente',
            data: query.rows[0]
        });

        console.log('Empleado registrado correctamente:', query.rows[0]);
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});

app.post('/routes/equipo', async (req, res) => {
    const { tipo_equipo, modelo, referencia, numero_serie, estado, marca_id, cliente_id } = req.body

    try {
        const query = await pool.query('INSERT INTO equipo(tipo_equipo,modelo,referencia,numero_serie,estado,marca_id,cliente_id) VALUES($1, $2, $3,$4, $5, $6, $7) RETURNING *', [tipo_equipo, modelo, referencia, numero_serie, estado, marca_id, cliente_id]);
        res.status(201).json({
            success: true,
            message: 'Data inserted successfully',
            data: query.rows[0]
        });
        console.log('item registrado correctamente:', query.rows[0]);

    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});

app.get('/routes/reporteclientes', async (req, res) => {
    try {
        const result = await pool.query(`SELECT* FROM clientes`);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching clientes:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.get('/routes/reporteequipos', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT e.equipo_id, e.tipo_equipo, e.modelo, e.referencia, e.numero_serie,
             e.estado, m.nombre AS nombre_marca, c.nombres, c.apellidos
      FROM equipo e
      JOIN marca m ON e.marca_id = m.marca_id
      JOIN clientes c ON e.cliente_id = c.cliente_id
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching equipos:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Endpoint para llenar el dropdown de técnicos/empleados en el frontend
app.get('/routes/listaempleados', async (req, res) => {
    try {
        const result = await pool.query('SELECT empleado_id, nombres, apellidos, cargo FROM empleado ORDER BY nombres ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener lista de empleados:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Endpoint para obtener los tickets filtrados por el ID del empleado técnico
app.get('/routes/reporteticketfiltrado', async (req, res) => {
    const { empleado_id } = req.query;

    if (!empleado_id) {
        return res.status(400).json({ success: false, error: 'Falta el parámetro empleado_id' });
    }

    try {
        const result = await pool.query(`
            SELECT 
                t.ticket_id, 
                TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD') as fecha_creacion, 
                t.descripcion_falla, 
                t.diagnostico,
                t.estado_ticket, 
                e.tipo_equipo, 
                c.nombres AS cliente_nombre, 
                c.apellidos AS cliente_apellido,
                emp.nombres AS tecnico_nombre, 
                emp.apellidos AS tecnico_apellido
            FROM ticket t
            JOIN equipo e ON t.equipo_id = e.equipo_id
            JOIN clientes c ON e.cliente_id = c.cliente_id
            JOIN empleado emp ON t.empleado_id = emp.empleado_id
            WHERE t.empleado_id = $1
            ORDER BY t.fecha_creacion DESC
        `, [empleado_id]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener tickets filtrados:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Endpoint para llenar el dropdown de clientes en el frontend
app.get('/routes/listaclientes', async (req, res) => {
    try {
        const result = await pool.query('SELECT cliente_id, nombres, apellidos FROM clientes ORDER BY nombres ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener lista de clientes:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Endpoint para obtener las facturas filtradas por el ID del cliente
app.get('/routes/reportefacturafiltrado', async (req, res) => {
    const { cliente_id } = req.query;

    if (!cliente_id) {
        return res.status(400).json({ success: false, error: 'Falta el parámetro cliente_id' });
    }

    try {
        const result = await pool.query(`
            SELECT 
                f.factura_id, 
                TO_CHAR(f.fecha, 'YYYY-MM-DD') as fecha, 
                f.metodo_pago, 
                f.estado,
                c.nombres AS cliente_nombre, 
                c.apellidos AS cliente_apellido,
                t.ticket_id
            FROM factura f
            JOIN clientes c ON f.cliente_id = c.cliente_id
            JOIN ticket t ON f.ticket_id = t.ticket_id
            WHERE f.cliente_id = $1
            ORDER BY f.fecha DESC
        `, [cliente_id]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener facturas filtradas:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Reporte de Servicios y Repuestos
// 1. Endpoint para obtener la lista de servicios (para el dropdown del frontend)
app.get('/routes/servicios-lista', async (req, res) => {
    try {
        const result = await pool.query('SELECT servicio_id, nombre FROM servicio ORDER BY nombre ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener lista de servicios:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

/// Endpoint para llenar el dropdown en el frontend
app.get('/routes/listaservicios', async (req, res) => {
    try {
        const result = await pool.query('SELECT servicio_id, nombre FROM servicio ORDER BY nombre ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener lista de servicios:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Endpoint para obtener el reporte filtrado por el ID del servicio elegido
app.get('/routes/reporteserviciofiltrado', async (req, res) => {
    const { servicio_id } = req.query;

    if (!servicio_id) {
        return res.status(400).json({ success: false, error: 'Falta el parámetro servicio_id' });
    }

    try {
        const result = await pool.query(`
            SELECT 
                fs.factura_servicio_id, 
                f.factura_id, 
                s.nombre AS servicio,
                r.nombre AS repuesto, 
                fs.cantidad, 
                fs.precio_unitario,
                e.tipo_equipo, 
                e.modelo, 
                e.numero_serie,
                c.nombres AS cliente_nombre, 
                c.apellidos AS cliente_apellido
            FROM factura_servicio fs
            JOIN factura f ON fs.factura_id = f.factura_id
            JOIN servicio s ON fs.servicio_id = s.servicio_id
            LEFT JOIN repuesto r ON fs.repuesto_id = r.repuesto_id
            JOIN ticket t ON f.ticket_id = t.ticket_id
            JOIN equipo e ON t.equipo_id = e.equipo_id
            JOIN clientes c ON f.cliente_id = c.cliente_id
            WHERE s.servicio_id = $1
        `, [servicio_id]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener reporte filtrado:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

