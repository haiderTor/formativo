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

/* lo que sea*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

