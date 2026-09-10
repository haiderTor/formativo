import express from "express";
import { pool } from "../server.js"; // conexión exportada desde server.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/auth.js";
import { validateRegister } from "../middleware/validate.js";

const router = express.Router();

// ================== USUARIOS ==================

// Registro de usuario
router.post("/api/usuario", validateRegister, async (req, res) => {
    const { nombre, nombre_usuario, correo, contrasena } = req.body;
    try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const query = await pool.query(
      "INSERT INTO usuario (nombre, nombre_usuario, correo, contrasena) VALUES ($1, $2, $3, $4) RETURNING *",
        [nombre, nombre_usuario, correo, hashedPassword]
    );
    res.status(201).json({ success: true, data: query.rows[0] });
    } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Login de usuario
router.post("/api/login", async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
        // Buscar usuario por correo
        const query = await pool.query("SELECT * FROM usuario WHERE correo=$1", [correo]);
        if (query.rows.length === 0) {
        return res.status(401).json({ success: false, message: "Usuario no encontrado" });
    }

    const usuario = query.rows[0];

    // Validar contraseña con bcrypt
    const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!validPassword) {
        return res.status(401).json({ success: false, message: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.usuario_id, correo: usuario.correo }, // payload
      process.env.JWT_SECRET,                             // clave secreta en .env
      { expiresIn: "1h" }                                 // duración del token
    );

    // Responder con token
    res.json({
        success: true,
        message: "Login exitoso",
        token,
        usuario: { id: usuario.usuario_id, nombre: usuario.nombre, correo: usuario.correo }
    });

    console.log("Usuario autenticado:", usuario);
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});


