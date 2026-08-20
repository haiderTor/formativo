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

        if (usuario.contrasena !== contrasena) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
            });
        }

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
    const { tipo_documento, documento, nombres, apellidos, telefono, correo, direccion, ciudad } = req.body;

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
    const { tipo_equipo, modelo, referencia, numero_serie, estado, marca_id, cliente_id } = req.body;

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
        const result = await pool.query('SELECT * FROM clientes');
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

app.get('/routes/listaempleados', async (req, res) => {
    try {
        const result = await pool.query('SELECT empleado_id, nombres, apellidos, cargo FROM empleado ORDER BY nombres ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener lista de empleados:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.get('/routes/listaclientes', async (req, res) => {
    try {
        const result = await pool.query('SELECT cliente_id, nombres, apellidos FROM clientes ORDER BY nombres ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener lista de clientes:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.get('/routes/listaservicios', async (req, res) => {
    try {
        const result = await pool.query('SELECT servicio_id, nombre FROM servicio ORDER BY nombre ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener lista de servicios:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Endpoints de Tickets
app.get('/routes/tickets', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                t.ticket_id,
                t.fecha_creacion,
                t.descripcion_falla,
                t.diagnostico,
                t.estado_ticket,
                t.observaciones,
                t.equipo_id,
                t.empleado_id,
                e.tipo_equipo AS nombre_equipo,
                c.nombres AS cliente_nombre,
                c.apellidos AS cliente_apellido,
                emp.nombres AS empleado_nombre,
                emp.apellidos AS empleado_apellido
            FROM ticket t
            JOIN equipo e ON t.equipo_id = e.equipo_id
            JOIN clientes c ON e.cliente_id = c.cliente_id
            JOIN empleado emp ON t.empleado_id = emp.empleado_id
            ORDER BY t.fecha_creacion DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.post('/routes/tickets', async (req, res) => {
    const { fecha_creacion, descripcion_falla, diagnostico, estado_ticket, observaciones, equipo_id, empleado_id } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO ticket 
            (fecha_creacion, descripcion_falla, diagnostico, estado_ticket, observaciones, equipo_id, empleado_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [fecha_creacion, descripcion_falla, diagnostico, estado_ticket, observaciones, equipo_id, empleado_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.put('/routes/tickets/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha_creacion, descripcion_falla, diagnostico, estado_ticket, observaciones, equipo_id, empleado_id } = req.body;
    try {
        const result = await pool.query(
            `UPDATE ticket SET 
                fecha_creacion=$1, 
                descripcion_falla=$2, 
                diagnostico=$3, 
                estado_ticket=$4, 
                observaciones=$5, 
                equipo_id=$6, 
                empleado_id=$7
             WHERE ticket_id=$8 RETURNING *`,
            [fecha_creacion, descripcion_falla, diagnostico, estado_ticket, observaciones, equipo_id, empleado_id, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.delete('/routes/tickets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM ticket WHERE ticket_id=$1', [id]);
        res.json({ success: true, message: 'Ticket eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Endpoints de Servicios
app.get('/routes/servicios', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT servicio_id, nombre, descripcion, precio_base, observaciones FROM servicio ORDER BY nombre ASC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching servicios:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.post('/routes/servicios', async (req, res) => {
    const { nombre, descripcion, precio_base, observaciones } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO servicio (nombre, descripcion, precio_base, observaciones) VALUES ($1, $2, $3, $4) RETURNING servicio_id, nombre, descripcion, precio_base, observaciones',
            [nombre, descripcion, precio_base, observaciones]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating servicio:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});