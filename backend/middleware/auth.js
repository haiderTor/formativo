import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
    return res.status(403).json({ error: "Token requerido" });
    }

    const token = authHeader.replace("Bearer ", "");
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // aquí guardamos el payload del token
    next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
}; 