// Perfil protegido REVISAR
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const result = await pool.query("SELECT usuario_id, nombre, correo FROM usuario WHERE usuario_id=$1", [req.user.id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// ================== EQUIPOS ==================
router.get("/equipo", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.*, m.nombre AS nombre_marca, c.nombres AS cliente_nombres, c.apellidos AS cliente_apellidos
            FROM equipo e
            LEFT JOIN marca m ON e.marca_id = m.marca_id
            LEFT JOIN clientes c ON e.cliente_id = c.cliente_id
            ORDER BY e.equipo_id DESC
        `);
        res.json(result.rows);
        } catch (error) {
        res.status(500).json({ success: false, error: "Internal Server Error" });
        }
});


// revisar si el correo y la contraseña son correctos para dejar entrar al usuario
router.post('/login', async (req, res) => {
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

// registrar un usuario nuevo en el sistema
router.post('/api/usuario', async (req, res) => {
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


//EQUIPO


// pedir todos los equipos juntando tablas para traer el nombre de la marca y del cliente
router.get('/api/equipo', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.*, 
                m.nombre AS nombre_marca, 
                c.nombres AS cliente_nombres, 
                c.apellidos AS cliente_apellidos
                FROM equipo e
                LEFT JOIN marca m ON e.marca_id = m.marca_id
                LEFT JOIN clientes c ON e.cliente_id = c.cliente_id
                ORDER BY e.equipo_id DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching equipos:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// crear un equipo nuevo en la base de datos
router.post('/api/equipo', async (req, res) => {
    const { tipo_equipo, modelo, referencia, numero_serie, observaciones, marca_id, cliente_id } = req.body;

    try {
        const query = await pool.query(
            'INSERT INTO equipo(tipo_equipo, modelo, referencia, numero_serie, observaciones, marca_id, cliente_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', 
            [tipo_equipo, modelo, referencia, numero_serie, observaciones, marca_id, cliente_id]
        );
        res.status(201).json(query.rows[0]);
        console.log('Equipo registrado correctamente:', query.rows[0]);
    } catch (error) {
        console.error('Error inserting equipo:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// actualizar los datos de un equipo que ya existe
router.put('/api/equipo/:id', async (req, res) => {
    const { id } = req.params;
    const { tipo_equipo, modelo, referencia, numero_serie, observaciones, marca_id, cliente_id } = req.body;
    try {
        const result = await pool.query(
            `UPDATE equipo SET 
                tipo_equipo=$1, 
                modelo=$2, 
                referencia=$3, 
                numero_serie=$4, 
                observaciones=$5, 
                marca_id=$6, 
                cliente_id=$7 
               WHERE equipo_id=$8 RETURNING *`,
            [tipo_equipo, modelo, referencia, numero_serie, observaciones, marca_id, cliente_id, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating equipo:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// borrar un equipo de la base de datos
router.delete('/api/equipo/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM equipo WHERE equipo_id=$1', [id]);
        res.json({ success: true, message: 'Equipo eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting equipo:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


//PERSONAS 


// pedir todos los clientes de la base de datos
router.get('/api/clientes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clientes ORDER BY cliente_id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching clientes:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// guardar un cliente nuevo
router.post('/api/clientes', async (req, res) => {
    const { tipo_documento, documento, nombres, apellidos, telefono, correo, direccion, ciudad } = req.body;

    const apellidosValue = apellidos && apellidos.trim() !== '' ? apellidos : null;

    try {
        const query = await pool.query(
            'INSERT INTO clientes(tipo_documento, documento, nombres, apellidos, telefono, correo, direccion, ciudad) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', 
            [tipo_documento, documento, nombres, apellidosValue, telefono, correo, direccion, ciudad]
        );
        res.status(201).json(query.rows[0]);
        console.log('Cliente registrado correctamente:', query.rows[0]);
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// editar la informacion de un cliente
router.put('/api/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const { tipo_documento, documento, nombres, apellidos, telefono, correo, direccion, ciudad } = req.body;

    const apellidosValue = apellidos && apellidos.trim() !== '' ? apellidos : null;

    try {
        const result = await pool.query(
            `UPDATE clientes SET 
                tipo_documento=$1, 
                documento=$2, 
                nombres=$3, 
                apellidos=$4, 
                telefono=$5, 
                correo=$6, 
                direccion=$7, 
                ciudad=$8
               WHERE cliente_id=$9 RETURNING *`,
            [tipo_documento, documento, nombres, apellidosValue, telefono, correo, direccion, ciudad, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating cliente:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// eliminar un cliente
router.delete('/api/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM clientes WHERE cliente_id=$1', [id]);
        res.json({ success: true, message: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting cliente:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// traer una lista de clientes desplegables
router.get('/api/listaclientes', async (req, res) => {
    try {
        const result = await pool.query('SELECT cliente_id, nombres, apellidos FROM clientes ORDER BY nombres ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener lista de clientes:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


//EMPLEADOS


// pedir todos los empleados
router.get('/api/empleado', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM empleado ORDER BY empleado_id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching empleados:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// registrar un empleado nuevo
router.post('/api/empleado', async (req, res) => {
    const { tipo_documento, documento, nombres, apellidos, especialidad, telefono, correo, cargo } = req.body;

    try {
        const query = await pool.query(
            'INSERT INTO empleado (tipo_documento, documento, nombres, apellidos, especialidad, telefono, correo, cargo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [tipo_documento, documento, nombres, apellidos, especialidad, telefono, correo, cargo]
        );

        res.status(201).json(query.rows[0]);
        console.log('Empleado registrado correctamente:', query.rows[0]);
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// editar los datos de un empleado
router.put('/api/empleado/:id', async (req, res) => {
    const { id } = req.params;
    const { tipo_documento, documento, nombres, apellidos, especialidad, telefono, correo, cargo } = req.body;
    try {
        const result = await pool.query(
            `UPDATE empleado SET 
                tipo_documento=$1, 
                documento=$2, 
                nombres=$3, 
                apellidos=$4, 
                especialidad=$5, 
                telefono=$6, 
                correo=$7, 
                cargo=$8
               WHERE empleado_id=$9 RETURNING *`,
            [tipo_documento, documento, nombres, apellidos, especialidad, telefono, correo, cargo, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating empleado:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// borrar un empleado de la lista
router.delete('/api/empleado/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM empleado WHERE empleado_id=$1', [id]);
        res.json({ success: true, message: 'Empleado eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting empleado:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// traer una lista de empleados desplegables
router.get('/api/listaempleados', async (req, res) => {
    try {
        const result = await pool.query('SELECT empleado_id, nombres, apellidos, cargo FROM empleado ORDER BY nombres ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener lista de empleados:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


//SERVICIOS


// traer la lista de los servicios disponibles
router.get('/api/servicios', async (req, res) => {
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

// crear un servicio nuevo con su precio
router.post('/api/servicios', async (req, res) => {
    const { nombre, descripcion, precio_base, observaciones } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO servicio (nombre, descripcion, precio_base, observaciones) VALUES ($1, $2, $3, $4) RETURNING servicio_id, nombre, descripcion, precio_base, observaciones',
            [nombre, descripcion, precio_base, observaciones]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear el servicio:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// editar el nombre o precio de un servicio
router.put('/api/servicios/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio_base, observaciones } = req.body;
    try {
        const result = await pool.query(
            `UPDATE servicio SET 
                nombre=$1, 
                descripcion=$2, 
                precio_base=$3, 
                observaciones=$4 
               WHERE servicio_id=$5 RETURNING *`,
            [nombre, descripcion, precio_base, observaciones, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating servicio:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// eliminar un servicio 
router.delete('/api/servicios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM servicio WHERE servicio_id=$1', [id]);
        res.json({ success: true, message: 'Servicio eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting servicio:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// traer una lista de servicios desplegables
router.get('/api/listaservicios', async (req, res) => {
    try {
        const result = await pool.query('SELECT servicio_id, nombre FROM servicio ORDER BY nombre ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener lista de servicios:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


//TICKETS


// pedir todos los tickets y juntar la informacion 
router.get('/api/tickets', async (req, res) => {
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

// crear un ticket nuevo para reportar un daño
router.post('/api/tickets', async (req, res) => {
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

// actualizar la informacion o estado de un ticket
router.put('/api/tickets/:id', async (req, res) => {
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

// borrar un ticket del sistema
router.delete('/api/tickets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM ticket WHERE ticket_id=$1', [id]);
        res.json({ success: true, message: 'Ticket eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


//REPORTE


// traer los clientes para los reportes
router.get('/api/reporteclientes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clientes');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching clientes:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// traer los equipos para los reportes juntando sus marcas y clientes
router.get('/api/reporteequipos', async (req, res) => {
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


//MARCA


// traer la lista de marcas desplegable
router.get('/api/marca', async (req, res) => {
    try {
        const result = await pool.query('SELECT marca_id, nombre FROM marca ORDER BY nombre ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching marcas:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


// INICIAR SERVIDOR

export default router;
