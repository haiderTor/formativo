import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import router from "./routes/routes.js";
import pg from "pg";

dotenv.config();
const { Pool } = pg;
const app = express();

// Seguridad global
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(morgan("dev"));

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a PostgreSQL
export const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Rutas
app.use("/", router);

app.listen(process.env.PORT || 3000, () =>
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 3000}`)
);
