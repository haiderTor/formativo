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
    const {nombre,nombre_usuario, correo, contrasena} = req.body;

    try{
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
    const{tipo_documento,documento,nombres,apellidos,telefono,correo,direccion,ciudad} = req.body

    try {
        const query = await pool.query('INSERT INTO clientes(tipo_documento,documento,nombres,apellidos,telefono,correo,direccion,ciudad) VALUES($1, $2, $3,$4, $5, $6, $7, $8) RETURNING *',[tipo_documento,documento,nombres,apellidos,telefono,correo,direccion,ciudad]);
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
    const{tipo_equipo,modelo,referencia,numero_serie,estado,marca_id,cliente_id} = req.body

    try {
        const query = await pool.query('INSERT INTO equipo(tipo_equipo,modelo,referencia,numero_serie,estado,marca_id,cliente_id) VALUES($1, $2, $3,$4, $5, $6, $7) RETURNING *',[tipo_equipo,modelo,referencia,numero_serie,estado,marca_id,cliente_id]);
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

